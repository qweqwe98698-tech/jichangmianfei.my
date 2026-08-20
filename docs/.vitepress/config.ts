import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '机场免费',
  titleTemplate: ':title - 机场免费 jichangmianfei.my',
  description: '机场免费（jichangmianfei.my）专注提供2026最新免费机场推荐、免费节点订阅源、Clash/v2rayN/小火箭实战配置教程、网络连接超时排查与高性价比机场深度评测。',
  lang: 'zh-CN',
  base: '/',
  cleanUrls: true,
  lastUpdated: true,
  
  sitemap: {
    hostname: 'https://jichangmianfei.my'
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'keywords', content: '免费机场,免费节点,免费订阅,机场推荐,Clash免费节点,小火箭免费节点,v2rayN节点,机场评测,光速云' }],
    ['meta', { name: 'author', content: '机场免费团队' }],
    ['meta', { property: 'og:site_name', content: '机场免费' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    // 全局基础 Organization 与 WebSite 结构化数据
    [
      'script',
      { type: 'application/ld+json' },
      JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': 'https://jichangmianfei.my/#website',
            'url': 'https://jichangmianfei.my',
            'name': '机场免费',
            'description': '2026 免费机场与节点测速评测指南，专注于网络代理科普、客户端实战教程与故障排查',
            'inLanguage': 'zh-CN'
          },
          {
            '@type': 'Organization',
            '@id': 'https://jichangmianfei.my/#organization',
            'name': '机场免费 (jichangmianfei.my)',
            'url': 'https://jichangmianfei.my',
            'logo': 'https://jichangmianfei.my/logo.svg'
          }
        ]
      })
    ]
  ],

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: '机场免费',
    outline: {
      level: [2, 3],
      label: '本页目录'
    },
    
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档与教程...',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '未找到相关结果',
                resetButtonTitle: '清除查询',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭'
                }
              }
            }
          }
        }
      }
    },

    nav: [
      { text: '首页', link: '/' },
      {
        text: '免费机场',
        items: [
          { text: '免费机场综合指南 (Pillar)', link: '/free-airport/' },
          { text: '免费 vs 付费机场深度对比', link: '/free-airport/free-vs-paid' },
          { text: '免费机场安全与风险科普', link: '/free-airport/security-risks' },
          { text: '机场选型 8 大指标指南', link: '/free-airport/how-to-choose' },
          { text: '2026 稳定新手机场推荐清单', link: '/free-airport/recommendations' },
          { text: '支持免费试用的机场精选', link: '/free-airport/trials' }
        ]
      },
      {
        text: '免费节点与订阅',
        items: [
          { text: '免费节点获取与使用总览', link: '/free-node/' },
          { text: 'Clash 免费节点配置', link: '/free-node/clash' },
          { text: 'v2rayN 免费节点测速与配置', link: '/free-node/v2rayn' },
          { text: 'Shadowrocket 小火箭免费节点', link: '/free-node/shadowrocket' },
          { text: '全球常用节点地区对比 (港/日/美/新)', link: '/free-node/regions' },
          { text: 'ChatGPT / AI 工具专用节点', link: '/free-node/ai-nodes' }
        ]
      },
      {
        text: '客户端教程',
        items: [
          { text: '全平台客户端安装总览', link: '/tutorial/' },
          { text: 'Clash Verge Rev 电脑端配置教程', link: '/tutorial/clash-verge-rev' },
          { text: 'Windows v2rayN 客户端实战', link: '/tutorial/v2rayn-windows' },
          { text: 'iOS Shadowrocket (小火箭) 教程', link: '/tutorial/shadowrocket-ios' },
          { text: 'sing-box 通用客户端配置教程', link: '/tutorial/sing-box' },
          { text: '订阅链接转换与格式详解', link: '/tutorial/sub-conversion' }
        ]
      },
      {
        text: '故障排查',
        items: [
          { text: '网络故障诊断中心总览', link: '/troubleshooting/' },
          { text: '国外网站打不开/连接超时排查', link: '/troubleshooting/overseas-sites-timeout' },
          { text: '节点全部超时/全红故障解决', link: '/troubleshooting/node-all-timeout' },
          { text: '订阅更新失败/导入错误排查', link: '/troubleshooting/sub-update-failed' },
          { text: '客户端已连接但无法上网解决', link: '/troubleshooting/connected-no-internet' },
          { text: 'ChatGPT / Claude 访问受限排查', link: '/troubleshooting/ai-access-issues' }
        ]
      },
      { text: '光速云实测', link: '/product/guangshuyun' },
      { text: '关于与合规', link: '/about/disclaimer' }
    ],

    sidebar: {
      '/free-airport/': [
        {
          text: '免费机场专题矩阵',
          items: [
            { text: '2026 免费机场综合评测指南 (Pillar)', link: '/free-airport/' },
            { text: '免费 vs 付费机场深度对比', link: '/free-airport/free-vs-paid' },
            { text: '免费机场安全吗？风险与隐私解析', link: '/free-airport/security-risks' },
            { text: '机场怎么选：8 大关键决策指标', link: '/free-airport/how-to-choose' },
            { text: '2026 稳定新手机场推荐与实测', link: '/free-airport/recommendations' },
            { text: '支持免费试用的机场精选指南', link: '/free-airport/trials' }
          ]
        },
        {
          text: '相关进阶指南',
          items: [
            { text: '全平台客户端安装教程', link: '/tutorial/' },
            { text: '节点全部超时故障排查', link: '/troubleshooting/node-all-timeout' },
            { text: '【光速云】套餐与实测详情', link: '/product/guangshuyun' }
          ]
        }
      ],
      '/free-node/': [
        {
          text: '免费节点与订阅中心',
          items: [
            { text: '免费节点与订阅源获取使用指南 (Pillar)', link: '/free-node/' },
            { text: 'Clash 免费节点获取与配置教程', link: '/free-node/clash' },
            { text: 'v2rayN 免费节点配置与测速指南', link: '/free-node/v2rayn' },
            { text: 'Shadowrocket 小火箭免费节点指南', link: '/free-node/shadowrocket' },
            { text: '香港/日本/新加坡/美国常用节点对比', link: '/free-node/regions' },
            { text: 'ChatGPT / Claude / AI 专用节点配置', link: '/free-node/ai-nodes' }
          ]
        },
        {
          text: '相关教程与排查',
          items: [
            { text: '订阅链接转换与格式解析', link: '/tutorial/sub-conversion' },
            { text: '订阅更新失败排查指南', link: '/troubleshooting/sub-update-failed' },
            { text: '稳定机场推荐与实测清单', link: '/free-airport/recommendations' }
          ]
        }
      ],
      '/tutorial/': [
        {
          text: '客户端实战教程库',
          items: [
            { text: '全平台代理客户端安装总览 (Pillar)', link: '/tutorial/' },
            { text: 'Clash Verge Rev 电脑端从零配置', link: '/tutorial/clash-verge-rev' },
            { text: 'Windows v2rayN 安装与核心配置', link: '/tutorial/v2rayn-windows' },
            { text: 'iOS Shadowrocket (小火箭) 完整配置', link: '/tutorial/shadowrocket-ios' },
            { text: 'sing-box 通用客户端配置教程', link: '/tutorial/sing-box' },
            { text: '订阅链接格式解析与转换指南', link: '/tutorial/sub-conversion' }
          ]
        },
        {
          text: '疑难问题承接',
          items: [
            { text: '已连接但无法上网故障修复', link: '/troubleshooting/connected-no-internet' },
            { text: '国外网站打不开诊断流程', link: '/troubleshooting/overseas-sites-timeout' },
            { text: '2026 稳定新手机场推荐', link: '/free-airport/recommendations' }
          ]
        }
      ],
      '/troubleshooting/': [
        {
          text: '网络故障诊断中心',
          items: [
            { text: '海外网络常见故障排查总览 (Pillar)', link: '/troubleshooting/' },
            { text: '国外网站打不开/连接超时排查', link: '/troubleshooting/overseas-sites-timeout' },
            { text: '节点全部超时/全红/TIMEOUT 排查', link: '/troubleshooting/node-all-timeout' },
            { text: '订阅更新失败/导入错误解决', link: '/troubleshooting/sub-update-failed' },
            { text: '客户端已连接但无网络修复', link: '/troubleshooting/connected-no-internet' },
            { text: 'ChatGPT / Claude 无法加载排查', link: '/troubleshooting/ai-access-issues' }
          ]
        },
        {
          text: '下一步指引',
          items: [
            { text: '免费 vs 付费机场稳定性对比', link: '/free-airport/free-vs-paid' },
            { text: '2026 稳定新手机场实测清单', link: '/free-airport/recommendations' },
            { text: '【光速云】套餐与网络规格', link: '/product/guangshuyun' }
          ]
        }
      ],
      '/product/': [
        {
          text: '推荐服务与实测',
          items: [
            { text: '【光速云】套餐详情与实测分析', link: '/product/guangshuyun' },
            { text: '2026 稳定新手机场推荐清单', link: '/free-airport/recommendations' },
            { text: '支持免费试用的机场精选', link: '/free-airport/trials' }
          ]
        }
      ],
      '/about/': [
        {
          text: '关于我们与合规披露',
          items: [
            { text: '免责声明与商业透明披露', link: '/about/disclaimer' },
            { text: '隐私政策与数据安全说明', link: '/about/privacy' }
          ]
        }
      ]
    },

    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short'
      }
    },

    footer: {
      message: '本站致力于网络技术与代理客户端使用科普，坚持事实核验与客观评测。部分推荐链接为自营/商业合作，均已透明披露。',
      copyright: 'Copyright © 2026 机场免费 jichangmianfei.my 保留所有权利。'
    }
  }
})
