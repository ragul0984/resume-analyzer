import { NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

// Use a free open source model on Hugging Face (e.g., Qwen Series, Llama 3, or Mixtral)
// Note: Some models require a HF_TOKEN in .env.local, but some smaller ones might work without it.
export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'No resume text provided' }, { status: 400 });
    }

    const token = process.env.HF_TOKEN?.trim();
    if (!token || !token.startsWith('hf_')) {
      return NextResponse.json({
        error: 'Invalid or missing API Key',
        details: 'The Hugging Face API requires a valid access token. Please create a .env.local file in the project root, add HF_TOKEN=hf_your_token (get it free from huggingface.co/settings/tokens), and restart the server.'
      }, { status: 401 });
    }

    const hf = new HfInference(token);
    const MODEL = 'Qwen/Qwen2.5-Coder-32B-Instruct'; // Powerful open source model for reasoning

    const prompt = `
You are an expert AI Resume Analyzer and Career Coach. 
Analyze the following resume text and provide a structured JSON response. 
Do not include any text outside of the JSON block.

Provide the following JSON structure:
{
  "score": <overall score out of 100 based on impact, clarity, and skills>,
  "skills": ["skill1", "skill2", ...],
  "skillsToLearn": [
    {
      "step": 1,
      "skill": "skill name",
      "detailedExplanation": "A 2-3 sentence deep-dive on why this is critical.",
      "resourceQuery": "YouTube search query for this skill"
    }
  ],
  "strengths": [
    {
      "point": "strength point",
      "detailedExplanation": "A detailed explanation of why this strength stands out."
    }
  ],
  "weaknesses": [
    {
      "point": "weakness point",
      "detailedExplanation": "A detailed constructive explanation of why this is a weakness and the impact."
    }
  ],
  "recommendations": [
    {
      "advice": "actionable advice",
      "detailedExplanation": "A detailed 2-3 sentence guide on how exactly to implement this advice."
    }
  ],
  "careerPaths": [
    {
      "role": "Role Name",
      "matchPercentage": <number>,
      "why": "Brief reason why"
    }
  ],
  "linkedInOptimization": {
    "headline": "A keyword-rich, professional LinkedIn headline",
    "about": "A compelling 'About' section summary (3-4 paragraphs)",
    "experienceBullets": ["3-5 optimized experience bullet points"]
  },
  "atsOptimization": "Suggestions to improve ATS readability or keywords"
}

IMPORTANT: "skillsToLearn" should be ordered as a logical learning roadmap (Step 1, Step 2, etc.).
"resourceQuery" should be a highly specific search string that would work well on YouTube or Google for a beginner.

Resume Text:
"""
${text}
"""
`;

    // Try to get response
    const response = await hf.chatCompletion({
      model: MODEL,
      messages: [
        { role: 'system', content: 'You are a professional resume analyzer. You MUST return ONLY a valid JSON object. Do not include any conversation, markdown code blocks (like ```json), or text before or after the JSON.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 3500,
      temperature: 0.1,
    });

    const outputText = response.choices[0]?.message?.content || '{}';

    // Parse JSON safely from output text (it might contain markdown blocks)
    let jsonMatch = outputText.match(/```json([\s\S]*?)```/);
    let jsonStr = jsonMatch ? jsonMatch[1].trim() : outputText.trim();

    // Fallback if the bot just returned the JSON without fences
    if (!jsonStr.startsWith('{')) {
      const firstBrace = jsonStr.indexOf('{');
      const lastBrace = jsonStr.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
      }
    }

    // Helper to repair truncated JSON
    const repairJson = (str: string) => {
      let repaired = str.trim();
      // Count braces and brackets
      const openBraces = (repaired.match(/\{/g) || []).length;
      const closeBraces = (repaired.match(/\}/g) || []).length;
      const openBrackets = (repaired.match(/\[/g) || []).length;
      const closeBrackets = (repaired.match(/\]/g) || []).length;

      // Check if last character is a comma or colon
      if (repaired.endsWith(',')) repaired = repaired.slice(0, -1);
      
      // Close unclosed quotes
      const quoteCount = (repaired.match(/"/g) || []).length;
      if (quoteCount % 2 !== 0) repaired += '"';

      // Close missing braces/brackets
      for (let i = 0; i < openBrackets - closeBrackets; i++) repaired += ']';
      for (let i = 0; i < openBraces - closeBraces; i++) repaired += '}';
      
      return repaired;
    };

    let parsedData;
    try {
      parsedData = JSON.parse(jsonStr);
    } catch (e) {
      console.warn('JSON parsing failed, attempting repair...', e);
      try {
        parsedData = JSON.parse(repairJson(jsonStr));
      } catch (repairError) {
        console.error('JSON repair failed:', repairError);
        throw new Error('AI returned malformed or incomplete data that could not be repaired.');
      }
    }

    return NextResponse.json({ success: true, analysis: parsedData });

  } catch (error: any) {
    console.error('AI Analysis error:', error);
    return NextResponse.json({
      error: error.message || 'Failed to analyze resume',
      details: 'You may need to add HF_TOKEN to your .env.local file if the rate limit is exceeded.'
    }, { status: 500 });
  }
}
