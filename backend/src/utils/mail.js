import * as Brevo from '@getbrevo/brevo';

// Initialize the API Instance
const apiInstance = new Brevo.TransactionalEmailsApi();

// Set API Key
if (process.env.BREVO_API_KEY) {
    apiInstance.setApiKey(
        Brevo.TransactionalEmailsApiApiKeys.apiKey,
        process.env.BREVO_API_KEY
    );
}

export const sendEmail = async (options) => {
    // Check if API key exists
    if (!process.env.BREVO_API_KEY) {
        console.error("ERROR: BREVO_API_KEY is missing in .env file.");
        throw new Error("Email service is not configured.");
    }

    const sendSmtpEmail = new Brevo.SendSmtpEmail();

    // Mapping your existing 'options' to Brevo's structure
    sendSmtpEmail.subject = options.subject;
    sendSmtpEmail.htmlContent = options.message; // Brevo uses htmlContent instead of html
    sendSmtpEmail.sender = {
        email: process.env.BREVO_FROM_EMAIL || 'no-reply@streamify.com',
        name: 'Streamify'
    };
    sendSmtpEmail.to = [{ email: options.email }];

    try {
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log(`Email sent successfully to ${options.email}. ID: ${data.messageId}`);
    } catch (error) {
        console.error("Brevo Error:", error);
        // Brevo error details are usually in error.response.body
        if (error.response && error.response.body) {
            console.error("Details:", JSON.stringify(error.response.body));
        }
        throw new Error("Email could not be sent");
    }
};