
import type { ImportResult } from '#shared/schemas/import'
import { ImportDataSchema } from '#shared/schemas/import'
import { nanoid } from '#shared/schemas/link'

defineRouteMeta({
  openAPI: {
    description: '从导出的数据导入链接',
    security: [{ bearerAuth: [] }],
    requestBody: {
      required: true,
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['version', 'links'],
            properties: {
              version: { type: 'string', description: '导出格式版本' },
              exportedAt: { type: 'string', description: '导出时间戳（ISO 8601）' },
              count: { type: 'integer', description: '导出中的链接数量' },
              links: {
                type: 'array',
                description: '要导入的链接数组',
                items: {
                  type: 'object',
                  required: ['url', 'slug'],
                  properties: {
                    id: { type: 'string', description: '链接 ID（若不提供则自动生成）' },
                    url: { type: 'string', description: '目标 URL' },
                    slug: { type: 'string', description: '短链接的 slug' },
                    comment: { type: 'string', description: '可选备注' },
                    createdAt: { type: 'integer', description: '创建时间戳（Unix 秒）' },
                    updatedAt: { type: 'integer', description: '最后更新时间戳（Unix 秒）' },
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
      },
    },
  },
})

export default eventHandler(async (event) => {
  const kvBatchLimit = useRuntimeConfig(event).public.kvBatchLimit as string
  const maxLinks = Math.floor(+kvBatchLimit / 2)

  const importData = await readValidatedBody(event, ImportDataSchema.parse)

  if (importData.links.length > maxLinks) {
    throw createError({
      status: 400,
      statusText: `链接数量过多。每次请求最多允许 ${maxLinks} 个链接。`,
    })
  }

  const result: ImportResult = {
    success: 0,
    skipped: 0,
    failed: 0,
    successItems: [],
    skippedItems: [],
    failedItems: [],
  }

  for (let i = 0; i < importData.links.length; i++) {
    const linkData = importData.links[i]

    if (!linkData) {
      result.failed++
      result.failedItems.push({
        index: i,
        slug: '',
        url: '',
        reason: 'Missing link data',
      })
      continue
    }

    try {
      const slug = normalizeSlug(event, linkData.slug)
      const existingLink = await getLink(event, slug)

      if (existingLink) {
        result.skippedItems.push({ index: i, slug, url: linkData.url })
        result.skipped++
        continue
      }

      const now = Math.floor(Date.now() / 1000)
      const link = {
        ...linkData,
        id: linkData.id || nanoid(10)(),
        slug,
        createdAt: linkData.createdAt || now,
        updatedAt: linkData.updatedAt || now,
      }

      if (link.password) {
        link.password = await normalizeLinkPasswordForStorage(link.password)
      }

      await putLink(event, link)
      result.successItems.push({ index: i, slug, url: linkData.url })
      result.success++
    }
    catch (error) {
      result.failed++
      result.failedItems.push({
        index: i,
        slug: linkData.slug,
        url: linkData.url,
        reason: error instanceof Error ? error.message : '未知错误',
      })
    }
  }

  setResponseHeader(event, 'Cache-Control', 'no-store')

  return result
})
