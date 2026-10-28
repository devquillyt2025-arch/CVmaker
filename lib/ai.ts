import type Anthropic from '@anthropic-ai/sdk';

/**
 * Every AI feature runs on Claude Haiku 5.5 — the fast, low-cost tier, which is
 * plenty for resume extraction, short rewrites and suggestions. Requests use
 * `effort: 'low'`, its cheapest setting.
 */
export const AI_MODEL = 'claude-haiku-5-5';

/** Shown when the model's safety checks decline a request (`stop_reason: 'refusal'`). */
export const AI_DECLINED = "The AI couldn't help with this text. Try rewording it.";

/**
 * The answer text of a response. Haiku 5.5 thinks before answering, so a
 * response can open with thinking blocks — read text blocks by type, never by
 * position.
 */
export function responseText(message: Anthropic.Message): string {
  return message.content
    .filter((block): block is Anthropic.TextBlock => block.type === 'text')
    .map((block) => block.text)
    .join('');
}
