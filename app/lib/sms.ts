export async function sendSMS(to: string, msg: string) {
  try {
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

    if (!response.ok) {
      throw new Error(`SMS Notify API returned status ${response.status}`);
    }

    const textResponse = await response.text();
    return {
      success: true,
      status: response.status,
      response: textResponse
    };
  } catch (error: any) {
    console.error('sendSMS helper error:', error);
    throw error;
  }
}
