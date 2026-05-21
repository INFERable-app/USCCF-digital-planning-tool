import './VideoCard.css';
const IMG_VIDEO_THUMB = '/images/video-thumbnail.jpg';

export default function VideoCard({ url, alt }) {
	return (
		<a href={url} target="_blank" rel="noopener noreferrer" className="video-card">
			<img src={IMG_VIDEO_THUMB} alt={alt} className="video-thumb" />
			<div className="play-overlay">
				<svg viewBox="0 0 48 48" className="play-icon" aria-hidden="true">
					<circle cx="24" cy="24" r="24" fill="#FF0000" />
					<path d="M20 16l12 8-12 8V16z" fill="white" />
				</svg>
			</div>
		</a>
	);
}
