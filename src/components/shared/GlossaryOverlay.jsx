import { useEffect } from 'react';
import { glossaryTerms } from '../../data/glossaryData.js';
import { useWizardNav } from '../../contexts/WizardNavContext.jsx';
import { X } from 'lucide-react';
import './GlossaryOverlay.css';

export default function GlossaryOverlay() {
	const { isGlossaryOpen, closeGlossary } = useWizardNav();

	useEffect(() => {
		if (!isGlossaryOpen) return;
		function onKeyDown(e) {
			if (e.key === 'Escape') closeGlossary();
		}
		document.addEventListener('keydown', onKeyDown);
		return () => document.removeEventListener('keydown', onKeyDown);
	}, [isGlossaryOpen, closeGlossary]);

	if (!isGlossaryOpen) return null;

	return (
		<div className="glossary-overlay-backdrop" onClick={closeGlossary}>
			<div
				className="glossary-overlay-panel"
				role="dialog"
				aria-modal="true"
				aria-label="Glossary of terms"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="glossary-overlay__heading-row">
					<h2 className="glossary-overlay__title">Glossary of Terms</h2>
					<button
						className="glossary-overlay__close"
						onClick={closeGlossary}
						aria-label="Close glossary"
					>
						<X size={22} />
					</button>
				</div>

				<dl className="glossary-overlay__list">
					{glossaryTerms.map((entry) => (
						<div key={entry.term} className="glossary-overlay__entry">
							<dt className="glossary-overlay__term">{entry.term}</dt>
							<dd className="glossary-overlay__definition">{entry.definition}</dd>
						</div>
					))}
				</dl>
			</div>
		</div>
	);
}
