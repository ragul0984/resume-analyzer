import { HfInference } from "@huggingface/inference";
import { NextResponse } from "next/server";

const hf = new HfInference(process.env.HF_TOKEN);
const MODEL = "Qwen/Qwen2.5-7B-Instruct";

export async function POST(req: Request) {
  try {
    const { resumeData, jobDetails } = await req.json();

    if (!resumeData || !jobDetails) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const prompt = `
You are a career networking expert. Draft two personalized outreach messages (one Cold Email and one LinkedIn DM) for a candidate applying to a specific job.

Candidate Strengths: ${resumeData.strengths?.map((s: any) => s.point).join(", ")}
Target Job: ${jobDetails.title} at ${jobDetails.company}
Job Description Context: ${jobDetails.description?.substring(0, 300)}...

Guidelines:
1. High-impact, professional, and "Value-First".
2. Link the candidate's specific strengths to the job's likely needs.
3. Keep the LinkedIn DM under 300 characters.
4. Keep the Cold Email concise (2-3 short paragraphs).
5. Use placeholders like [Hiring Manager Name] where appropriate.

Format your response exactly like this:
EMAIL_START
[Subject: ...]
[Body...]
EMAIL_END
LINKEDIN_START
[Message...]
LINKEDIN_END
`;

    const response = await hf.chatCompletion({
      model: MODEL,
      messages: [
        { role: "system", content: "You are a professional career coach." },
        { role: "user", content: prompt },
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    const output = response.choices[0]?.message?.content || "";

    const emailMatch = output.match(/EMAIL_START([\s\S]*?)EMAIL_END/);
    const linkedinMatch = output.match(/LINKEDIN_START([\s\S]*?)LINKEDIN_END/);

    return NextResponse.json({
      email: emailMatch ? emailMatch[1].trim() : "Failed to generate email.",
      linkedin: linkedinMatch ? linkedinMatch[1].trim() : "Failed to generate LinkedIn message.",
    });

  } catch (error: any) {
    console.error("Networking Draft Error:", error);
    return NextResponse.json({ error: "Failed to generate drafts" }, { status: 500 });
  }
}
