
import { z } from 'zod'

defineRouteMeta({
  openAPI: {
    description: '列出所有短链接（分页）',
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        name: 'limit',
        in: 'query',
        required: false,
        schema: { type: 'integer', default: 20, maximum: 1024 },
        description: '返回的最大链接数量',
      },
      {
        name: 'cursor',
        in: 'query',
        required: false,
        schema: { type: 'string' },
        description: '来自上次响应的分页游标',
      },
    ],
  },
})

const ListQuerySchema = z.object({
  limit: z.coerce.number().max(1024).default(20),
  cursor: z.string().trim().max(1024).optional(),
})

export default eventHandler(async (event) => {
  const { limit, cursor } = await getValidatedQuery(event, ListQuerySchema.parse)

  const list = await listLinks(event, { limit, cursor })
  return {
    ...list,
    links: sanitizeLinksPassword(list.links),
  }
})
