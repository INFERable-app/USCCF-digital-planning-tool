import './ResultsEditSheet.css';
import { useEffect } from 'react';
import { X } from 'lucide-react';
import ResolversEditor from '../editor/ResolversEditor/ResolversEditor.jsx';

// Hosts the graph editor's resolver form inside the wizard so results content
// is edited as a form rather than raw JSON.
export default function ResultsEditSheet({ node, matchedIndex, onChange, onClose }) {
	useEffect(() => {
		function handleKey(e) {
			if (e.key === 'Escape') onClose();
		}
		document.addEventListener('keydown', handleKey);
		return () => document.removeEventListener('keydown', handleKey);
	}, [onClose]);

	return (
		<div className="results-sheet-backdrop" onClick={onClose}>
			<div
				className="results-sheet"
				role="dialog"
				aria-modal="true"
				aria-label="Edit results content"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="results-sheet__heading-row">
					<span className="results-sheet__title">Edit results content</span>
					<button
						type="button"
						className="results-sheet__close"
						onClick={onClose}
						aria-label="Close"
					>
						<X size={22} />
					</button>
				</div>

				{matchedIndex >= 0 && (
					<p className="results-sheet__hint">
						Rule {matchedIndex + 1} is the one showing on screen right now, based on your own
						answers.
					</p>
				)}

				<div className="results-sheet__body">
					<ResolversEditor resolvers={node.resolvers} onChange={onChange} />
				</div>
			</div>
		</div>
	);
}
