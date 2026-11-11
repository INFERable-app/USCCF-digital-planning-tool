import './MoveButtons.css';
import { ChevronDown, ChevronUp } from 'lucide-react';

// Keyboard-operable alternative to drag-to-reorder. Uses aria-disabled rather
// than disabled at the ends so the focused button keeps focus after a move.
export default function MoveButtons({ index, count, itemLabel, onMove }) {
  const atTop = index === 0;
  const atBottom = index === count - 1;

  return (
    <span className="move-buttons">
      <button
        type="button"
        className="move-buttons__btn"
        aria-label={`Move ${itemLabel} up`}
        aria-disabled={atTop}
        onClick={() => !atTop && onMove(index, index - 1)}
      >
        <ChevronUp size={14} />
      </button>
      <button
        type="button"
        className="move-buttons__btn"
        aria-label={`Move ${itemLabel} down`}
        aria-disabled={atBottom}
        onClick={() => !atBottom && onMove(index, index + 1)}
      >
        <ChevronDown size={14} />
      </button>
    </span>
  );
}
