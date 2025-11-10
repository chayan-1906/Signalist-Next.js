export interface TradingViewWidgetProps {
	title?: string;
	scriptUrl: string;
	config: Record<string, unknown>;
	height?: number;
	className?: string;
}
