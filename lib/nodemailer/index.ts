import nodemailer from 'nodemailer';
import {BASE_URL, NODEMAILER_EMAIL, NODEMAILER_PASSWORD} from "@/lib/config";
import {WELCOME_EMAIL_TEMPLATE} from "@/lib/nodemailer/template";

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

export {transporter, sendWelcomeEmail};
