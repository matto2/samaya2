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
    const { triggerEvent, payload } = body;

    console.log("Received Cal.com webhook:", triggerEvent, payload);

    const name = payload?.attendees?.[0]?.name || "a client";
    const rawStart = payload?.startTime;
    const title = payload?.title || "Appointment";
    const description = payload?.description || "";

    const localTime = rawStart
      ? new Date(rawStart).toLocaleString("en-US", {
          timeZone: "America/Los_Angeles",
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      : "unknown time";

    let message = "";

    switch (triggerEvent) {
      case "BOOKING_CREATED":
        message = `✅ New booking:\n${title}\n${description}\n📅 ${localTime}`;
        break;

      case "BOOKING_RESCHEDULED":
        const oldTime = payload?.rescheduleStartTime
          ? new Date(payload.rescheduleStartTime).toLocaleString("en-US", {
              timeZone: "America/Los_Angeles",
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })
          : "unknown time";

        message = `🔁 Rescheduled:\n${title}\n${description}\n⏱️ From: ${oldTime}\n➡️ To: ${localTime}`;
        break;

      case "BOOKING_CANCELLED":
        message = `❌ Cancelled booking:\n${title}\n${description}\n🗓️ Was scheduled for ${localTime}`;
        break;

      default:
        message = `📅 Booking update:\n${title}\n${description}\n📆 ${localTime}`;
    }

    // Append no-reply and contact info
    message += `\n\nThis is a no-reply message.\nCall or text Samaya: (831) 588-9581`;

    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: process.env.CLIENT_PHONE,
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