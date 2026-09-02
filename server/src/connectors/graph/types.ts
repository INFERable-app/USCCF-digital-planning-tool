export interface GraphNode {
	id: string;
	type: string;
	layout: 'hero' | 'compact';
	challengeBar: boolean;
	edgeIds: string[];
	positionX?: number;
	positionY?: number;
	[key: string]: unknown;
}

export interface GraphEdge {
	id: string;
	label: string;
	targetNodeId: string;
	storeKey?: string;
	value?: string;
	disabled?: boolean;
}

export interface WizardGraph {
	startNodeId: string;
	nodes: Record<string, GraphNode>;
	edges: Record<string, GraphEdge>;
}

export interface GraphRepository {
	getWizardGraph(): Promise<WizardGraph>;
	getNode(id: string): Promise<GraphNode | null>;
	getEdge(id: string): Promise<GraphEdge | null>;
	replaceGraph(graph: WizardGraph): Promise<void>;
	createNode(node: GraphNode): Promise<void>;
	updateNode(id: string, fields: Partial<GraphNode>): Promise<void>;
	deleteNode(id: string): Promise<void>;
	createEdge(sourceId: string, edge: GraphEdge): Promise<void>;
	updateEdge(id: string, fields: Partial<GraphEdge>): Promise<void>;
	deleteEdge(id: string): Promise<void>;
}
