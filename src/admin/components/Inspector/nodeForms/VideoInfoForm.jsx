import { TextField } from '../Field.jsx';

// Restores editors for intro/linkLabel/linkDisplay — VideoInfoNode.jsx (the live
// wizard component) already reads these, but the legacy admin inspector never
// exposed them, so they were only settable by hand-editing JSON/Neo4j directly.
export default function VideoInfoForm({ node, onChange }) {
	return (
		<>
			<TextField
				label="Intro Text"
				value={node.data.intro}
				onChange={(v) => onChange({ intro: v })}
			/>
			<TextField
				label="Video URL"
				mono
				value={node.data.videoUrl}
				onChange={(v) => onChange({ videoUrl: v })}
			/>
			<TextField
				label="Video Alt Text"
				value={node.data.videoAlt}
				onChange={(v) => onChange({ videoAlt: v })}
			/>
			<TextField
				label="Link Label"
				value={node.data.linkLabel}
				onChange={(v) => onChange({ linkLabel: v })}
			/>
			<TextField
				label="Link Display Text"
				value={node.data.linkDisplay}
				onChange={(v) => onChange({ linkDisplay: v })}
			/>
		</>
	);
}
