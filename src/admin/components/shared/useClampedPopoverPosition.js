import { useLayoutEffect, useRef, useState } from 'react';

const MARGIN = 8;

// Measures the popover after it mounts and clamps it back inside the viewport —
// a popover anchored at a click point near the screen edge (e.g. the inspector's
// delete button, which sits near the bottom-right of the panel) would otherwise
// render partially or fully off-screen.
export function useClampedPopoverPosition(x, y) {
	const ref = useRef(null);
	const [style, setStyle] = useState({ left: x, top: y, visibility: 'hidden' });

	useLayoutEffect(() => {
		const el = ref.current;
		if (!el) return;
		const rect = el.getBoundingClientRect();
		const clampedLeft = Math.min(Math.max(x - rect.width / 2, MARGIN), window.innerWidth - rect.width - MARGIN);
		const clampedTop = Math.min(Math.max(y, MARGIN), window.innerHeight - rect.height - MARGIN);
		setStyle({ left: clampedLeft, top: clampedTop, visibility: 'visible' });
	}, [x, y]);

	return { ref, style };
}
