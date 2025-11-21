import {Inngest} from "inngest";
import {GEMINI_API_KEY} from "@/lib/config";

const inngest = new Inngest({
	id: 'inngest',
	ai: {
		gemini: {
			apiKey: GEMINI_API_KEY!,
		},
	},
});

export {inngest};
