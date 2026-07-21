import './SaveModal.css';
import { useState } from 'react';

export default function SaveModal({ onClose, onConfirm }) {
	const [description, setDescription] = useState('');
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState(null);

	async function handleSubmit(e) {
		e.preventDefault();
		if (!description.trim()) return;
		setSaving(true);
		setMessage(null);
		try {
			await onConfirm();
			setMessage({ type: 'success', text: 'Graph saved to database successfully.' });
			setTimeout(onClose, 1200);
		} catch (err) {
			setMessage({ type: 'error', text: `Failed to save: ${err.message}` });
		} finally {
			setSaving(false);
		}
	}

	return (
		<div className="save-modal-backdrop" onClick={onClose}>
			<div className="save-modal" onClick={(e) => e.stopPropagation()}>
				<div className="save-modal__header">
					<h2>Save Graph to Database</h2>
					<button type="button" className="save-modal__close" onClick={onClose}>
						&times;
					</button>
				</div>

				<div className="save-modal__warning">
					<strong>This will replace the live graph in Neo4j.</strong>
					<p>All users will see the updated wizard immediately.</p>
				</div>

				<form onSubmit={handleSubmit}>
					<label htmlFor="save-modal-description">Change Description *</label>
					<textarea
						id="save-modal-description"
						rows={3}
						required
						placeholder="Describe the changes you made to the wizard graph..."
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>

					{message && (
						<div className={`save-modal__message save-modal__message--${message.type}`}>
							{message.text}
						</div>
					)}

					<div className="save-modal__footer">
						<button type="button" className="save-modal__cancel" onClick={onClose}>
							Cancel
						</button>
						<button
							type="submit"
							className="save-modal__submit"
							disabled={saving || !description.trim()}
						>
							{saving ? 'Saving...' : 'Save to Database'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
