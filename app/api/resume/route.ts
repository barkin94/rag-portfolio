import { fetchResumePdf } from '@/backend/features/cv-sync/google-drive';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const pdfBuffer = await fetchResumePdf();

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Barkin_Buyuksagin_Resume.pdf"',
        'Content-Length': pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Failed to fetch resume PDF:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resume' },
      { status: 500 },
    );
  }
}