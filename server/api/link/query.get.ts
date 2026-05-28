
import { z } from 'zod'

defineRouteMeta({
  openAPI: {
    description: '通过 slug 查询短链接',
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        name: 'slug',
        in: 'query',
        required: true,
        schema: { type: 'string' },
        description: '要查询的链接的 slug',
      },
    ],
  },
})

const QueryParamsSchema = z.object({
  slug: z.string().trim().min(1).max(2048),
})

export default eventHandler(async (event) => {
  const { slug } = await getValidatedQuery(event, QueryParamsSchema.parse)

  const { link, metadata } = await getLinkWithMetadata(event, slug)
  if (link) {
    return sanitizeLinkPassword({
      ...metadata,
      ...link,
    })
  }

  throw createError({
    status: 404,
    statusText: 'Not Found',
  })
})
