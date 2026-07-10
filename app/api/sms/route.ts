import { NextResponse } from 'next/server';
import { sendSMS } from '@/app/lib/sms';

export async function POST(request: Request) {
  try {
    const { to, msg } = await request.json();

    if (!to || !msg) {
      return NextResponse.json(
        { success: false, message: 'Recipient (to) and message (msg) are required in request body.' },
        { status: 400 }
      );
    }

    const result = await sendSMS(to, msg);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('SMS API Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to send SMS.' },
      { status: 500 }
    );
  }
}
