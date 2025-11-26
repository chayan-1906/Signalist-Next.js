import {inngest} from "@/lib/inngest/client";
import {sendWelcomeEmail} from "@/lib/nodemailer";
import {getNews} from "@/lib/actions/finnhub.actions";
import {getAllUsersForNewsEmail} from "@/lib/actions/user.actions";
import {PERSONALIZED_WELCOME_EMAIL_PROMPT} from "@/lib/inngest/prompts";
import {getWatchlistSymbolsByEmail} from "@/lib/actions/watchlist.actions";

const sendSignUpEmail = inngest.createFunction(
	{
		id: 'sign-up-email',
	},
	{
		event: 'app/user.created',
	},
	async ({event, step}) => {
		const userProfile = `
			- Country: ${event.data.country}
			- Investment goals: ${event.data.investmentGoals}
			- Risk tolerance: ${event.data.riskTolerance}
			- Preferred industry: ${event.data.preferredIndustry}
		`;

		const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace('{{userProfile}}', userProfile);

		const response = await step.ai.infer('generate-welcome-intro', {
			model: step.ai.models.gemini({model: 'gemini-2.5-flash-preview-09-2025'}),
			body: {
				contents: [
					{
						role: 'user',
						parts: [
							{
								text: prompt,
							},
						],
					},
				],
			},
		});

		await step.run('send-welcome-email', async () => {
			const part = response.candidates?.[0].content?.parts?.[0];
			const introText = (part && 'text' in part ? part.text : null) || 'Thanks for joining Signalist. You now have the tools to track markets and make smarter moves';

			const {data: {email, name}} = event;
			return await sendWelcomeEmail({
				email, name, intro: introText,
			});
		});

		return {
			success: true,
			message: 'Welcome email sent successfully',
		};
	},
);

const sendDailyNewsSummary = inngest.createFunction(
	{
		id: 'daily-news-summary',
	},
	[
		{
			event: 'app/send.daily.news',
		},
		{
			cron: '0 12 * * *',
		},
	],
	async ({step}) => {
		// Step #1: Get all users for news delivery
		const users = await step.run('get-all-users', getAllUsersForNewsEmail);
		if (!users || users.length === 0) {
			return {
				success: false,
				message: 'No users found for news email',
			};
		}

		// Step #2: Fetch personalized news for each user
		const newsPerUser = await step.run('fetch-user-news', async () => {
			const perUser: Array<{ user: User; articles: MarketNewsArticle[] }> = [];

			for (const user of users as User[]) {
				try {
					// Get user's watchlist symbols
					const symbols = await getWatchlistSymbolsByEmail(user.email);
					let articles = await getNews(symbols);
					articles = (articles || []).slice(0, 6);    // max 6 articles per user

					if (!articles || articles.length === 0) {
						articles = await getNews();
						articles = (articles || []).slice(0, 6);    // max 6 articles per user
					}

					perUser.push({user, articles});
				} catch (error: unknown) {
					console.error(`Error fetching news for user ${user.email}:`, error);
					perUser.push({user, articles: []});
				}
			}

			return perUser;
		});

		// Step #3: Summarize news via AI for each user (placeholder)
		await step.run('summarize-news-with-ai', async () => {
			// TODO: Implement AI summarization for each user's news
			console.log(`Summarizing news for ${newsPerUser.length} users`);
			return {summarized: true};
		});

		// Step #4: Send emails (placeholder)
		await step.run('send-news-emails', async () => {
			// TODO: Implement email sending for each user
			console.log(`Sending news emails to ${newsPerUser.length} users`);
			return {sent: true};
		});

		return {success: true};
	}
);

export {sendSignUpEmail, sendDailyNewsSummary};
