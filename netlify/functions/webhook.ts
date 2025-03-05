import { Handler } from "@netlify/functions";
import { Vonage } from "@vonage/server-sdk";

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY as string,
  apiSecret: process.env.VONAGE_API_SECRET as string,
});

export const handler: Handler = async (event) => {
  try {
    // Ensure it's a POST request
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method Not Allowed" }),
      };
    }

    // Check if the request body is empty
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing JSON body" }),
      };
    }

    // Parse the JSON body safely
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

    // Extract phone number & booking details
    const phone: string | undefined = data?.attendees?.[0]?.phoneNumber;
    const message: string = `Your appointment is confirmed for ${data.startTime}`;

    if (!phone) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Phone number is required" }),
      };
    }

    // Send SMS via Vonage
    await vonage.sms.send({
      to: phone,
      from: process.env.VONAGE_VIRTUAL_NUMBER as string,
      text: message,
    });

    console.log("✅ SMS Sent Successfully");

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
