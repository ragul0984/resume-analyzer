import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

export async function POST(req: Request) {
  try {
    const { resumeText, jobDescription } = await req.json();

    if (!resumeText || !jobDescription) {
      return NextResponse.json({ error: 'Resume text and Job Description are required' }, { status: 400 });
    }

    const token = process.env.HF_TOKEN?.trim();
    if (!token || !token.startsWith('hf_')) {
      return NextResponse.json({ 
        error: 'Invalid or missing API Key', 
        details: 'The Hugging Face API requires a valid access token. Please create a .env.local file in the project root with HF_TOKEN.' 
      }, { status: 401 });
    }

    const hf = new HfInference(token);
    const MODEL = 'Qwen/Qwen2.5-Coder-32B-Instruct';

    const prompt = `
You are an expert ATS (Applicant Tracking System) Scanner and Career Coach.
Analyze the provided Resume against the specific Job Description.
Do not include any text outside of the JSON block.

Provide the following exact JSON structure:
{
  "matchScore": <number between 0 and 100 representing how well the resume fits the job requirements>,
  "missingKeywords": ["keyword1", "keyword2", ...],
  "coverLetter": "A 3-paragraph tailored cover letter emphasizing the strengths from the resume that specifically match the job description requirements."
}

Job Description:
"""
${jobDescription}
"""

Resume:
"""
${resumeText}
"""
`;

    const response = await hf.chatCompletion({
      model: MODEL,
      messages: [
        { role: 'system', content: 'You only reply with valid JSON.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000,
      temperature: 0.3,
    });

    const outputText = response.choices[0]?.message?.content || '{}';
    
    // Parse JSON safely
    let jsonMatch = outputText.match(/```json([\s\S]*?)```/);
    let jsonStr = jsonMatch ? jsonMatch[1].trim() : outputText.trim();
    
    if (!jsonStr.startsWith('{')) {
      const firstBrace = jsonStr.indexOf('{');
      const lastBrace = jsonStr.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
      }
    }

    const parsedData = JSON.parse(jsonStr);

    return NextResponse.json({ success: true, matchData: parsedData });

  } catch (error: any) {
    console.error('ATS Match Error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to analyze job match'
    }, { status: 500 });
  }
}
