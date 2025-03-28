const twilio = require('twilio');

exports.handler = async function () {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;
  const toNumber = '+18312347766'; // Replace this with your real number

  const client = twilio(accountSid, authToken);

  try {
    const message = await client.messages.create({
      body: '🚀 Test SMS from deployed Netlify function!',
      from: fromNumber,
      to: toNumber
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, sid: message.sid })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
};