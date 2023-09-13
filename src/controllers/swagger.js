const spec = {
  openapi: '3.0.1',
  info: {
    description: "This is the API documentation for We've Got Poems.",
    version: '1.0.0',
    title: "We've Got Poems API"
  },
  paths: {
    '/add-poem': {
      post: {
        summary: 'Add a poem to the database',
        operationId: 'addPoem',
        tags: ['Poems'],
        responses: {
          200: {
            description: 'Success',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Poem' }
              }
            }
          },
          404: { $ref: '#/components/responses/NotFound' }
        }
      }
    }
  }
}

window.onload = function () {
  SwaggerUIBundle({
    spec: spec,
    dom_id: '#swagger-ui'
  })
}
