const twilio = require('twilio');

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

exports.handler = async (event) => {
  try {
    const payload = JSON.parse(event.body);

    // For debugging (optional)
    console.log("Received Cal.com webhook:", payload);

    // Your acupuncturist's phone number (from Netlify env var)
    const acupuncturistPhone = process.env.CLIENT_PHONE;

    // Compose a message from the booking info
    const name = payload?.attendees?.[0]?.name || 'a new client';
    const time = payload?.startTime || 'an upcoming appointment';

    const message = `New booking from ${name} at ${time}.`;

    // Send SMS via Twilio
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE, // Your Twilio number
      to: acupuncturistPhone
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error("Error sending SMS:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send SMS" }),
    };
  }
};