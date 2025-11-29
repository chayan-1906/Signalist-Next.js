import {inngest} from "@/lib/inngest/client";
import {getFormattedTodayDate} from "@/lib/utils";
import {getNews} from "@/lib/actions/finnhub.actions";
import {getAllUsersForNewsEmail} from "@/lib/actions/user.actions";
import {sendNewsSummaryEmail, sendWelcomeEmail} from "@/lib/nodemailer";
import {getWatchlistSymbolsByEmail} from "@/lib/actions/watchlist.actions";
import {NEWS_SUMMARY_EMAIL_PROMPT, PERSONALIZED_WELCOME_EMAIL_PROMPT} from "@/lib/inngest/prompts";

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
	{
		cron: '0 12 * * *',  // Production: daily at 12 PM UTC
		// cron: '* * * * *',      // Testing: every minute
	},
	async ({step}) => {
		// Step #1: Get all users for news delivery
		const users = await step.run('get-all-users', getAllUsersForNewsEmail);
		console.log(`[sendDailyNewsSummary] Found ${users?.length || 0} users`);

		if (!users || users.length === 0) {
			console.log('[sendDailyNewsSummary] No users found, exiting');
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
		const userNewsSummaries: { user: User; newsContent: string | null }[] = [];
		for (const {user, articles} of newsPerUser) {
			try {
				const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace('{{newsData}}', JSON.stringify(articles, null, 2));
				const response = await step.ai.infer(`summarize-news-${user.email}`, {
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

				const part = response.candidates?.[0]?.content?.parts?.[0];
				const newsContent = (part && 'text' in part ? part.text : null) || 'No market news';

				userNewsSummaries.push({user, newsContent});
			} catch (error: any) {
				console.error('Failed to summarize news for:', user.email);
				userNewsSummaries.push({user, newsContent: null});
			}
		}

		// Step #4: Send emails (placeholder)
		await step.run('send-news-emails', async () => {
			await Promise.all(
				userNewsSummaries.map(async ({user, newsContent}) => {
					if (!newsContent) {
						return false;
					}

					return await sendNewsSummaryEmail({email: user.email, date: getFormattedTodayDate(), newsContent});
				}),
			);
		});

		return {success: true, message: 'Daily news summary emails sent successfully'};
	}
);

export {sendSignUpEmail, sendDailyNewsSummary};
