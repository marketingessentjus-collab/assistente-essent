// Essent — API utility for Anthropic Claude calls
// Note: The API key must be provided by the user via the UI (stored in localStorage)

export async function callClaude(
  systemPrompt: string,
  userPrompt: string,
  apiKey: string,
  onChunk?: (text: string) => void
): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error((err as any)?.error?.message || `Erro HTTP ${response.status}`);
  }

  const data = await response.json();
  const text = (data.content as any[])?.map((c: any) => c.text || '').join('') || '';
  return text;
}

export function getApiKey(): string {
  return localStorage.getItem('essent-api-key') || '';
}

export function setApiKey(key: string): void {
  localStorage.setItem('essent-api-key', key);
}
