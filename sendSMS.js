// Load environment variables from Netlify-style env or a .env file for local testing
require('dotenv').config(); // Optional if you're testing locally with a .env file

const twilio = require('twilio');

// Use environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER; // Your Twilio number

const client = twilio(accountSid, authToken);

// Replace with your personal number to receive the text
client.messages
  .create({
    body: 'Hello from Twilio via Node.js!',
    from: fromNumber,
    to: '+18312347766' // Your mobile number
  })
  .then(message => console.log(`Message sent! SID: ${message.sid}`))
  .catch(error => console.error(error));