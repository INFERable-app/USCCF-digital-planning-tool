import './ResourceItem.css';
export default function ResourceItem({ item }) {
	if (item.type === 'pdf') {
		const content = (
			<>
				<span className="resource-label">{item.label}</span>
				<span className="resource-pdf-badge">p. {item.pages}</span>
			</>
		);
		return item.url
			? <a href={item.url} className="resource-card resource-card--pdf" target="_blank" rel="noopener noreferrer">{content}</a>
			: <div className="resource-card resource-card--pdf">{content}</div>;
	}

	if (item.type === 'link') {
		return (
			<a href={item.url} className="resource-card resource-card--link" target="_blank" rel="noopener noreferrer">
				<span className="resource-label">{item.label}</span>
				<span className="resource-link-arrow" aria-hidden="true">↗</span>
			</a>
		);
	}

	// reference — no URL yet
	return <p className="results-recommendation">{item.label}</p>;
}
