import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid message history provided' }, { status: 400 });
    }

    const token = process.env.HF_TOKEN?.trim();
    if (!token || !token.startsWith('hf_')) {
      return NextResponse.json({
        error: 'Invalid or missing API Key',
        details: 'The Hugging Face API requires a valid access token.'
      }, { status: 401 });
    }

    const hf = new HfInference(token);
    const MODEL = 'Qwen/Qwen2.5-Coder-32B-Instruct';

    const systemPrompt = "You are a helpful Career and Resume Assistant AI. The user is currently viewing their resume analysis dashboard. Answer their questions clearly, concisely, and professionally. Use markdown formatting to make your responses readable.";

    // Prepend the system prompt to the user messages
    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...messages
    ];

    const response = await hf.chatCompletion({
      model: MODEL,
      messages: apiMessages,
      max_tokens: 2000,
      temperature: 0.5,
    });

    const outputText = response.choices[0]?.message?.content || 'I am sorry, I could not generate a response.';

    return NextResponse.json({ content: outputText });

  } catch (error: any) {
    console.error('AI Chat error:', error);
    return NextResponse.json({
      error: error.message || 'Failed to process chat message'
    }, { status: 500 });
  }
}
