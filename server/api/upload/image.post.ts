import { LinkSchema, nanoid } from '#shared/schemas/link'
import { IMAGE_ALLOWED_TYPES, IMAGE_MAX_SIZE } from '@/utils/image'

const slugValidator = LinkSchema.shape.slug

defineRouteMeta({
  openAPI: {
    description: '上传图片至 R2 存储',
    requestBody: {
      required: true,
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            required: ['file', 'slug'],
            properties: {
              file: { type: 'string', format: 'binary' },
              slug: { type: 'string' },
            },
          },
        },
      },
    },
  },
})

export default eventHandler(async (event) => {
  const R2 = requireR2Bucket(event.context.cloudflare.env)

  const formData = await readFormData(event)
  const file = formData.get('file') as File | null
  const slug = formData.get('slug') as string | null

  if (!file) {
    throw createError({ status: 400, statusText: '缺少文件' })
  }

  if (!slug) {
    throw createError({ status: 400, statusText: '缺少 slug' })
  }

  const slugResult = slugValidator.safeParse(slug)
  if (!slugResult.success) {
    throw createError({ status: 400, statusText: 'slug 格式无效' })
  }

  if (!IMAGE_ALLOWED_TYPES.includes(file.type)) {
    throw createError({ status: 400, statusText: '无效的文件类型。允许的类型：jpeg, png, webp, gif' })
  }

  if (file.size > IMAGE_MAX_SIZE) {
    throw createError({ status: 400, statusText: '文件大小超过 5MB 限制' })
  }

  const ext = file.type.split('/')[1]
  const key = `images/${slug}/${nanoid(10)()}.${ext}`

  const arrayBuffer = await file.arrayBuffer()
  await R2.put(key, arrayBuffer, {
    httpMetadata: {
      contentType: file.type,
    },
  })

  const imageUrl = `/_assets/${key}`
  return { url: imageUrl, key }
})
