import './AdminsModal.css';
import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext.jsx';

export default function AdminsModal({ onClose }) {
	const { user } = useAuth();
	const [admins, setAdmins] = useState([]);
	const [bootstrap, setBootstrap] = useState([]);
	const [email, setEmail] = useState('');
	const [loading, setLoading] = useState(true);
	const [pending, setPending] = useState(false);
	const [message, setMessage] = useState(null);

	const load = useCallback(async () => {
		setLoading(true);
		try {
			const res = await fetch('/api/admins', { credentials: 'include' });
			if (!res.ok) throw new Error(`${res.status}`);
			const data = await res.json();
			setAdmins(data.admins);
			setBootstrap(data.bootstrap);
			setMessage(null);
		} catch (err) {
			setMessage({ type: 'error', text: `Could not load admins: ${err.message}` });
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		load();
	}, [load]);

	useEffect(() => {
		function handleKey(e) {
			if (e.key === 'Escape') onClose();
		}
		document.addEventListener('keydown', handleKey);
		return () => document.removeEventListener('keydown', handleKey);
	}, [onClose]);

	async function handleAdd(e) {
		e.preventDefault();
		const value = email.trim();
		if (!value) return;
		setPending(true);
		setMessage(null);
		try {
			const res = await fetch('/api/admins', {
				method: 'POST',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email: value })
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.error || `${res.status}`);
			}
			setEmail('');
			await load();
			setMessage({ type: 'success', text: `${value} can now edit content.` });
		} catch (err) {
			setMessage({ type: 'error', text: err.message });
		} finally {
			setPending(false);
		}
	}

	async function handleRemove(target) {
		setPending(true);
		setMessage(null);
		try {
			const res = await fetch(`/api/admins/${encodeURIComponent(target)}`, {
				method: 'DELETE',
				credentials: 'include'
			});
			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.error || `${res.status}`);
			}
			await load();
		} catch (err) {
			setMessage({ type: 'error', text: err.message });
		} finally {
			setPending(false);
		}
	}

	const currentEmail = user?.email?.trim().toLowerCase();

	return (
		<div className="admins-modal-backdrop" onClick={onClose}>
			<div className="admins-modal" onClick={(e) => e.stopPropagation()}>
				<div className="admins-modal__header">
					<h2>Admins</h2>
					<button type="button" className="admins-modal__close" onClick={onClose}>
						<X size={18} />
					</button>
				</div>

				<div className="admins-modal__note">
					<strong>Admins can edit content and manage this list.</strong>
					<p>Stored in the database — changes take effect on their next sign-in.</p>
				</div>

				{loading ? (
					<p className="admins-modal__empty">Loading…</p>
				) : (
					<div className="admins-modal__list">
						{admins.length === 0 && bootstrap.length === 0 && (
							<p className="admins-modal__empty">No admins yet.</p>
						)}
						{admins.map((admin) => (
							<div key={admin.email} className="admins-modal__row">
								<span className="admins-modal__email">{admin.email}</span>
								{admin.email === currentEmail ? (
									<span className="admins-modal__tag admins-modal__tag--you">you</span>
								) : (
									<>
										{admin.addedBy && (
											<span className="admins-modal__meta">added by {admin.addedBy}</span>
										)}
										<button
											type="button"
											className="admins-modal__remove"
											onClick={() => handleRemove(admin.email)}
											disabled={pending}
											aria-label={`Remove ${admin.email}`}
										>
											&times;
										</button>
									</>
								)}
							</div>
						))}
						{bootstrap
							.filter((entry) => !admins.some((admin) => admin.email === entry))
							.map((entry) => (
								<div
									key={`bootstrap-${entry}`}
									className="admins-modal__row admins-modal__row--bootstrap"
								>
									<span className="admins-modal__email">{entry}</span>
									<span className="admins-modal__tag admins-modal__tag--env">from environment</span>
								</div>
							))}
					</div>
				)}

				<form onSubmit={handleAdd}>
					<label htmlFor="admins-modal-email">Add an admin</label>
					<div className="admins-modal__add">
						<input
							id="admins-modal-email"
							type="email"
							placeholder="name@usccf.org"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<button type="submit" disabled={pending || !email.trim()}>
							Add
						</button>
					</div>
				</form>

				{message && (
					<div className={`admins-modal__message admins-modal__message--${message.type}`}>
						{message.text}
					</div>
				)}

				<div className="admins-modal__footer">
					<button type="button" className="admins-modal__done" onClick={onClose}>
						Done
					</button>
				</div>
			</div>
		</div>
	);
}
