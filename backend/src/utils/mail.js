import sgMail from '@sendgrid/mail';

// Set API Key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (options) => {

    // Check if API key exists
    if (!process.env.SENDGRID_API_KEY) {
        console.error("ERROR: SENDGRID_API_KEY is missing in .env file.");
        throw new Error("Email service is not configured.");
    }

    const msg = {
        to: options.email,
        from: process.env.SENDGRID_FROM_EMAIL || 'no-reply@streamify.com',
        subject: options.subject,
        html: options.message,
    };

    try {
        await sgMail.send(msg);
        console.log(`Email sent successfully to ${options.email}`);
    } catch (error) {
        console.error("SendGrid Error:", error);
        if (error.response) {
            console.error(error.response.body);
        }
        throw new Error("Email could not be sent");
    }
};
