import { defineMiddleware } from "astro/middleware";
import { config } from "dotenv";
import { Vonage } from "@vonage/server-sdk";

config(); // Load environment variables

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
});

export const POST = async ({ request }) => {
  try {
    const data = await request.json();

    console.log("Received Webhook Data:", data);

    const phone = data?.attendees?.[0]?.phoneNumber; // Make sure Cal.com sends a phone number
    const message = `Your appointment is confirmed for ${data.startTime}`;

    if (!phone) {
      return new Response(
        JSON.stringify({ error: "Phone number is required" }),
        { status: 400 }
      );
    }

    // Send SMS via Vonage
    const smsResponse = await vonage.sms.send({
      to: phone,
      from: process.env.VONAGE_VIRTUAL_NUMBER,
      text: message,
    });

    return new Response(JSON.stringify({ success: true, smsResponse }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error in webhook:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
