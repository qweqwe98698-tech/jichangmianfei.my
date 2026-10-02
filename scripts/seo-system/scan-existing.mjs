import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.resolve(__dirname, '../..')
const DOCS_DIR = path.join(ROOT_DIR, 'docs')
const REGISTRY_PATH = path.join(__dirname, 'existing-url-registry.json')

function walkDir(dir) {
  let results = []
  const list = fs.readdirSync(dir)
  for (const item of list) {
    if (item === '.vitepress' || item === 'public' || item === 'images') continue
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)
    if (stat.isDirectory()) {
      results = results.concat(walkDir(fullPath))
    } else if (item.endsWith('.md')) {
      results.push(fullPath)
    }
  }
  return results
}

export function buildExistingRegistry() {
  const mdFiles = walkDir(DOCS_DIR)
  const registry = []

  for (const filePath of mdFiles) {
    const relPath = path.relative(DOCS_DIR, filePath).replace(/\\/g, '/')
    const content = fs.readFileSync(filePath, 'utf-8')
    
    // 提取 frontmatter
    const titleMatch = content.match(/^title:\s*(.+)$/m)
    const descMatch = content.match(/^description:\s*(.+)$/m)
    const title = titleMatch ? titleMatch[1].replace(/^["']|["']$/g, '').trim() : ''
    const description = descMatch ? descMatch[1].replace(/^["']|["']$/g, '').trim() : ''

    const cleanPath = relPath
      .replace(/index\.md$/, '')
      .replace(/\.md$/, '')
      .replace(/\/$/, '')
    
    const url = cleanPath === '' ? '/' : `/${cleanPath}`
    const parts = cleanPath.split('/').filter(Boolean)
    const category = parts.length > 0 ? parts[0] : 'home'
    const slug = parts.length > 1 ? parts[parts.length - 1] : (parts[0] || 'home')

    registry.push({
      url,
      slug,
      file: relPath,
      pageType: category,
      canonical: `https://jichangmianfei.my${url === '/' ? '' : url}`,
      title,
      description,
      category,
      cluster: category,
      status: 'published',
      protected: true
    })
  }

  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2), 'utf-8')
  console.log(`✅ 已扫描并注册 ${registry.length} 个现有有效页面至 existing-url-registry.json`)
  return registry
}

// 直接执行
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  buildExistingRegistry()
}
