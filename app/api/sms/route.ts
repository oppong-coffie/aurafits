import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { to, msg } = await request.json();

    if (!to || !msg) {
      return NextResponse.json(
        { success: false, message: 'Recipient (to) and message (msg) are required in request body.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.SMS_API_KEY || 'placeholder_key';
    const senderId = process.env.SMS_SENDER_ID || 'placeholder_sender';

    const url = new URL('https://sms.smsnotifygh.com/smsapi');
    url.searchParams.set('key', apiKey);
    url.searchParams.set('to', to);
    url.searchParams.set('msg', msg);
    url.searchParams.set('sender_id', senderId);

    const response = await fetch(url.toString(), {
      method: 'GET',
    });

    const textResponse = await response.text();

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      response: textResponse
    });
  } catch (error: any) {
    console.error('SMS API Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to send SMS.' },
      { status: 500 }
    );
  }
}
