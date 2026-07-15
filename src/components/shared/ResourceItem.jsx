import './ResourceItem.css';
export default function ResourceItem({ item, showDescription = true }) {
	const hasDescription = showDescription && !!(item.description && item.description.trim());
	const cardClass = (base) => (hasDescription ? `${base} resource-card--expanded` : base);

	if (item.type === 'pdf') {
		const content = (
			<>
				<div className="resource-card-header">
					<span className="resource-label">{item.label}</span>
					<span className="resource-pdf-badge">p. {item.pages}</span>
				</div>
				{hasDescription && <p className="resource-description">{item.description}</p>}
			</>
		);
		return item.url ? (
			<a
				href={item.url}
				className={cardClass('resource-card resource-card--pdf')}
				target="_blank"
				rel="noopener noreferrer"
			>
				{content}
			</a>
		) : (
			<div className={cardClass('resource-card resource-card--pdf')}>{content}</div>
		);
	}

	if (item.type === 'link') {
		return (
			<a
				href={item.url}
				className={cardClass('resource-card resource-card--link')}
				target="_blank"
				rel="noopener noreferrer"
			>
				<div className="resource-card-header">
					<span className="resource-label">{item.label}</span>
					<span className="resource-link-arrow" aria-hidden="true">
						↗
					</span>
				</div>
				{hasDescription && <p className="resource-description">{item.description}</p>}
			</a>
		);
	}

	// reference — no URL yet
	if (hasDescription) {
		return (
			<div className="resource-card resource-card--reference resource-card--expanded">
				<div className="resource-card-header">
					<span className="resource-label">{item.label}</span>
				</div>
				<p className="resource-description">{item.description}</p>
			</div>
		);
	}
	return <p className="results-recommendation">{item.label}</p>;
}
