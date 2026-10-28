import { checkAndConsumeCredit } from '@/lib/credits';
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { AI_MODEL, AI_DECLINED, responseText } from '@/lib/ai';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' });

export async function POST(req: Request) {
  const creditCheck = await checkAndConsumeCredit();
  if (!creditCheck.allowed) {
    return NextResponse.json({ error: creditCheck.error }, { status: 402 });
  }

  try {
    const { summary, jobTitle, skills, experience } = await req.json();

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const skillNames = (skills || []).map((s: { name: string }) => s.name).join(', ');
    const roles = (experience || []).map((e: { position: string }) => e.position).join(', ');

    const prompt = `You are an ATS optimization expert. Identify 6-8 ATS keywords MISSING from this professional summary that are relevant to the role.

Role: ${jobTitle || 'Not specified'}
Experience: ${roles || 'Not specified'}
Skills listed: ${skillNames || 'Not specified'}
Current summary: "${summary || '(empty)'}"

Return ONLY a JSON array of short keyword/phrase strings (max 3 words each). Focus on industry-specific technical terms, tools, and competencies the role needs.

Example: ["data pipeline", "ETL", "stakeholder management", "cross-functional"]

Return ONLY the JSON array. No explanation.`;

    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 1024, // room for thinking as well as the short list
      output_config: { effort: 'low' },
      messages: [{ role: 'user', content: prompt }],
    });

    if (response.stop_reason === 'refusal') {
      return NextResponse.json({ error: AI_DECLINED }, { status: 422 });
    }
    const text = responseText(response).trim() || '[]';
    const match = text.match(/\[[\s\S]*\]/);
    const keywords = match ? JSON.parse(match[0]) : [];

    return NextResponse.json({ keywords: Array.isArray(keywords) ? keywords.slice(0, 10) : [] });
  } catch (error) {
    console.error('Error suggesting keywords:', error);
    return NextResponse.json({ error: 'Failed to suggest keywords' }, { status: 500 });
  }
}
