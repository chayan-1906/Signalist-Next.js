import {ImageResponse} from 'next/og';

export const runtime = 'edge';
export const alt = 'Signalist';
export const size = {width: 1200, height: 630};
export const contentType = 'image/png';

async function OGImage() {
	return new ImageResponse(
		<div
			style={{
				background: 'linear-gradient(135deg, #050505 0%, #141414 100%)',
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
			}}>
			<div style={{fontSize: 96, fontWeight: 900, color: '#FDD458'}}>Signalist</div>
			<div style={{fontSize: 32, color: '#9ca3af', marginTop: 20, paddingLeft: 40, paddingRight: 40, textAlign: 'center'}}>
				Track Real-Time Stock Prices & Insights
			</div>
		</div>,
		{...size},
	);
}

export default OGImage;
