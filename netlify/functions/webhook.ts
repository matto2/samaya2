import { Handler } from "@netlify/functions";
import { Vonage } from "@vonage/server-sdk";

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY as string,
  apiSecret: process.env.VONAGE_API_SECRET as string,
});

// Set the fixed phone number that will receive the SMS
const FIXED_PHONE_NUMBER = "+18311234567"; // Replace with your actual number

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

    console.log("📩 Full Webhook Data:", JSON.stringify(data, null, 2));

    // ✅ Extract appointment details correctly
    const eventTitle = data?.eventType?.title || "Unknown Event";
    const attendeeName = data?.attendees?.[0]?.name || "Unknown Attendee";
    const startTime = data?.startTime || "Unknown Time";

    // ✅ Format the message properly
    const message = `📅 New Booking!\n🔹 Event: ${eventTitle}\n🔹 Time: ${startTime}\n🔹 Attendee: ${attendeeName}`;

    // ✅ Send SMS to the fixed number
    await vonage.sms.send({
      to: FIXED_PHONE_NUMBER,
      from: process.env.VONAGE_VIRTUAL_NUMBER as string,
      text: message,
    });

    console.log("✅ SMS Sent:", message);

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
