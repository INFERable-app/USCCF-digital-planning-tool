import { useEffect } from 'react';
import { faqItems } from '../../data/faqData.js';
import { useWizardNav } from '../../contexts/WizardNavContext.jsx';
import { X } from 'lucide-react';
import './FaqOverlay.css';

function renderWithBold(text) {
	return text.split('**').map((part, i) => (i % 2 === 1 ? <strong key={i}>{part}</strong> : part));
}

export default function FaqOverlay() {
	const { isFaqOpen, closeFaq } = useWizardNav();

	useEffect(() => {
		if (!isFaqOpen) return;
		function onKeyDown(e) {
			if (e.key === 'Escape') closeFaq();
		}
		document.addEventListener('keydown', onKeyDown);
		return () => document.removeEventListener('keydown', onKeyDown);
	}, [isFaqOpen, closeFaq]);

	if (!isFaqOpen) return null;

	return (
		<div className="faq-overlay-backdrop" onClick={closeFaq}>
			<div
				className="faq-overlay-panel"
				role="dialog"
				aria-modal="true"
				aria-label="Frequently asked questions"
				onClick={(e) => e.stopPropagation()}
			>
				<div className="faq-overlay__heading-row">
					<h2 className="faq-overlay__title">Frequently Asked Questions</h2>
					<button className="faq-overlay__close" onClick={closeFaq} aria-label="Close FAQ">
						<X size={22} />
					</button>
				</div>

				<div className="faq-overlay__list">
					{faqItems.map((item, index) => (
						<section key={item.id} className="faq-overlay__item">
							<h3 className="faq-overlay__question">
								{index + 1}. {item.question}
							</h3>
							{item.intro && <p className="faq-overlay__text">{renderWithBold(item.intro)}</p>}
							{item.bullets && (
								<ul className="faq-overlay__bullets">
									{item.bullets.map((bullet) => (
										<li key={bullet}>{bullet}</li>
									))}
								</ul>
							)}
							{item.outro && <p className="faq-overlay__text">{renderWithBold(item.outro)}</p>}
						</section>
					))}
				</div>
			</div>
		</div>
	);
}
