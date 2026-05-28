
defineRouteMeta({
  openAPI: {
    description: '手动触发备份至 R2',
    security: [{ bearerAuth: [] }],
  },
})

export default eventHandler(async (event) => {
  const env = event.context.cloudflare.env

  requireR2Bucket(env)

  await backupKVToR2(env, true)

  return {
    success: true,
    message: '备份成功完成',
  }
})
