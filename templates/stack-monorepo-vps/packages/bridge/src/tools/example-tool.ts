import { z } from 'zod';
import type { RequestContext } from '@__SLUG__/shared/types';

const InputSchema = z.object({
  message: z.string().min(1).max(500),
});

type Input = z.infer<typeof InputSchema>;

/**
 * Example MCP tool — replace with project-specific tools.
 * @docs admin/setup.md#mcp-tools
 */
export const exampleTool = {
  name: 'example_echo' as const,
  description: 'Echoes the input message — replace with real tool',
  schema: InputSchema,
  async handler(input: Input, ctx: RequestContext): Promise<{ echo: string; user: string }> {
    return {
      echo: input.message,
      user: ctx.userId,
    };
  },
};
