
defineRouteMeta({
  openAPI: {
    description: '验证站点令牌',
    responses: {
      200: {
        description: '站点令牌有效',
      },
      default: {
        description: '站点令牌无效',
      },
    },
  },
})

export default eventHandler(() => {
  return {
    name: 'Sink',
    url: 'https://sink.cool',
  }
})
