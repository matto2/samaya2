import { config } from 'dotenv';
config();
import { Vonage } from "@vonage/server-sdk";

export async function handler(event) {
    try {
        const data = JSON.parse(event.body);
        console.log("Received Webhook Data:", data);

        // Extract phone number from Cal.com webhook data
        const phone = data?.attendees?.[0]?.phoneNumber; 
        const message = `Your appointment is confirmed for ${data.startTime}`;

        if (!phone) {
            return { statusCode: 400, body: JSON.stringify({ error: "Phone number is required" }) };
        }

        // Initialize Vonage SDK
        const vonage = new Vonage({
            apiKey: process.env.VONAGE_API_KEY,
            apiSecret: process.env.VONAGE_API_SECRET
        });

        // Send SMS via Vonage
        await vonage.sms.send({
            to: phone,
            from: process.env.VONAGE_VIRTUAL_NUMBER,
            text: message
        });

        return { statusCode: 200, body: JSON.stringify({ success: true, message: "SMS sent successfully!" }) };

    } catch (error) {
        console.error("Webhook Error:", error);
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
}