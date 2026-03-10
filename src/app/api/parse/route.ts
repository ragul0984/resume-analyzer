import { NextResponse } from 'next/server';
import PDFParser from 'pdf2json';
import * as mammoth from 'mammoth';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('resume') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let extractedText = '';

    if (file.type === 'application/pdf') {
      await new Promise<void>((resolve, reject) => {
        const pdfParser = new PDFParser(null, true);
        pdfParser.on("pdfParser_dataError", (errData: any) => reject(new Error(errData.parserError)));
        pdfParser.on("pdfParser_dataReady", () => {
          extractedText = pdfParser.getRawTextContent().replace(/\r\n/g, " ");
          resolve();
        });
        pdfParser.parseBuffer(buffer);
      });
    } else if (file.name.endsWith('.docx') || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else {
       return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    if (!extractedText.trim()) {
      return NextResponse.json({ error: 'No text could be extracted. If your resume is an image or scan, please upload a standard text-based PDF or DOCX file.' }, { status: 400 });
    }

    // Optional: truncate excessively long resumes to fit in LLM contexts better (e.g. 15,000 chars)
    const processedText = extractedText.substring(0, 15000);

    return NextResponse.json({ success: true, text: processedText });

  } catch (error: any) {
    console.error('Parse error:', error);
    return NextResponse.json({ error: error.message || 'Failed to parse document' }, { status: 500 });
  }
}
