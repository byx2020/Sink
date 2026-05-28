
import type { H3Event } from 'h3'
import type { AiChatResponse } from '../../utils/ai'
import { destr } from 'destr'
import { z } from 'zod'
import { stripCodeFence } from '../../utils/ai'

defineRouteMeta({
  openAPI: {
    description: '使用 AI 基于 URL 生成 OpenGraph 标题和描述',
    security: [{ bearerAuth: [] }],
    parameters: [
      {
        name: 'url',
        in: 'query',
        required: true,
        schema: { type: 'string', format: 'uri' },
        description: '需要生成 OpenGraph 元数据的 URL',
      },
      {
        name: 'locale',
        in: 'query',
        required: false,
        schema: { type: 'string' },
        description: '生成元数据的首选语言环境',
      },
    ],
  },
})

function fallbackMetadata(url: string): { title: string, description: string } {
  try {
    const { hostname } = new URL(url)

    return {
      title: hostname.replace(/^www\./, ''),
      description: `用于 ${url} 的短链接`,
    }
  }
  catch {
    return {
      title: '短链接',
      description: '在 Sink 上查看此链接。',
    }
  }
}

function resolveMetadataLocale(event: H3Event, locale?: string): string {
  const value = locale?.trim()
  if (!value) {
    return resolveRedirectLocale(event)
  }

  try {
    return Intl.getCanonicalLocales(value)[0] || resolveRedirectLocale(event)
  }
  catch {
    return resolveRedirectLocale(event)
  }
}

export default eventHandler(async (event) => {
  const query = await getValidatedQuery(event, z.object({
    url: z.string().url(),
    locale: z.string().optional(),
  }).parse)
  const { url } = query
  const { cloudflare } = event.context
  const { AI } = cloudflare.env

  if (!AI) {
    throw createError({ status: 501, statusText: 'AI 未启用' })
  }

  const { aiOgPrompt, aiModel } = useRuntimeConfig(event)
  const locale = resolveMetadataLocale(event, query.locale)

  const markdown = await fetchPageMarkdown(event, url, AI)
  const userContent = markdown
    ? `URL: ${url}\n\n页面内容:\n${markdown}`
    : url

  const messages = [
    { role: 'system', content: `${aiOgPrompt}\n请生成与该语言环境匹配的标题和描述: ${locale}。` },

    { role: 'user', content: 'https://www.cloudflare.com/' },
    { role: 'assistant', content: '{"title": "Cloudflare", "description": "Cloudflare 是一个全球网络，旨在使您连接到互联网的一切都安全、私密、快速且可靠。"}' },

    { role: 'user', content: 'https://github.com/nuxt/' },
    { role: 'assistant', content: '{"title": "Nuxt", "description": "Nuxt 是一个直观且可扩展的 Vue 框架，用于创建现代 Web 应用程序。"}' },

    { role: 'user', content: userContent },
  ]

  const response = await AI.run(aiModel as keyof AiModels, {
    messages,
    chat_template_kwargs: {
      enable_thinking: false,
      thinking: false,
    },
  }) as AiChatResponse

  const content = response.response ?? response.choices?.[0]?.message?.content ?? ''
  const fallback = fallbackMetadata(url)
  const parsed = content.trim() ? destr(stripCodeFence(content)) : undefined
  const result = typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
    ? parsed as Record<string, unknown>
    : {}

  const title = String(result.title ?? '').trim() || fallback.title
  const description = String(result.description ?? '').trim() || fallback.description

  return {
    title,
    description,
  }
})
