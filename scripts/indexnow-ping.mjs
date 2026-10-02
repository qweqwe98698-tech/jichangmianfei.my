import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.resolve(__dirname, '..')
const DIST_DIR = path.join(ROOT_DIR, 'docs', '.vitepress', 'dist')
const SITEMAP_PATH = path.join(DIST_DIR, 'sitemap.xml')

const HOST = 'jichangmianfei.my'
const KEY = 'ccd96e5503a6448099a69a0f0da0de20'
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`

async function pingIndexNow() {
  console.log('🚀 开始准备向 IndexNow API 推送全站最新 URL...')

  if (!fs.existsSync(SITEMAP_PATH)) {
    console.error('❌ 错误: sitemap.xml 不存在，请先执行 build。')
    process.exit(1)
  }

  const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf-8')
  const locMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g) || []
  const urlList = locMatches.map(m => m.replace(/<\/?loc>/g, '').trim())

  console.log(`📋 准备推送 ${urlList.length} 条已规范化的 Clean URLs 至 Bing / Yandex / IndexNow...`)

  const payload = {
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: urlList
  }

  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(payload)
    })

    if (response.status === 200 || response.status === 202) {
      console.log(`✅ IndexNow 推送成功！HTTP 状态码: ${response.status} (Bing 与支持 IndexNow 的搜索引擎已实时接收 URL 变更)`)
    } else {
      console.log(`⚠️ IndexNow 响应状态: ${response.status} (${await response.text()})`)
    }
  } catch (error) {
    console.warn(`⚠️ IndexNow 网络连接提示 (构建环境免阻断): ${error.message}`)
  }
}

pingIndexNow()
