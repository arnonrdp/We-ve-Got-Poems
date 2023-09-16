const spec = {
  openapi: '3.0.1',
  info: {
    description: "This is the API documentation for We've Got Poems.",
    version: '1.0.0',
    title: "We've Got Poems API"
  },
  servers: [
    { url: 'https://weve-got-poems-server.onrender.com/v1', description: 'Production server' },
    { url: 'http://localhost:5432/v1', description: 'Local server' }
  ],
  paths: {
    '/poem': {
      post: {
        tags: ['Poems'],
        summary: 'Add a poem to the database',
        operationId: 'addPoem',
        requestBody: {
          description: 'The poem to add',
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/PoemInput' } } }
        },
        responses: {
          200: { description: 'Success', content: { 'application/json': { schema: { $ref: '#/components/schemas/PoemResponse' } } } },
          404: { $ref: '#/components/responses/NotFound' },
          500: { description: 'Internal server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
        }
      }
    },
    '/poems': {
      get: {
        tags: ['Poems'],
        summary: 'Get all poems from the database',
        operationId: 'getPoems',
        responses: {
          200: {
            description: 'Success',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Poem' } } } }
          },
          404: { $ref: '#/components/responses/NotFound' }
        }
      }
    },
    '/poem/{id}': {
      put: {
        tags: ['Poems'],
        summary: 'Update a poem in the database',
        operationId: 'updatePoem',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'The ID of the poem to update',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        requestBody: {
          description: 'The poem to update',
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/PoemInput' } } }
        },
        responses: {
          200: { description: 'Success', content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } } },
          404: { $ref: '#/components/responses/NotFound' },
          500: { description: 'Internal server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
        }
      },
      delete: {
        tags: ['Poems'],
        summary: 'Delete a poem from the database',
        operationId: 'deletePoem',
        parameters: [
          {
            name: 'id',
            in: 'path',
            description: 'The ID of the poem to delete',
            required: true,
            schema: { type: 'integer' }
          }
        ],
        responses: {
          200: { description: 'Success', content: { 'application/json': { schema: { $ref: '#/components/schemas/MessageResponse' } } } },
          404: { $ref: '#/components/responses/NotFound' },
          500: { description: 'Internal server error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } }
        }
      }
    }
  },
  components: {
    schemas: {
      Poem: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          author: { type: 'string', example: 'CodeVerse Muse' },
          content: {
            type: 'string',
            example:
              "In lines of code, we weave our art,\nA digital symphony from mind to chart.\nWith functions, loops, and logic clear,\nWe conquer problems, quelling fear.\n\nIn bytes and bits, our thoughts take flight,\nCreating programs that shine so bright.\nFrom bugs we learn, and errors mend,\nIn the world of code, there's no real end.\n\nSo, let us code with passion and grace,\nCreating software in this boundless space.\nWith every keystroke, we write our story,\nIn the language of machines, we find our glory."
          },
          created_at: { type: 'string', format: 'timestamp', example: '2020-07-01T00:00:00.000Z' },
          title: { type: 'string', example: 'Coding Chronicles' }
        }
      },
      PoemInput: {
        type: 'object',
        properties: {
          author: { type: 'string', example: 'CodeVerse Muse' },
          content: {
            type: 'string',
            example:
              "In lines of code, we weave our art,\nA digital symphony from mind to chart.\nWith functions, loops, and logic clear,\nWe conquer problems, quelling fear.\n\nIn bytes and bits, our thoughts take flight,\nCreating programs that shine so bright.\nFrom bugs we learn, and errors mend,\nIn the world of code, there's no real end.\n\nSo, let us code with passion and grace,\nCreating software in this boundless space.\nWith every keystroke, we write our story,\nIn the language of machines, we find our glory."
          },
          title: { type: 'string', example: 'Coding Chronicles' }
        }
      },
      PoemResponse: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          message: { type: 'string' }
        }
      },
      MessageResponse: {
        type: 'object',
        properties: {
          message: { type: 'string' }
        }
      },
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' }
        }
      }
    },
    responses: {
      NotFound: { description: 'Not found' }
    }
  },
  tags: [{ name: 'Poems' }]
}

window.onload = function () {
  SwaggerUIBundle({
    spec: spec,
    dom_id: '#swagger-ui'
  })
}
