import { getDriver } from '../neo4j/driver.js';
import type { GraphRepository, WizardGraph, GraphNode, GraphEdge } from './types.js';

export function createNeo4jRepository(): GraphRepository {

  return {
    async getWizardGraph(): Promise<WizardGraph> {
      void getDriver();
      throw new Error('Neo4j repository not yet implemented — set GRAPH_BACKEND=stub');
    },
    async getNode(_id: string): Promise<GraphNode | null> {
      throw new Error('Neo4j repository not yet implemented — set GRAPH_BACKEND=stub');
    },
    async getEdge(_id: string): Promise<GraphEdge | null> {
      throw new Error('Neo4j repository not yet implemented — set GRAPH_BACKEND=stub');
    },
  };
}
