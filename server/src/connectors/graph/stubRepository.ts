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
  async createNode(node: GraphNode) {
    graph.nodes[node.id] = node;
  },
  async updateNode(id: string, fields: Partial<GraphNode>) {
    const node = graph.nodes[id];
    if (!node) return;
    graph.nodes[id] = { ...node, ...fields };
  },
  async deleteNode(id: string) {
    delete graph.nodes[id];
    for (const node of Object.values(graph.nodes)) {
      node.edgeIds = node.edgeIds.filter((edgeId) => graph.edges[edgeId]?.targetNodeId !== id);
    }
    for (const [edgeId, edge] of Object.entries(graph.edges)) {
      if (edge.targetNodeId === id) delete graph.edges[edgeId];
    }
  },
  async createEdge(sourceId: string, edge: GraphEdge) {
    graph.edges[edge.id] = edge;
    const source = graph.nodes[sourceId];
    if (source && !source.edgeIds.includes(edge.id)) source.edgeIds.push(edge.id);
  },
  async updateEdge(id: string, fields: Partial<GraphEdge>) {
    const edge = graph.edges[id];
    if (!edge) return;
    graph.edges[id] = { ...edge, ...fields };
  },
  async deleteEdge(id: string) {
    delete graph.edges[id];
    for (const node of Object.values(graph.nodes)) {
      node.edgeIds = node.edgeIds.filter((edgeId) => edgeId !== id);
    }
  },
};
