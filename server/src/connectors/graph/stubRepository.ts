import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { GraphRepository, WizardGraph, GraphNode, GraphEdge } from './types.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const raw = readFileSync(resolve(__dirname, '../../../../docs/wizardGraph.json'), 'utf8');
const graphData = JSON.parse(raw) as { nodes: Record<string, GraphNode>; edges: Record<string, GraphEdge> };

const graph: WizardGraph = {
  startNodeId: 'welcome',
  nodes: graphData.nodes,
  edges: graphData.edges,
};

export const stubRepository: GraphRepository = {
  async getWizardGraph() {
    return graph;
  },
  async getNode(id: string) {
    return graph.nodes[id] ?? null;
  },
  async getEdge(id: string) {
    return graph.edges[id] ?? null;
  },
  async replaceGraph(newGraph: WizardGraph) {
    graph.nodes = newGraph.nodes;
    graph.edges = newGraph.edges;
    graph.startNodeId = newGraph.startNodeId;
  },
};
