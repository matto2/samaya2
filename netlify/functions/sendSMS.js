const axios = require('axios');

exports.handler = async (event) => {
    try {
        console.log("Incoming event body:", event.body); // Debugging log

        // Ensure event.body is properly formatted
        const body = typeof event.body === "string" ? JSON.parse(event.body) : event.body;
        const { phone, message } = body;

        // Get API key from Netlify environment variables
        const apiKey = process.env.TEXTBELT_API_KEY;
        if (!apiKey) {
            throw new Error("Missing Textbelt API key in environment variables.");
        }

        // Send SMS via Textbelt
        const response = await axios.post('https://textbelt.com/text', {
            phone: phone,
            message: message,
            key: apiKey
        });

        return {
            statusCode: 200,
            body: JSON.stringify(response.data),
        };
    } catch (error) {
        console.error("Error:", error.message); // Log errors for debugging
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};