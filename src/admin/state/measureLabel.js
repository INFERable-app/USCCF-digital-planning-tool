// Estimates the rendered size of an edge label, mirroring the word-wrap
// behavior of `.graph-edge-label`'s CSS (see GraphEdge.css: max-width 220px,
// font-size 11px, padding 3px 8px) so dagre can reserve real room for it.

const MAX_CONTENT_WIDTH = 204; // 220px max-width minus 8px horizontal padding each side
const LINE_HEIGHT = 15; // ~11px font-size * 1.35 line-height, rounded
const VERTICAL_PADDING = 6; // 3px top + 3px bottom
const HORIZONTAL_PADDING = 16; // 8px left + 8px right
const FONT = '11px Inter, system-ui, sans-serif';

let ctx;
function getContext() {
	if (!ctx) {
		ctx = document.createElement('canvas').getContext('2d');
		ctx.font = FONT;
	}
	return ctx;
}

export function measureLabel(text) {
	if (!text) return { width: 0, height: 0 };
	const context = getContext();
	const words = text.split(' ');

	let lineWidth = 0;
	let maxLineWidth = 0;
	let lines = 1;

	words.forEach((word, i) => {
		const wordWidth = context.measureText(i === 0 ? word : ` ${word}`).width;
		if (lineWidth + wordWidth > MAX_CONTENT_WIDTH && lineWidth > 0) {
			maxLineWidth = Math.max(maxLineWidth, lineWidth);
			lineWidth = context.measureText(word).width;
			lines += 1;
		} else {
			lineWidth += wordWidth;
		}
	});
	maxLineWidth = Math.max(maxLineWidth, lineWidth);

	return {
		width: Math.min(maxLineWidth, MAX_CONTENT_WIDTH) + HORIZONTAL_PADDING,
		height: lines * LINE_HEIGHT + VERTICAL_PADDING
	};
}
