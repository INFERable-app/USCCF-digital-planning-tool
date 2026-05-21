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

export default function PromptBlock({ label, text }) {
	const [value, setValue] = useState(text);
	const [copied, setCopied] = useState(false);

	function handleCopy() {
		const succeed = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };
		if (navigator.clipboard?.writeText) {
			navigator.clipboard.writeText(value).then(succeed).catch(() => fallbackCopy(value, succeed));
		} else {
			fallbackCopy(value, succeed);
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
			<textarea
				className="prompt-block-body"
				value={value}
				onChange={e => setValue(e.target.value)}
				spellCheck={false}
			/>
		</div>
	);
}
