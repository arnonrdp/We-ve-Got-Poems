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
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  author: { type: 'string', example: 'CodeVerse Muse' },
                  content: {
                    type: 'string',
                    example:
                      "In lines of code, we weave our art,\nA digital symphony from mind to chart.\nWith functions, loops, and logic clear,\nWe conquer problems, quelling fear.\n\nIn bytes and bits, our thoughts take flight,\nCreating programs that shine so bright.\nFrom bugs we learn, and errors mend,\nIn the world of code, there's no real end.\n\nSo, let us code with passion and grace,\nCreating software in this boundless space.\nWith every keystroke, we write our story,\nIn the language of machines, we find our glory.",
                    description: 'The poem content'
                  },
                  title: { type: 'string', example: "Coding Chronicles: A Programmer's Poem" }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Success',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'integer', example: 1 },
                    message: { type: 'string', example: 'Poem added successfully' }
                  }
                }
              }
            }
          },
          404: { $ref: '#/components/responses/NotFound' },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string', example: 'Error adding poem' }
                  }
                }
              }
            }
          }
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
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Poem' }
                }
              }
            }
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
            schema: { type: 'integer', example: 1 }
          }
        ],
        requestBody: {
          description: 'The poem to update',
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  author: { type: 'string', example: 'CodeVerse Muse' },
                  title: { type: 'string', example: "Coding Chronicles: A Programmer's Poem" }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Success',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Poem updated successfully' }
                  }
                }
              }
            }
          },
          404: { $ref: '#/components/responses/NotFound' },
          500: {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string', example: 'Error updating poem' }
                  }
                }
              }
            }
          }
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
          created_at: { type: 'string', format: 'timestamp', example: '2023-09-14T00:23:46.321Z' },
          title: { type: 'string', example: "Coding Chronicles: A Programmer's Poem" }
        }
      }
    },
    responses: {
      NotFound: {
        description: 'Not found'
      }
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
