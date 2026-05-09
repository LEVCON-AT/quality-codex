# Claude API Patterns

Lokale Substanz aus `claude-api`-Skill. Lädt bei Anthropic-SDK-Code.

## Modell-Wahl (Stand 2026)

| Modell | ID | Use-Case | Kosten |
|---|---|---|---|
| **Opus 4.7** | `claude-opus-4-7` | Komplexes Reasoning, Code-Architektur, Audit | Höchste |
| **Sonnet 4.6** | `claude-sonnet-4-6` | Standard-Workloads, Tools, Tests | Mittel |
| **Haiku 4.5** | `claude-haiku-4-5-20251001` | Format-Fixes, Klassifikation, Embeddings | Niedrig |

Default für Production-Apps: **Sonnet** (best balance), Opus für kritische Pfade.

## Prompt-Caching (kosten-kritisch)

### Mechanik
Cache-Controll markiert Prefix-Blöcke als cacheable. 5min TTL. Hit = 90% Kosten-Reduktion.

```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const response = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 1024,
  system: [
    {
      type: 'text',
      text: largeSystemPrompt,  // z.B. CLAUDE.md + Foundation-Docs
      cache_control: { type: 'ephemeral' }
    }
  ],
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: largeContextDocument,  // z.B. Code-File
          cache_control: { type: 'ephemeral' }
        },
        {
          type: 'text',
          text: userQuestion  // dynamisch, nicht cachen
        }
      ]
    }
  ]
});
```

### Best-Practices
- **Statisches zuerst** — System-Prompt + große Docs vor User-Input
- **Cache-Key** = exakter Prefix-Hash → minimal change kann cache invalidaten
- **Max 4 cache_control** Punkte pro Request
- **Cache-Hit checken:** Response-`usage.cache_read_input_tokens` > 0

## Tool-Use Pattern

```typescript
const response = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 1024,
  tools: [
    {
      name: 'get_weather',
      description: 'Get weather for a city',
      input_schema: {
        type: 'object',
        properties: {
          city: { type: 'string' }
        },
        required: ['city']
      }
    }
  ],
  messages: [{ role: 'user', content: 'Wie ist das Wetter in Wien?' }]
});

if (response.stop_reason === 'tool_use') {
  const toolUse = response.content.find(b => b.type === 'tool_use');
  const result = await executeTool(toolUse.name, toolUse.input);

  const followUp = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [
      { role: 'user', content: 'Wie ist das Wetter in Wien?' },
      { role: 'assistant', content: response.content },
      { role: 'user', content: [
        { type: 'tool_result', tool_use_id: toolUse.id, content: JSON.stringify(result) }
      ]}
    ]
  });
}
```

## Extended-Thinking

```typescript
const response = await client.messages.create({
  model: 'claude-opus-4-7',
  max_tokens: 16000,
  thinking: { type: 'enabled', budget_tokens: 10000 },
  messages: [{ role: 'user', content: 'Komplexe Architektur-Frage...' }]
});

// response.content includes 'thinking' blocks (kann gefiltert werden für UI)
```

## Streaming

```typescript
const stream = client.messages.stream({
  model: 'claude-sonnet-4-6',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Hallo' }]
});

for await (const event of stream) {
  if (event.type === 'content_block_delta') {
    process.stdout.write(event.delta.text ?? '');
  }
}

const final = await stream.finalMessage();
```

## Batch-API (kosten-effizient für nicht-zeitkritisch)

50% Rabatt für Batch-Requests (24h Latenz):
```typescript
const batch = await client.messages.batches.create({
  requests: items.map((item, i) => ({
    custom_id: `req-${i}`,
    params: {
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      messages: [{ role: 'user', content: item.text }]
    }
  }))
});
```

## Vision

```typescript
const response = await client.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 1024,
  messages: [{
    role: 'user',
    content: [
      { type: 'image', source: { type: 'base64', media_type: 'image/png', data: base64Data }},
      { type: 'text', text: 'Beschreibe dieses Bild' }
    ]
  }]
});
```

## MCP-Server-Integration

Anthropic-Apps können MCP-Server callen:
```typescript
// In Claude-Desktop: ~/.claude/claude_desktop_config.json
{
  "mcpServers": {
    "my-bridge": {
      "command": "node",
      "args": ["/path/to/bridge/dist/mcp-stdio.js"]
    }
  }
}
```

Server-Implementation siehe `docs/claude/16-mcp-integration.md`.

## Cost-Optimization-Patterns

1. **Prompt-Caching** für stabile Prefixes
2. **Modell-Tier** wählen: Haiku → Sonnet → Opus
3. **Batch-API** für Async-Workloads
4. **max_tokens** begrenzen (verhindert Kostenexplosion)
5. **Thinking-Budget** nicht ohne Bedarf hochsetzen
6. **Output-Parsing** so dass repeated calls minimiert werden

## Sicherheit

- API-Key NIE im Frontend
- Backend-Proxy-Pattern: Frontend → eigener Server → Anthropic
- Rate-Limit eigene API (User-Quotas)
- Logging: keine User-PII in Prompts ohne Anonymisierung
- Output-Sanitization (XSS-Schutz wenn LLM-Output gerendert wird)

## Migration zwischen Modellen

Bei Wechsel z.B. Sonnet 4.6 → 4.7:
1. Test-Suite gegen beide Modelle laufen
2. Output-Diffs prüfen
3. Prompt-Anpassungen falls nötig
4. Rollout phased (10% → 50% → 100%)

## Anti-Patterns

- ❌ API-Key client-side
- ❌ Prompt-Injection ungefiltert (User-Input direkt in System-Prompt)
- ❌ Unbegrenztes max_tokens
- ❌ Kein Caching bei großen Prompts
- ❌ Opus für triviale Tasks (Haiku reicht)
- ❌ Streaming ohne Error-Handler
