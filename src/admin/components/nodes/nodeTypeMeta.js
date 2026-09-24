import {
	DoorOpen,
	SplitSquareHorizontal,
	CircleDot,
	CheckSquare,
	PlayCircle,
	Flag
} from 'lucide-react';

export const NODE_TYPE_META = {
	welcome: { label: 'Welcome', color: 'var(--color-navy-deep)', icon: DoorOpen },
	multiChoice: {
		label: 'Multi Choice',
		color: 'var(--color-green-hunter)',
		icon: SplitSquareHorizontal
	},
	radioSurvey: { label: 'Radio Survey', color: 'var(--color-orange-burnt)', icon: CircleDot },
	checkboxSurvey: {
		label: 'Checkbox Survey',
		color: 'var(--color-purple-amethyst)',
		icon: CheckSquare
	},
	videoInfo: { label: 'Video Info', color: 'var(--color-blue-electric)', icon: PlayCircle },
	results: { label: 'Results', color: 'var(--color-red-crimson)', icon: Flag }
};

export const NODE_TYPES = Object.keys(NODE_TYPE_META);

export function nodeTypeMeta(type) {
	return (
		NODE_TYPE_META[type] ?? {
			label: type ?? 'Unknown',
			color: 'var(--color-navy-midnight-alpha-85)',
			icon: Flag
		}
	);
}

// Type-appropriate starting field values for a freshly created node — fixes the
// legacy tool always defaulting a new node to multiChoice regardless of what's picked.
export const NODE_TYPE_DEFAULTS = {
	welcome: { heading: 'Welcome to the planning tool.', body: 'Placeholder intro text.' },
	multiChoice: { question: 'Placeholder question text?' },
	radioSurvey: { question: 'Placeholder question text?', submitLabel: 'Next' },
	checkboxSurvey: { question: 'Placeholder question text?', submitLabel: 'Submit' },
	videoInfo: { videoUrl: '', videoAlt: '' },
	results: { resolvers: [] }
};
