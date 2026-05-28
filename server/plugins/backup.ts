
/// <reference path="../../worker-configuration.d.ts" />

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('cloudflare:scheduled', async (event) => {
    const config = useRuntimeConfig()

    if (config.disableAutoBackup) {
      console.info('[backup:kv] 自动备份已被配置禁用')
      return
    }

    const env = event.env as Cloudflare.Env
    await backupKVToR2(env)
  })
})
