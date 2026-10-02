import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const REGISTRY_PATH = path.join(__dirname, 'existing-url-registry.json')

// URL 防批量 AI 识别优化系统 (Anti-AI URL Architecture System)
export class UrlAntiAiOptimizer {
  constructor() {
    this.loadRegistry()
  }

  loadRegistry() {
    if (fs.existsSync(REGISTRY_PATH)) {
      this.registry = JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf-8'))
    } else {
      this.registry = []
    }
  }

  saveRegistry() {
    fs.writeFileSync(REGISTRY_PATH, JSON.stringify(this.registry, null, 2), 'utf-8')
  }

  /**
   * 严格校验 URL 是否违反防批量 AI 规则
   */
  validateUrl(url, slug, category) {
    const issues = []

    // 1. 禁止机械编号 URL
    if (/(?:article|post|page|guide|item|doc)[-_]?\d{2,}/i.test(slug) || /\b\d{3,}\b/.test(slug)) {
      issues.push(`触发禁止规则：包含机械数字编号 (${slug})，容易暴露自动批量生成特征。`)
    }

    // 2. 禁止时间驱动 URL (如 2026/08, 2026-08)
    if (/\b(?:202[0-9]|19[0-9]{2})[-_/](?:0[1-9]|1[0-2])\b/.test(url) || /^\d{4}-\d{2}-\d{2}/.test(slug)) {
      issues.push(`触发禁止规则：包含时间驱动目录或日期前缀 (${url})。`)
    }

    // 3. 禁止中文字符
    if (/[\u4e00-\u9fa5]/.test(url)) {
      issues.push(`触发禁止规则：URL 包含中文字符 (${url})，必须为纯英文语义化。`)
    }

    // 4. 禁止下划线
    if (url.includes('_')) {
      issues.push(`触发禁止规则：URL 包含下划线 (_) (${url})，必须使用短横线 (-)。`)
    }

    // 5. 禁止超过 3 级层级
    const segments = url.split('/').filter(Boolean)
    if (segments.length > 2) { // 例如 /category/slug 为 2 级 (基于根目录)
      issues.push(`触发禁止规则：URL 层级深度超过规范 (${url})，最大允许 3 层架构。`)
    }

    // 6. 禁止关键词过度堆叠 (分词超过 5 个短语)
    const words = slug.split('-').filter(Boolean)
    if (words.length > 5) {
      issues.push(`触发禁止规则：URL 关键词堆叠过度 (${slug})，核心词应保持在 1-4 个以内。`)
    }

    // 7. 检查与已有已注册 URL 是否重复冲突
    const exists = this.registry.find(item => item.url === url || item.slug === slug)
    if (exists) {
      issues.push(`触发唯一性冲突：URL 或 Slug 已存在于注册表中 (${url} -> ${exists.title})。`)
    }

    return {
      valid: issues.length === 0,
      issues
    }
  }

  /**
   * 将关键词或选题转换为符合防批量 AI 规范的语义化 Slug
   */
  sanitizeSlug(inputSlug) {
    let clean = inputSlug
      .toLowerCase()
      .replace(/[_\s]+/g, '-')
      .replace(/[^a-z0-9-]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    // 移除时间或纯数字前缀/后缀
    clean = clean.replace(/-(?:202[4-9]|2030)$/, '')
    clean = clean.replace(/^(?:202[4-9]|2030)-/, '')
    clean = clean.replace(/-(?:00[0-9]|0[0-9]{2}|\d{3,})$/, '')

    // 限制词数在 1-4 个以内
    const parts = clean.split('-').filter(Boolean)
    if (parts.length > 4) {
      clean = parts.slice(0, 4).join('-')
    }

    return clean
  }

  /**
   * 自动决定内容隔离分类空间 (Topic Cluster Isolation)
   */
  determineCategory(category, title = '', intent = '') {
    const validCategories = ['knowledge', 'tutorial', 'troubleshooting', 'free-airport', 'free-node']
    if (validCategories.includes(category)) {
      return category
    }

    const text = `${title} ${intent}`.toLowerCase()
    if (text.includes('排查') || text.includes('解决') || text.includes('打不开') || text.includes('超时') || text.includes('错误') || text.includes('leak') || text.includes('fail')) {
      return 'troubleshooting'
    }
    if (text.includes('教程') || text.includes('配置') || text.includes('客户端') || text.includes('安装') || text.includes('规则集') || text.includes('sing-box') || text.includes('clash')) {
      return 'tutorial'
    }
    if (text.includes('节点') || text.includes('订阅') || text.includes('v2rayn') || text.includes('shadowrocket')) {
      return 'free-node'
    }
    if (text.includes('评测') || text.includes('选型') || text.includes('推荐') || text.includes('试用') || text.includes('便宜') || text.includes('专线')) {
      return 'free-airport'
    }
    return 'knowledge'
  }

  /**
   * 注册并锁定新发布的 URL
   */
  registerNewUrl({ url, slug, file, category, title, description, cluster }) {
    const validation = this.validateUrl(url, slug, category)
    if (!validation.valid) {
      throw new Error(`URL 验证失败:\n${validation.issues.join('\n')}`)
    }

    const newEntry = {
      url,
      slug,
      file,
      pageType: category,
      canonical: `https://jichangmianfei.my${url}`,
      title,
      description,
      category,
      cluster: cluster || category,
      status: 'published',
      protected: true,
      publishedAt: new Date().toISOString()
    }

    this.registry.push(newEntry)
    this.saveRegistry()
    console.log(`🔒 [URL防AI系统] 新 URL 已通过合规审查并写入注册表: ${url}`)
    return newEntry
  }
}
