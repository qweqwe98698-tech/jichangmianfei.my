import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * 万字级 SEO / GEO 专题主线方向矩阵文章生成引擎
 * 严格遵照《AI内容生产行为控制系统 V8.0》与 TYPE-F 核心专题标准
 */
export async function generateMatrixArticle({ topic, existingArticles = [] }) {
  const apiKey = process.env.DEEPSEEK_API_KEY
  if (!apiKey) {
    throw new Error('未检测到 DEEPSEEK_API_KEY 环境变量，请在 GitHub Secrets 或运行环境中配置。')
  }

  // 整理站内既有高权重页面作为内链种子
  const internalLinkSeeds = existingArticles.slice(0, 12).map(a => `- [${a.title}](https://jichangmianfei.my${a.url})`).join('\n')

  const prompt = `你是一名资深网络协议架构师、网络安全专家与高级 SEO/GEO 内容总监。
请根据以下专题，撰写一篇达到万字级（6,000-10,000字深度篇幅）、具有极高行业权威度与 AI 搜索（GEO：Generative Engine Optimization）引用价值的【TYPE-F 核心专题主线矩阵文章】。

【待生产专题信息】
- 主题：${topic.title}
- 核心分类空间：${topic.category}
- 目标关键词：${topic.targetKeywords.join(', ')}
- 核心搜索意图：${topic.searchIntent}
- 目标发布路径：docs/${topic.category}/${topic.slug}.md

【GEO / AI 搜索优化强制规范】
1. **直接回答与定义（GEO Quick Answer）**：开头 200-300 字必须用客观、严谨、直接的语言给出核心概念定义和选型结论，专门供 AI 搜索引擎（Perplexity、ChatGPT Search、Bing Copilot 等）抓取作为首选摘要引用。
2. **多维度横评矩阵表**：必须包含至少 2 个高信息密度的 Markdown 对比表格（包含底层协议、时延抖动、加密开销、晚高峰抗丢包率、适用场景等维度）。
3. **技术拓扑与原理解析**：深入到数据链路层、TCP/UDP握手、TLS加密伪装、BGP/物理专线机房架构等底层，严禁泛泛而谈。
4. **全场景决策指南**：针对“流媒体4K/8K、AI大模型（ChatGPT/Claude）、跨境外贸、联机游戏”等具体业务场景提供细分建议。
5. **故障排查与避坑手册**：包含真实环境下的丢包、断流、DNS泄漏、QoS限速应对策略。
6. **10 个真实高频搜索 FAQ**：每个回答必须详实有力（150字以上），能够独立解决用户疑惑。
7. **站内自然内链布局**：正文中自然融入 3-5 处指向以下既有高权重页面的站内 Markdown 相对链接（如 [IEPL专线解析](/knowledge/iepl-vs-relay-lines)、[客户端安装指南](/tutorial/)、[稳定机场推荐](/free-airport/recommendations) 等）。

【格式与 Frontmatter 强制规范】
必须以标准 VitePress Markdown 格式输出，且**首行直接开始 YAML Frontmatter**，不要在开头或结尾加任何多余的对话包装或额外 markdown 代码围栏（即不要以 \`\`\`markdown 开头）：

---
title: ${topic.title}
description: [120-160字的精准描述，包含核心关键词]
head:
  - - script
    - type: application/ld+json
    - |
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "TechArticle",
            "headline": "${topic.title}",
            "description": "[简明摘要]",
            "inLanguage": "zh-CN",
            "mainEntityOfPage": "https://jichangmianfei.my/${topic.category}/${topic.slug}",
            "author": {
              "@type": "Organization",
              "name": "机场免费团队",
              "url": "https://jichangmianfei.my"
            },
            "publisher": {
              "@type": "Organization",
              "name": "机场免费",
              "logo": "https://jichangmianfei.my/logo.svg"
            },
            "datePublished": "2026-10-02",
            "dateModified": "2026-10-02"
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              [列出文章中 3-5 个最具代表性的 Question 与 Answer JSON]
            ]
          }
        ]
      }
---

# ${topic.title}

[正文按要求展开，层级规范，章节丰富，专业严密]`

  console.log(`🤖 正在调用 DeepSeek API 生成万字级 SEO/GEO 矩阵文章: 《${topic.title}》...`)

  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: '你是一个顶级技术作家和网络协议专家，专业严谨，擅长输出结构完整、信息密度极高、具有深度原创价值的长篇技术专题。你的回答直接输出合规的 Markdown 源码。'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.6,
      max_tokens: 8192
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`DeepSeek API 请求失败 [HTTP ${response.status}]: ${errorText}`)
  }

  const data = await response.json()
  let content = data.choices?.[0]?.message?.content || ''

  // 清洗可能存在的 markdown 外层包裹
  content = content.trim()
  if (content.startsWith('```markdown')) {
    content = content.replace(/^```markdown\s*/, '').replace(/\s*```$/, '').trim()
  } else if (content.startsWith('```')) {
    content = content.replace(/^```\s*/, '').replace(/\s*```$/, '').trim()
  }

  return content
}
