import { HfInference } from "@huggingface/inference";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const token = process.env.HF_TOKEN?.trim();
    if (!token) {
      return NextResponse.json({ error: "Missing HF_TOKEN" }, { status: 401 });
    }
    const hf = new HfInference(token);
    const MODEL = "Qwen/Qwen2.5-Coder-32B-Instruct";

    const { mode, resumeText, jobDescription, question, answer } = await req.json();

    if (mode === "generate") {
      const prompt = `
        You are an expert interviewer. Based on the following resume and job description, generate 5 challenging and relevant interview questions.
        Return the response ONLY as a JSON array of strings.

        RESUME:
        ${resumeText}

        JOB DESCRIPTION:
        ${jobDescription}

        QUESTIONS (JSON Array of strings):
      `;

      const response = await hf.chatCompletion({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1500,
        temperature: 0.1,
      });

      const text = response.choices[0]?.message?.content?.trim() || "[]";
      // Basic JSON extraction if model wraps in code blocks
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      const questions = JSON.parse(jsonMatch ? jsonMatch[0] : text);
      return NextResponse.json({ questions });
    }

    if (mode === "evaluate") {
      const prompt = `
        You are an expert interviewer. Evaluate the following user answer to an interview question.
        Provide a score from 0 to 100, specific feedback on what was good, and specific advice on how to improve.
        Return the response ONLY as a JSON object with keys: "score" (number), "feedbackGood" (string), "feedbackImprove" (string).

        QUESTION:
        ${question}

        USER ANSWER:
        ${answer}

        EVALUATION (JSON Object):
      `;

      const response = await hf.chatCompletion({
        model: MODEL,
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature: 0.1,
      });

      const text = response.choices[0]?.message?.content?.trim() || "{}";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      const evaluation = JSON.parse(jsonMatch ? jsonMatch[0] : text);
      return NextResponse.json(evaluation);
    }

    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
  } catch (error) {
    console.error("Interview API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
