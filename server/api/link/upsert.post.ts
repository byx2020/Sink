
import { LinkSchema } from '#shared/schemas/link'

defineRouteMeta({
  openAPI: {
    description: '创建或更新短链接（upsert）',
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['url'],
            properties: {
              url: { type: 'string', description: '目标 URL' },
              slug: { type: 'string', description: '自定义 slug（若不提供则自动生成）' },
              comment: { type: 'string', description: '可选备注' },
              expiration: { type: 'integer', description: '过期时间戳（Unix 秒）' },
              title: { type: 'string', description: '自定义链接预览标题' },
              description: { type: 'string', description: '自定义链接预览描述' },
              image: { type: 'string', description: '自定义链接预览图片' },
              apple: { type: 'string', description: 'Apple App Store 重定向 URL' },
              google: { type: 'string', description: 'Google Play Store 重定向 URL' },
              unsafe: { type: 'boolean', description: '将链接标记为不安全，重定向前显示警告页面' },
              geo: { type: 'object', additionalProperties: { type: 'string' }, description: '地区路由规则（国家代码到 URL 的映射）' },
            },
          },
        },
      },
    },
  },
})

export default eventHandler(async (event) => {
  const link = await readValidatedBody(event, LinkSchema.parse)

  await prepareIncomingLink(event, link)

  const existingLink = await getLink(event, link.slug)
  if (existingLink) {
    return { ...buildLinkResponse(event, existingLink), status: 'existing' }
  }

  await hashLinkPasswordForCreate(link)

  await putLink(event, link)
  setResponseStatus(event, 201)
  return { ...buildLinkResponse(event, link), status: 'created' }
})
