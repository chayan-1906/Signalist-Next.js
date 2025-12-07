import nodemailer from 'nodemailer';
import {BASE_URL, NODEMAILER_EMAIL, NODEMAILER_PASSWORD} from "@/lib/config";
import {NEWS_SUMMARY_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE} from "@/lib/nodemailer/template";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: NODEMAILER_EMAIL!,
        pass: NODEMAILER_PASSWORD!,
    },
});

const sendWelcomeEmail = async ({email, name, intro}: WelcomeEmailData) => {
    const htmlTemplate = WELCOME_EMAIL_TEMPLATE
        .replace('{{name}}', name)
        .replace('{{intro}}', intro)
        .replace(/{{baseUrl}}/g, BASE_URL || 'https://localhost:3000');

    const mailOptions = {
        from: '"Signalist" <chayan19062000@gmail.com>',
        to: email,
        subject: 'Welcome to Signalist - your stock market toolkit is ready!',
        text: 'Thanks for joining Signalist',
        html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
}

const sendNewsSummaryEmail = async ({email, date, newsContent}: { email: string; date: string; newsContent: string; }): Promise<void> => {
    const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE
        .replace('{{date}}', date)
        .replace('{{newsContent}}', newsContent);

    const mailOptions = {
        from: `"Signalist News" <${NODEMAILER_EMAIL}>`,
        to: email,
        subject: `📈 Market News Summary Today - ${date}`,
        text: `Today's market news summary from Signalist`,
        html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
}

export {transporter, sendWelcomeEmail, sendNewsSummaryEmail};
