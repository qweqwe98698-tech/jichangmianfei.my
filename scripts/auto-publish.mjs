import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'
import { buildExistingRegistry } from './seo-system/scan-existing.mjs'
import { UrlAntiAiOptimizer } from './seo-system/url-anti-ai-optimizer.mjs'
import { generateMatrixArticle } from './generate-matrix-article.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.resolve(__dirname, '..')
const DOCS_DIR = path.join(ROOT_DIR, 'docs')
const TOPIC_MATRIX_PATH = path.join(__dirname, 'seo-system', 'topic-matrix.json')
const CONFIG_PATH = path.join(DOCS_DIR, '.vitepress', 'config.ts')

/**
 * 更新 VitePress sidebar 链接，避免孤岛页面 (No Orphan Pages)
 */
function updateSidebarConfig(category, title, link) {
  if (!fs.existsSync(CONFIG_PATH)) return
  let configContent = fs.readFileSync(CONFIG_PATH, 'utf-8')
  
  if (configContent.includes(`link: '${link}'`)) {
    console.log(`ℹ️ 导航已存在该链接: ${link}`)
    return
  }

  // 匹配对应分类的 sidebar 数组中的第一个 items 列表
  const categoryKey = `'/${category}/':`
  const catIndex = configContent.indexOf(categoryKey)
  if (catIndex !== -1) {
    const itemsKey = 'items: ['
    const itemsIndex = configContent.indexOf(itemsKey, catIndex)
    if (itemsIndex !== -1) {
      const insertPos = itemsIndex + itemsKey.length
      // 提取标题前 20 个字作为侧边栏短标题
      const shortTitle = title.replace(/\(.*?\)|（.*?）/g, '').slice(0, 24).trim()
      const newLine = `\n            { text: '${shortTitle}', link: '${link}' },`
      configContent = configContent.slice(0, insertPos) + newLine + configContent.slice(insertPos)
      fs.writeFileSync(CONFIG_PATH, configContent, 'utf-8')
      console.log(`🔗 [内链防孤岛系统] 已自动挂载至 sidebar 导航: [${shortTitle}] -> ${link}`)
    }
  }
}

async function runAutoPublish() {
  console.log('==============================================================================')
  console.log('       🚀 启动自动发布：万字级 SEO/GEO 专题主线方向矩阵文章发布流水线         ')
  console.log('==============================================================================\n')

  // 1. 同步并扫描已有所有页面
  const existingArticles = buildExistingRegistry()
  const optimizer = new UrlAntiAiOptimizer()

  // 2. 读取专题选题队列
  if (!fs.existsSync(TOPIC_MATRIX_PATH)) {
    throw new Error('未找到专题选题库 topic-matrix.json')
  }
  const topics = JSON.parse(fs.readFileSync(TOPIC_MATRIX_PATH, 'utf-8'))

  // 3. 寻找下一个待发布的专题 (未发布且未在已有注册表中)
  const topic = topics.find(t => t.status !== 'published')
  if (!topic) {
    console.log('✅ 所有预设矩阵专题已全部发布完毕！请向 topic-matrix.json 追加新的主线选题。')
    return
  }

  console.log(`🎯 选中当前待生产专题:`)
  console.log(`   - 标题: ${topic.title}`)
  console.log(`   - 分类空间: ${topic.category}`)
  console.log(`   - 意图: ${topic.searchIntent}`)

  // 4. URL 防批量 AI 识别优化审查
  const cleanSlug = optimizer.sanitizeSlug(topic.slug)
  const category = optimizer.determineCategory(topic.category, topic.title, topic.searchIntent)
  const proposedUrl = `/${category}/${cleanSlug}`

  console.log(`🔎 执行 URL 防批量 AI 识别优化系统校验...`)
  const validation = optimizer.validateUrl(proposedUrl, cleanSlug, category)
  if (!validation.valid) {
    console.error('❌ URL 未通过防批量 AI 系统审核：')
    validation.issues.forEach(iss => console.error(`   - ${iss}`))
    throw new Error('URL 审核阻断，发布流程中止。')
  }
  console.log(`✅ [URL防AI系统审查通过] 规范语义化路径: ${proposedUrl}`)

  // 5. 调用 DeepSeek API 生成万字级文章
  const articleMarkdown = await generateMatrixArticle({ topic, existingArticles })
  const targetFilePath = path.join(DOCS_DIR, category, `${cleanSlug}.md`)

  // 6. 写入目标文档文件
  fs.writeFileSync(targetFilePath, articleMarkdown, 'utf-8')
  console.log(`📝 文章内容已安全写入: docs/${category}/${cleanSlug}.md`)

  // 7. 更新 sidebar 导航，杜绝孤岛页面
  updateSidebarConfig(category, topic.title, proposedUrl)

  // 8. 写入 URL 注册表并更新选题库状态
  optimizer.registerNewUrl({
    url: proposedUrl,
    slug: cleanSlug,
    file: `${category}/${cleanSlug}.md`,
    category,
    title: topic.title,
    description: topic.searchIntent,
    cluster: topic.cluster
  })

  topic.status = 'published'
  topic.publishedUrl = proposedUrl
  topic.publishedAt = new Date().toISOString()
  fs.writeFileSync(TOPIC_MATRIX_PATH, JSON.stringify(topics, null, 2), 'utf-8')

  // 9. 执行全站 SEO 编译与安全门禁检查
  console.log('\n⚙️ 开始执行构建与 SEO 门禁检查...')
  execSync('npm run build', { cwd: ROOT_DIR, stdio: 'inherit' })

  // 10. 触发 IndexNow API 实时推送
  console.log('\n📡 开始向 IndexNow 实时推送最新 URL...')
  execSync('npm run indexnow', { cwd: ROOT_DIR, stdio: 'inherit' })

  console.log('\n==============================================================================')
  console.log('🎉 自动发布流水线执行完毕！万字级 SEO/GEO 专题文章已就绪并完成门禁校验。')
  console.log(`📄 发布文件: docs/${category}/${cleanSlug}.md`)
  console.log(`🌐 线上访问路径: https://jichangmianfei.my${proposedUrl}`)
  console.log('==============================================================================\n')

  return {
    title: topic.title,
    url: proposedUrl,
    file: `docs/${category}/${cleanSlug}.md`
  }
}

runAutoPublish().catch(err => {
  console.error('❌ 自动发布流水线执行出错:', err)
  process.exit(1)
})
