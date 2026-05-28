
import type { ExportData, Link } from '#shared/schemas/link'

defineRouteMeta({
  openAPI: {
    description: '导出所有链接（分页）',
    security: [{ bearerAuth: [] }],
    parameters: [
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

export default eventHandler(async (event) => {
  const query = getQuery(event)
  const cursor = query.cursor as string | undefined
  const kvBatchLimit = useRuntimeConfig(event).public.kvBatchLimit as string
  const limit = +kvBatchLimit

  const list = await listLinks(event, { limit, cursor })
  const links: Link[] = []
  for (const link of list.links) {
    if (link) {
      links.push(await protectLinkPasswordForExport(link))
    }
  }

  const exportData: ExportData = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    count: links.length,
    links,
    cursor: list.cursor,
    list_complete: list.list_complete,
  }

  setResponseHeader(event, 'Content-Type', 'application/json')
  setResponseHeader(event, 'Cache-Control', 'no-store')

  return exportData
})
