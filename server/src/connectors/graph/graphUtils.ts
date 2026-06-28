export function nodeToProps(node: Record<string, unknown>): Record<string, unknown> {
  const { edgeIds, resolvers, ...rest } = node;
  void edgeIds;
  const props: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(rest)) {
    if (val !== undefined) props[key] = val;
  }
  if (resolvers !== undefined) {
    props.resolversJson = JSON.stringify(resolvers);
  }
  return props;
}

export function edgeToRelProps(
  edge: Record<string, unknown>,
  order: number
): Record<string, unknown> {
  const props: Record<string, unknown> = { id: edge.id, label: edge.label, order };
  if (edge.storeKey !== undefined) props.storeKey = edge.storeKey;
  if (edge.value !== undefined) props.value = edge.value;
  if (edge.disabled !== undefined) props.disabled = edge.disabled;
  return props;
}
