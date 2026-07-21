import {
	DoorOpen,
	SplitSquareHorizontal,
	CircleDot,
	CheckSquare,
	PlayCircle,
	Flag
} from 'lucide-react';

export const NODE_TYPE_META = {
	welcome: { label: 'Welcome', color: '#4f46e5', icon: DoorOpen },
	multiChoice: { label: 'Multi Choice', color: '#0d9488', icon: SplitSquareHorizontal },
	radioSurvey: { label: 'Radio Survey', color: '#b45309', icon: CircleDot },
	checkboxSurvey: { label: 'Checkbox Survey', color: '#7c3aed', icon: CheckSquare },
	videoInfo: { label: 'Video Info', color: '#0284c7', icon: PlayCircle },
	results: { label: 'Results', color: '#8d2f38', icon: Flag }
};

export const NODE_TYPES = Object.keys(NODE_TYPE_META);

export function nodeTypeMeta(type) {
	return NODE_TYPE_META[type] ?? { label: type ?? 'Unknown', color: '#64748b', icon: Flag };
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
