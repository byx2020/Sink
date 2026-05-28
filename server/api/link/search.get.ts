
defineRouteMeta({
  openAPI: {
    description: '搜索所有链接（返回每个链接的 slug、url、comment）',
    security: [{ bearerAuth: [] }],
  },
})

interface Link {
  slug: string
  url: string
  comment?: string
}

interface LinkMetadata {
  url?: string
  comment?: string
  expiration?: number
}

interface LinkData {
  url: string
  comment?: string
}

export default eventHandler(async (event) => {
  const { cloudflare } = event.context
  const { KV } = cloudflare.env
  const list: Link[] = []
  let finalCursor: string | undefined

  try {
    while (true) {
      const result = await KV.list({
        prefix: `link:`,
        limit: 1000,
        cursor: finalCursor,
      }) as { keys: Array<{ name: string, metadata?: LinkMetadata }>, list_complete: boolean, cursor?: string }

      finalCursor = result.cursor

      if (Array.isArray(result.keys)) {
        for (const key of result.keys) {
          try {
            if (key.metadata?.url) {
              list.push({
                slug: key.name.replace('link:', ''),
                url: key.metadata.url,
                comment: key.metadata.comment,
              })
            }
            else {
              // 向前兼容没有元数据的链接
              const { metadata, value: link } = await KV.getWithMetadata(key.name, { type: 'json' }) as { metadata: LinkMetadata | null, value: LinkData | null }
              if (link) {
                list.push({
                  slug: key.name.replace('link:', ''),
                  url: link.url,
                  comment: link.comment,
                })
                await KV.put(key.name, JSON.stringify(link), {
                  expiration: metadata?.expiration,
                  metadata: {
                    ...(metadata ?? {}),
                    url: withoutQuery(link.url),
                    comment: link.comment,
                  },
                })
              }
            }
          }
          catch (err) {
            console.error(`处理键 ${key.name} 时出错:`, err)
            continue // 跳过此键，继续处理下一个
          }
        }
      }

      if (!result.keys || result.list_complete) {
        break
      }
    }
    return list
  }
  catch (err) {
    console.error('获取链接列表时出错:', err)
    throw createError({
      status: 500,
      statusText: '获取链接列表失败',
    })
  }
})
