import './PromptBlock.css';
import { useState } from 'react';

function fallbackCopy(text, onSuccess) {
	const el = document.createElement('textarea');
	el.value = text;
	el.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0';
	document.body.appendChild(el);
	el.focus();
	el.select();
	try { document.execCommand('copy'); onSuccess(); } catch (_) {}
	document.body.removeChild(el);
}

function renderText(text) {
	return text.split(/(\[[^\]]+\])/g).map((part, i) =>
		/^\[.+\]$/.test(part)
			? <mark key={i} className="prompt-placeholder">{part}</mark>
			: part
	);
}

export default function PromptBlock({ label, text }) {
	const [copied, setCopied] = useState(false);

	function handleCopy() {
		const succeed = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };
		if (navigator.clipboard?.writeText) {
			navigator.clipboard.writeText(text).then(succeed).catch(() => fallbackCopy(text, succeed));
		} else {
			fallbackCopy(text, succeed);
		}
	}

	return (
		<div className="prompt-block">
			<div className="prompt-block-bar">
				<span className="prompt-block-label">{label}</span>
				<button className="prompt-block-copy" onClick={handleCopy}>
					{copied ? 'Copied ✓' : 'Copy'}
				</button>
			</div>
			<p className="prompt-block-body">{renderText(text)}</p>
		</div>
	);
}
