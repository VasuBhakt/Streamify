import { BrevoClient } from "@getbrevo/brevo";

const brevoClient = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY
});

export const sendEmail = async (options) => {
    try {
        const response = await brevoClient.transactionalEmails.sendTransacEmail({
            sender: {
                email: process.env.BREVO_FROM_EMAIL || 'no-reply@streamify.com',
                name: 'Streamify'
            },
            to: [{ email: options.email }],
            subject: options.subject,
            htmlContent: options.message
        });
        console.log(`Email sent successfully to ${options.email}. ID: ${response.messageId}`);
    } catch (error) {
        console.error("Brevo Error:", error);
        throw new Error("Email could not be sent");
    }
};


