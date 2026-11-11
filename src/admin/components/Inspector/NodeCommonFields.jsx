import { useState } from 'react';
import { TextField, SelectField, CheckboxField } from '../../../components/editor/Field.jsx';
import { NODE_TYPES, nodeTypeMeta } from '../nodes/nodeTypeMeta.js';

export default function NodeCommonFields({ node, onChange, onRenameId }) {
  const [renameError, setRenameError] = useState(null);

  return (
    <>
      <TextField
        label="Node ID"
        value={node.id}
        mono
        onChange={(v) => setRenameError(onRenameId(v))}
      />
      {renameError && (
        <p className="inspector-panel__error" role="alert">
          {renameError}
        </p>
      )}
      <TextField
        label="Display Label"
        value={node.data.label}
        onChange={(v) => onChange({ label: v })}
      />
      <SelectField
        label="Layout"
        value={node.data.layout}
        onChange={(v) => onChange({ layout: v })}
        options={[
          { value: 'compact', label: 'compact' },
          { value: 'hero', label: 'hero' }
        ]}
      />
      <SelectField
        label="Type"
        value={node.data.type}
        onChange={(v) => onChange({ type: v })}
        options={NODE_TYPES.map((t) => ({ value: t, label: nodeTypeMeta(t).label }))}
      />
      <CheckboxField
        label="Show Challenge Bar"
        checked={node.data.challengeBar}
        onChange={(v) => onChange({ challengeBar: v })}
      />
    </>
  );
}
