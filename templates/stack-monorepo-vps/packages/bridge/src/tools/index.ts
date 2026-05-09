import { exampleTool } from './example-tool.js';

export const tools = [exampleTool] as const;

export type ToolName = (typeof tools)[number]['name'];
