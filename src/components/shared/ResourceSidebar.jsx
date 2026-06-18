import { useState } from 'react';
import { staticResources } from '../../data/staticResources.js';
import ResourceItem from './ResourceItem.jsx';
import { useDrawer } from '../../contexts/DrawerContext.jsx';
import { ChevronLeft } from 'lucide-react';
import './ResourceSidebar.css';

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
		<div className="resource-sidebar__entry">
			<ResourceItem item={item} />
			{item.description && (
				<p className="resource-sidebar__description">{item.description}</p>
			)}
		</div>
	);
}

export default function ResourceSidebar() {
	const [activeTab, setActiveTab] = useState('all');
	const { toggle } = useDrawer();

	const isAll = activeTab === 'all';
	const filtered = isAll ? null : staticResources.filter(r => r.categories.includes(activeTab));

	return (
		<div className="resource-sidebar-track">
		<aside className="resource-sidebar" aria-label="Resource library">
			<div className="resource-sidebar__heading-row">
				<h2 className="resource-sidebar__title">Resources</h2>
				<button className="sidebar-close-btn" onClick={toggle} aria-label="Close resource panel">
					<ChevronLeft size={20} />
				</button>
			</div>
			<div className="resource-sidebar__tabs" role="tablist" aria-label="Filter resources by category">
				{TABS.map(tab => (
					<button
						key={tab.id}
						role="tab"
						aria-selected={activeTab === tab.id}
						className={`resource-sidebar__tab${activeTab === tab.id ? ' resource-sidebar__tab--active' : ''}`}
						onClick={() => setActiveTab(tab.id)}
					>
						{tab.label}
					</button>
				))}
			</div>
			<div className="resource-sidebar__list">
				{isAll
					? Object.keys(SECTION_LABELS).map(cat => {
							// In "All" view, each item appears only once under its primary category
							const items = staticResources.filter(r => r.categories[0] === cat);
							if (!items.length) return null;
							return (
								<section key={cat} className="resource-sidebar__section">
									<h3 className="resource-sidebar__section-title">{SECTION_LABELS[cat]}</h3>
									<div className="resource-sidebar__items">
										{items.map(item => <ResourceEntry key={item.id} item={item} />)}
									</div>
								</section>
							);
					  })
					: (
						<div className="resource-sidebar__items">
							{filtered.map(item => <ResourceEntry key={item.id} item={item} />)}
						</div>
					)
				}
			</div>
		</aside>
		</div>
	);
}
