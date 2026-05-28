
import type { z } from 'zod'
import { EditLinkPasswordSchema, LinkSchema } from '#shared/schemas/link'

const EditLinkSchema = LinkSchema.extend({
  password: EditLinkPasswordSchema,
})

defineRouteMeta({
  openAPI: {
    description: '编辑已有的短链接',
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['url', 'slug'],
            properties: {
              url: { type: 'string', description: '目标 URL' },
              slug: { type: 'string', description: '要编辑的链接的 slug' },
              comment: { type: 'string', description: '可选备注' },
              expiration: { type: 'integer', description: '过期时间戳（Unix 秒）' },
              title: { type: 'string', description: '自定义链接预览标题' },
              description: { type: 'string', description: '自定义链接预览描述' },
              image: { type: 'string', description: '自定义链接预览图片' },
              apple: { type: 'string', description: 'Apple App Store 重定向 URL' },
              google: { type: 'string', description: 'Google Play Store 重定向 URL' },
              cloaking: { type: 'boolean', description: '启用链接伪装（隐藏目标 URL）' },
              redirectWithQuery: { type: 'boolean', description: '将查询参数附加到目标 URL' },
              password: { type: 'string', description: '链接的密码保护' },
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
  const { previewMode } = useRuntimeConfig(event).public
  if (previewMode) {
    throw createError({
      status: 403,
      statusText: 'Preview mode cannot edit links.',
    })
  }
  const link = await readValidatedBody(event, EditLinkSchema.parse)

  const existingLink: z.infer<typeof LinkSchema> | null = await getLink(event, link.slug)
  if (!existingLink) {
    throw createError({
      status: 404,
      statusText: 'Link not found',
    })
  }

  if (link.url !== existingLink.url)
    await detectUnsafeLink(event, link)

  const newLink = mergeEditableLink(existingLink, link)
  await applyEditableLinkPassword(newLink, link.password)

  await putLink(event, newLink)
  setResponseStatus(event, 201)
  return buildLinkResponse(event, newLink)
})
