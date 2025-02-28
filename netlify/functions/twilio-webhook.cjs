const twilio = require("twilio");

const apiKeySid = process.env.TWILIO_API_KEY_SID;
const apiKeySecret = process.env.TWILIO_API_KEY_SECRET;
const accountSid = process.env.TWILIO_SID;  // Explicitly pass this!
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const myPhoneNumber = process.env.MY_PHONE_NUMBER;
const webhookSecret = process.env.CAL_WEBHOOK_SECRET;

// ✅ Correct Twilio initialization for API Keys:
const twilioClient = twilio(apiKeySid, apiKeySecret, { accountSid });

module.exports.handler = async (event) => {
    try {
        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "No body provided" }),
            };
        }

        // Verify Webhook Secret
        const receivedSecret = event.headers["x-cal-secret"];
        if (receivedSecret !== webhookSecret) {
            console.warn("Invalid webhook secret received!");
            return {
                statusCode: 401,
                body: JSON.stringify({ error: "Unauthorized" }),
            };
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