import { checkAndConsumeCredit } from '@/lib/credits';
import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { AI_MODEL, AI_DECLINED, responseText } from '@/lib/ai';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

export async function POST(req: Request) {
  const creditCheck = await checkAndConsumeCredit();
  if (!creditCheck.allowed) {
    return NextResponse.json({ error: creditCheck.error }, { status: 402 });
  }

  try {
    const { jobTitle, industry } = await req.json();

    if (!jobTitle) {
      return NextResponse.json({ error: 'Job title is required' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Anthropic API key not configured' },
        { status: 500 }
      );
    }

    const prompt = `You are an expert technical recruiter and career coach. 
Suggest a list of exactly 10 highly relevant, ATS-friendly skills for a candidate targeting the role of: ${jobTitle} ${industry ? `in the ${industry} industry` : ''}.

Mix hard technical skills and important soft skills that ATS systems typically scan for this role.

Output exactly a comma-separated list of 10 skills. No numbers, no bullet points, no introductory text. For example: React.js, TypeScript, Project Management, Agile, Communication, Node.js, GraphQL, SEO, Data Analysis, Leadership`;

    const response = await anthropic.messages.create({
      model: AI_MODEL,
      max_tokens: 1024, // room for thinking as well as the short list
      output_config: { effort: 'low' },
      messages: [{ role: 'user', content: prompt }],
    });

    if (response.stop_reason === 'refusal') {
      return NextResponse.json({ error: AI_DECLINED }, { status: 422 });
    }
    const text = responseText(response).trim();
    const skills = text.split(',').map(s => s.trim()).filter(Boolean);

    return NextResponse.json({ skills });
  } catch (error) {
    console.error('Error suggesting skills:', error);
    return NextResponse.json(
      { error: 'Failed to suggest skills' },
      { status: 500 }
    );
  }
}
