const axios = require('axios');

exports.handler = async (event) => {
    try {
        // Parse incoming request (from Cal.com webhook or any other source)
        const { phone, message } = JSON.parse(event.body);

        // Get API key from Netlify environment variables
        const apiKey = process.env.TEXTBELT_API_KEY;

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
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};