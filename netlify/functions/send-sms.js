const twilio = require('twilio');

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

exports.handler = async (event) => {
  try {
    if (!event.body) {
      throw new Error("Missing request body");
    }

    const body = JSON.parse(event.body);

    console.log("Received Cal.com webhook:", body);

    const payload = body.payload;
    const name = payload?.attendees?.[0]?.name || "a new client";
    const time = payload?.startTime || "a scheduled time";

    const message = `New booking from ${name} at ${time}.`;

    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,   // ✅ Must be a full E.164 phone number like +18315551234
      to: process.env.CLIENT_PHONE
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (err) {
    console.error("Error sending SMS:", err.message, err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to send SMS", details: err.message }),
    };
  }
};