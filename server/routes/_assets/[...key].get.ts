
import { LinkSchema } from '#shared/schemas/link'

const slugValidator = LinkSchema.shape.slug

export default eventHandler(async (event) => {
  const R2 = requireR2Bucket(event.context.cloudflare.env)
  const key = getRouterParam(event, 'key')

  if (!key) {
    throw createError({ status: 400, statusText: '缺少 key' })
  }

  // 仅允许访问 images/ 路径
  if (!key.startsWith('images/')) {
    throw createError({ status: 403, statusText: '访问被拒绝' })
  }

  // 验证路径中的 slug: images/{slug}/{filename}
  const parts = key.split('/')
  if (parts.length < 3) {
    throw createError({ status: 400, statusText: '路径格式无效' })
  }

  const slug = parts[1]
  const slugResult = slugValidator.safeParse(slug)
  if (!slugResult.success) {
    throw createError({ status: 400, statusText: 'slug 格式无效' })
  }

  const object = await R2.get(key)

  if (!object) {
    throw createError({ status: 404, statusText: '图片未找到' })
  }

  const contentType = object.httpMetadata?.contentType || 'application/octet-stream'

  setHeader(event, 'Content-Type', contentType)
  setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
  setHeader(event, 'ETag', object.etag)

  return object.body
})
