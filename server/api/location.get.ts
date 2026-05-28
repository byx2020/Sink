
defineRouteMeta({
  openAPI: {
    description: '获取用户的位置',
    responses: {
      200: {
        description: '用户的位置',
      },
    },
  },
})

export default eventHandler((event) => {
  const { cloudflare } = event.context
  const { request: { cf } } = cloudflare
  return {
    latitude: cf?.latitude,
    longitude: cf?.longitude,
  }
})
