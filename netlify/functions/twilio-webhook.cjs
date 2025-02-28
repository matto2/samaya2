import { Handler } from "@netlify/functions";
import twilio from "twilio";

const apiKeySid = process.env.TWILIO_API_KEY_SID as string;
const apiKeySecret = process.env.TWILIO_API_KEY_SECRET as string;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER as string;
const myPhoneNumber = process.env.MY_PHONE_NUMBER as string;
const webhookSecret = process.env.CAL_WEBHOOK_SECRET as string;

const twilioClient = twilio(apiKeySid, apiKeySecret);

export const handler: Handler = async (event) => {
    try {
        if (!event.body) {
            return { statusCode: 400, body: JSON.stringify({ error: "No body provided" }) };
        }

        // Verify Webhook Secret
        const receivedSecret = event.headers["x-cal-secret"];
        if (receivedSecret !== webhookSecret) {
            console.warn("Invalid webhook secret received!");
            return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized" }) };
        }

        const data = JSON.parse(event.body);
        const { name, startTime } = data;

        const message = `New appointment booked!\nName: ${name}\nStart: ${startTime}`;

        await twilioClient.messages.create({
            body: message,
            from: twilioNumber,
            to: myPhoneNumber,
        });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "SMS sent successfully!" }),
        };
    } catch (error) {
        console.error("Error sending SMS:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to send SMS." }),
        };
    }
};