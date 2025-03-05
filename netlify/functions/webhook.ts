import { Handler } from "@netlify/functions";
import { Vonage } from "@vonage/server-sdk";

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY as string,
  apiSecret: process.env.VONAGE_API_SECRET as string,
});

// Set the fixed phone number that will receive all appointment info
const FIXED_PHONE_NUMBER = "+18453960964"; // Replace with your number

export const handler: Handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method Not Allowed" }),
      };
    }

    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing JSON body" }),
      };
    }

    let data;
    try {
      data = JSON.parse(event.body);
    } catch (err) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid JSON format" }),
      };
    }

    console.log("📩 Received Webhook Data:", data);

    // Extract appointment details from Cal.com webhook
    const attendeeName = data?.attendees?.[0]?.name || "Unknown Attendee";
    const eventType = data?.eventType?.title || "No Event Title";
    const startTime = data?.startTime || "Unknown Time";

    // Format the SMS message
    const message = `New appointment booked!\n📅 Event: ${eventType}\n🕒 Time: ${startTime}\n👤 Attendee: ${attendeeName}`;

    // Send SMS to the FIXED number
    await vonage.sms.send({
      to: FIXED_PHONE_NUMBER,
      from: process.env.VONAGE_VIRTUAL_NUMBER as string,
      text: message,
    });

    console.log("✅ SMS Sent Successfully to", FIXED_PHONE_NUMBER);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "SMS sent successfully!",
      }),
    };
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: (error as Error).message }),
    };
  }
};
