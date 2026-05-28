
import { LinkSchema } from '#shared/schemas/link'
import { z } from 'zod'

defineRouteMeta({
  openAPI: {
    description: '删除一个短链接',
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['slug'],
            properties: {
              slug: { type: 'string', description: '要删除的链接的 slug' },
            },
          },
        },
      },
    },
  },
})

const DeleteSchema = z.object({
  slug: LinkSchema.shape.slug.removeDefault().min(1),
})

export default eventHandler(async (event) => {
  const { previewMode } = useRuntimeConfig(event).public
  if (previewMode) {
    throw createError({
      status: 403,
      statusText: 'Preview mode cannot delete links.',
    })
  }

  const { slug } = await readValidatedBody(event, DeleteSchema.parse)
  await deleteLink(event, slug)
})
