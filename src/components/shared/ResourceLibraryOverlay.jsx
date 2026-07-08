import { useEffect, useState } from 'react';
import { staticResources } from '../../data/staticResources.js';
import ResourceItem from './ResourceItem.jsx';
import { useWizardNav } from '../../contexts/WizardNavContext.jsx';
import { X } from 'lucide-react';
import './ResourceLibraryOverlay.css';

const TABS = [
	{ id: 'all', label: 'All' },
	{ id: 'foundational', label: 'Foundational' },
	{ id: 'employer-demand', label: 'Employer Demand' },
	{ id: 'training-alignment', label: 'Training Alignment' },
];

const SECTION_LABELS = {
	foundational: 'Foundational',
	'employer-demand': 'Employer Demand',
	'training-alignment': 'Training Alignment',
};

function ResourceEntry({ item }) {
	return (
		<div className="resource-overlay__entry">
			<ResourceItem item={item} />
			{item.description && <p className="resource-overlay__description">{item.description}</p>}
		</div>
	);
}

export default function ResourceLibraryOverlay() {
	const { isResourceLibraryOpen, closeResourceLibrary } = useWizardNav();
	const [activeTab, setActiveTab] = useState('all');

	useEffect(() => {
		if (!isResourceLibraryOpen) return;
		function onKeyDown(e) {
			if (e.key === 'Escape') closeResourceLibrary();
		}
		document.addEventListener('keydown', onKeyDown);
		return () => document.removeEventListener('keydown', onKeyDown);
	}, [isResourceLibraryOpen, closeResourceLibrary]);

	if (!isResourceLibraryOpen) return null;

	const isAll = activeTab === 'all';
	const filtered = isAll ? null : staticResources.filter((r) => r.categories.includes(activeTab));

	return (
		<div className="resource-overlay-backdrop" onClick={closeResourceLibrary}>
			<div
				className="resource-overlay-panel"
				role="dialog"
				aria-modal="true"
				aria-label="Resource library"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="resource-overlay__heading-row">
					<h2 className="resource-overlay__title">Resources</h2>
					<button className="resource-overlay__close" onClick={closeResourceLibrary} aria-label="Close resource library">
						<X size={22} />
					</button>
				</div>

				<div className="resource-overlay__tabs" role="tablist" aria-label="Filter resources by category">
					{TABS.map((tab) => (
						<button
							key={tab.id}
							role="tab"
							aria-selected={activeTab === tab.id}
							className={`resource-overlay__tab${activeTab === tab.id ? ' resource-overlay__tab--active' : ''}`}
							onClick={() => setActiveTab(tab.id)}
						>
							{tab.label}
						</button>
					))}
				</div>

				<div className="resource-overlay__list">
					{isAll
						? Object.keys(SECTION_LABELS).map((cat) => {
								const items = staticResources.filter((r) => r.categories[0] === cat);
								if (!items.length) return null;
								return (
									<section key={cat} className="resource-overlay__section">
										<h3 className="resource-overlay__section-title">{SECTION_LABELS[cat]}</h3>
										<div className="resource-overlay__items">
											{items.map((item) => (
												<ResourceEntry key={item.id} item={item} />
											))}
										</div>
									</section>
								);
							})
						: (
							<div className="resource-overlay__items">
								{filtered.map((item) => (
									<ResourceEntry key={item.id} item={item} />
								))}
							</div>
						)}
				</div>
			</div>
		</div>
	);
}
