import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '机场免费',
  titleTemplate: ':title - 机场免费 jichangmianfei.my',
  description: '机场免费（jichangmianfei.my）专注提供2026最新免费机场推荐、免费节点订阅源、Clash/v2rayN/小火箭实战配置教程、网络连接超时排查与高性价比机场深度评测。',
  lang: 'zh-CN',
  base: '/',
  cleanUrls: true,
  lastUpdated: true,

  vite: {
    publicDir: 'public'
  },

  transformPageData(pageData) {
    const cleanPath = pageData.relativePath
      .replace(/index\.md$/, '')
      .replace(/\.md$/, '')
    const canonicalUrl = `https://jichangmianfei.my/${cleanPath}`
    
    pageData.frontmatter.head ??= []
    pageData.frontmatter.head.push([
      'link',
      { rel: 'canonical', href: canonicalUrl }
    ])

    // 为非首页页面自动注入 Schema.org BreadcrumbList 结构化数据
    if (cleanPath !== '') {
      const categoryNames: Record<string, string> = {
        'free-airport': '免费机场',
        'free-node': '免费节点与订阅',
        'tutorial': '客户端教程',
        'troubleshooting': '故障排查',
        'knowledge': '知识百科',
        'tools': '实用工具',
        'product': '服务推荐',
        'about': '关于我们'
      }

      const segments = cleanPath.split('/').filter(Boolean)
      const breadcrumbItems: any[] = [
        {
          '@type': 'ListItem',
          position: 1,
          name: '首页',
          item: 'https://jichangmianfei.my/'
        }
      ]

      if (segments.length === 1 && cleanPath.endsWith('/')) {
        // 分类首页 (Pillar 页)
        const cat = segments[0]
        breadcrumbItems.push({
          '@type': 'ListItem',
          position: 2,
          name: categoryNames[cat] || cat,
          item: `https://jichangmianfei.my/${cat}/`
        })
      } else if (segments.length >= 1) {
        const cat = segments[0]
        breadcrumbItems.push({
          '@type': 'ListItem',
          position: 2,
          name: categoryNames[cat] || cat,
          item: `https://jichangmianfei.my/${cat}/`
        })
        breadcrumbItems.push({
          '@type': 'ListItem',
          position: 3,
          name: pageData.title || segments[segments.length - 1],
          item: canonicalUrl
        })
      }

      pageData.frontmatter.head.push([
        'script',
        { type: 'application/ld+json' },
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbItems
        })
      ])
    }
  },
  
  sitemap: {
    hostname: 'https://jichangmianfei.my'
  },

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
    ['meta', { name: 'keywords', content: '免费机场,免费节点,免费订阅,免费机场试用,国外节点,Clash免费节点,Clash配置文件,Clash Verge免费节点,小火箭免费节点,v2rayN节点,机场推荐,机场评测,光速云,OpenClash,Mihomo,sing-box' }],
    ['meta', { name: 'author', content: '机场免费团队' }],
    ['meta', { property: 'og:site_name', content: '机场免费' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }],
    ['meta', { property: 'og:image', content: 'https://jichangmianfei.my/logo.svg' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:image', content: 'https://jichangmianfei.my/logo.svg' }],
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
          { text: '免费机场试用精选与避坑指南', link: '/free-airport/trials' }
        ]
      },
      {
        text: '知识百科',
        items: [
          { text: '知识百科与选型决策总览 (Pillar)', link: '/knowledge/' },
          { text: 'VPN、代理、加速器与机场的区别', link: '/knowledge/vpn-proxy-accelerator-diff' },
          { text: 'SS/VMess/VLESS/Trojan/Hysteria2 协议横评', link: '/knowledge/protocols-explained' },
          { text: 'IEPL/IPLC 专线与公网中转解析', link: '/knowledge/iepl-vs-relay-lines' },
          { text: '海外 AI 大模型全景网络访问指南', link: '/knowledge/ai-models-network-guide' },
          { text: '海外流媒体全解锁配置指南', link: '/knowledge/streaming-unlock-guide' },
          { text: '外贸跨境电商防关联网络方案', link: '/knowledge/cross-border-ecommerce' },
          { text: '流量倍率与计费重置避坑指南', link: '/knowledge/multiplier-and-billing' },
          { text: '全球节点地区选型全景图', link: '/knowledge/global-nodes-selection' }
        ]
      },
      {
        text: '免费节点与订阅',
        items: [
          { text: '免费节点获取与使用总览 (Pillar)', link: '/free-node/' },
          { text: 'Clash 免费节点与免配置 YAML 模板', link: '/free-node/clash' },
          { text: 'v2rayN 免费节点与真连接测速', link: '/free-node/v2rayn' },
          { text: 'Shadowrocket 小火箭免费节点', link: '/free-node/shadowrocket' },
          { text: '国外节点怎么选与地区延迟对比', link: '/free-node/regions' },
          { text: 'ChatGPT / AI 工具专用节点', link: '/free-node/ai-nodes' }
        ]
      },
      {
        text: '客户端教程',
        items: [
          { text: '全平台客户端安装总览 (Pillar)', link: '/tutorial/' },
          { text: 'Clash Verge Rev 电脑端配置与免费订阅', link: '/tutorial/clash-verge-rev' },
          { text: 'Clash 进阶分流规则集 (ACL4SSR)', link: '/tutorial/clash-verge-rulesets' },
          { text: 'Mihomo 内核与 TUN 模式指南', link: '/tutorial/mihomo-meta-core' },
          { text: 'sing-box 进阶配置与 Hysteria 2', link: '/tutorial/sing-box-advanced' },
          { text: 'iOS Loon 与 Quantumult X 实战', link: '/tutorial/ios-loon-quanx' },
          { text: 'Android 客户端双雄 (CMFA/v2rayNG)', link: '/tutorial/android-cmfa-v2rayng' },
          { text: 'OpenClash 软路由全屋加速配置', link: '/tutorial/openclash-router' },
          { text: 'Windows v2rayN 客户端实战', link: '/tutorial/v2rayn-windows' },
          { text: 'iOS Shadowrocket (小火箭) 添加节点教程', link: '/tutorial/shadowrocket-ios' },
          { text: '订阅链接转换与格式详解', link: '/tutorial/sub-conversion' }
        ]
      },
      {
        text: '故障排查',
        items: [
          { text: '网络代理故障排查急救中心 (Pillar)', link: '/troubleshooting/' },
          { text: '节点全部超时/全红故障排查', link: '/troubleshooting/node-all-timeout' },
          { text: '客户端已连接但无法上网解决', link: '/troubleshooting/connected-no-internet' },
          { text: '代理关闭后断网 (ERR_PROXY) 修复', link: '/troubleshooting/err-proxy-connection-failed' },
          { text: '订阅更新失败/导入错误排查', link: '/troubleshooting/sub-update-failed' },
          { text: 'ChatGPT / Claude 访问受限排查', link: '/troubleshooting/ai-access-issues' },
          { text: 'GitHub 打不开/克隆极慢排查', link: '/troubleshooting/github-speedup' },
          { text: 'Docker Hub 镜像拉取超时修复', link: '/troubleshooting/docker-hub-pull-failed' },
          { text: '全语言包管理器代理 (npm/pip/brew)', link: '/troubleshooting/dev-package-managers' },
          { text: 'Steam 101/105 错误排查与联机', link: '/troubleshooting/steam-101-105-error' },
          { text: 'DNS 泄漏深度检测与 DoH 配置', link: '/troubleshooting/dns-leak-test' },
          { text: '国外网站打不开/连接超时排查', link: '/troubleshooting/overseas-sites-timeout' }
        ]
      },
      { text: '流量测算器', link: '/tools/traffic-calculator' },
      {
        text: '品牌实测',
        items: [
          { text: '42 家机场全景评测大榜单', link: '/free-airport/recommendations' },
          { text: '【第一主推】光速云 (9Gbps 专线)', link: '/product/guangshuyun' },
          { text: '【Top2】暮光加速 (509M 实测)', link: '/product/muguang' },
          { text: '【Top3】飞猫云 (380M 实测)', link: '/product/feimao' },
          { text: '【Top4】微风网络 (420M 实测)', link: '/product/weifeng' },
          { text: '【Top6】星岛梦 (450M 实测)', link: '/product/xingdaomeng' },
          { text: '【Top7】二猫云 (410M 实测)', link: '/product/ermao' },
          { text: '【Top8】无忧链接 (480M 实测)', link: '/product/wuyou' },
          { text: '【Top9】唯兔云 (390M 实测)', link: '/product/weitu' },
          { text: '极连云 (510M 实测)', link: '/product/jilian' },
          { text: 'SOGO云 (530M 实测)', link: '/product/sogo' }
        ]
      }
    ],

    sidebar: {
      '/free-airport/': [
        {
          text: '免费机场专题矩阵',
          items: [
            { text: '2026 机场选型与性能评测终极指南：晚高峰压测', link: '/free-airport/airport-performance-benchmark-framework' },
            { text: '2026 免费机场与代理综合评测 (Pillar)', link: '/free-airport/' },
            { text: '免费 vs 付费机场深度对比', link: '/free-airport/free-vs-paid' },
            { text: '免费机场安全吗？风险与隐私解析', link: '/free-airport/security-risks' },
            { text: '机场怎么选：8 大关键决策指标', link: '/free-airport/how-to-choose' },
            { text: '2026 免费与稳定新手机场推荐清单', link: '/free-airport/recommendations' },
            { text: '免费机场试用精选与避坑指南', link: '/free-airport/trials' }
          ]
        },
        {
          text: '相关进阶指南',
          items: [
            { text: 'VPN、代理、加速器与机场区别', link: '/knowledge/vpn-proxy-accelerator-diff' },
            { text: '全平台客户端安装教程', link: '/tutorial/' },
            { text: '【光速云】套餐与实测详情', link: '/product/guangshuyun' }
          ]
        }
      ],
      '/knowledge/': [
        {
          text: '网络知识百科与选型决策',
          items: [
            { text: '2026 跨境业务与 AI 工作流原生干净 IP', link: '/knowledge/overseas-clean-ip-matrix' },
            { text: 'Hysteria 2 与 TUIC 协议弱网抗丢', link: '/knowledge/hysteria-tuic-udp-qos' },
            { text: 'VLESS-Reality 与 Vision 流', link: '/knowledge/vless-reality-vision-mechanisms' },
            { text: 'IPLC 与 IEPL 国际专线深度架构横评：底', link: '/knowledge/iplc-iepl-transit-benchmark' },
            { text: '知识百科与选型决策总览 (Pillar)', link: '/knowledge/' },
            { text: 'VPN、代理、加速器与机场区别', link: '/knowledge/vpn-proxy-accelerator-diff' },
            { text: 'SS/VMess/VLESS/Trojan/Hysteria2 协议横评', link: '/knowledge/protocols-explained' },
            { text: 'IEPL/IPLC 专线与公网中转解析', link: '/knowledge/iepl-vs-relay-lines' },
            { text: '海外 AI 大模型网络访问指南', link: '/knowledge/ai-models-network-guide' },
            { text: '海外流媒体全解锁配置指南', link: '/knowledge/streaming-unlock-guide' },
            { text: '外贸跨境电商网络方案', link: '/knowledge/cross-border-ecommerce' },
            { text: '流量倍率与计费重置避坑', link: '/knowledge/multiplier-and-billing' },
            { text: '全球代理节点地区选型全景图', link: '/knowledge/global-nodes-selection' }
          ]
        },
        {
          text: '落地与实战',
          items: [
            { text: '流量消耗与月成本智能测算器', link: '/tools/traffic-calculator' },
            { text: '2026 稳定新手机场推荐清单', link: '/free-airport/recommendations' },
            { text: '全平台客户端配置实战', link: '/tutorial/' },
            { text: '网络故障诊断中心', link: '/troubleshooting/' }
          ]
        }
      ],
      '/free-node/': [
        {
          text: '免费节点与订阅中心',
          items: [
            { text: '开源免费节点与公共订阅安全审计：中间人监听风险、', link: '/free-node/public-free-nodes-security' },
            { text: '免费节点与订阅源获取使用指南 (Pillar)', link: '/free-node/' },
            { text: 'Clash 免费节点与免配置 YAML 模板', link: '/free-node/clash' },
            { text: 'v2rayN 免费节点与真连接测速指南', link: '/free-node/v2rayn' },
            { text: '小火箭免费节点获取与配置教程', link: '/free-node/shadowrocket' },
            { text: '国外节点怎么选与地区延迟对比', link: '/free-node/regions' },
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
            { text: '软路由 OpenWrt 全屋千兆无感科学上网实战', link: '/tutorial/openwrt-router-full-home' },
            { text: 'sing-box 客户端全平台终极配置实战：现代', link: '/tutorial/sing-box-full-configuration' },
            { text: '全平台代理客户端安装总览 (Pillar)', link: '/tutorial/' },
            { text: 'Clash Verge Rev 电脑端从零配置与免费订阅', link: '/tutorial/clash-verge-rev' },
            { text: 'Clash 进阶分流规则集 (ACL4SSR)', link: '/tutorial/clash-verge-rulesets' },
            { text: 'Mihomo 内核与 TUN 模式深度指南', link: '/tutorial/mihomo-meta-core' },
            { text: 'sing-box 进阶配置与 Hysteria 2 调优', link: '/tutorial/sing-box-advanced' },
            { text: 'iOS Loon 与 Quantumult X 实战指南', link: '/tutorial/ios-loon-quanx' },
            { text: 'Android 客户端双雄 (CMFA/v2rayNG)', link: '/tutorial/android-cmfa-v2rayng' },
            { text: 'OpenClash 软路由全屋加速配置', link: '/tutorial/openclash-router' },
            { text: 'Windows v2rayN 安装与核心配置', link: '/tutorial/v2rayn-windows' },
            { text: 'iOS Shadowrocket (小火箭) 添加节点实战', link: '/tutorial/shadowrocket-ios' },
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
            { text: 'TUN 虚拟网卡驱动冲突与代理关闭后电脑断网故障', link: '/troubleshooting/tun-mode-adapter-conflict' },
            { text: 'DNS 泄漏与 WebRTC 真实 IP 暴露全', link: '/troubleshooting/dns-leak-webrtc-ip' },
            { text: '网络代理故障排查急救中心 (Pillar)', link: '/troubleshooting/' },
            { text: 'GitHub 打不开/克隆极慢终极解决', link: '/troubleshooting/github-speedup' },
            { text: 'Docker Hub 镜像拉取超时修复', link: '/troubleshooting/docker-hub-pull-failed' },
            { text: '全语言包管理器代理 (npm/pip/brew)', link: '/troubleshooting/dev-package-managers' },
            { text: 'Steam 101/105 错误排查与联机', link: '/troubleshooting/steam-101-105-error' },
            { text: 'DNS 泄漏深度检测与 DoH 配置', link: '/troubleshooting/dns-leak-test' },
            { text: '代理关闭后断网 (ERR_PROXY) 修复', link: '/troubleshooting/err-proxy-connection-failed' },
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
      '/tools/': [
        {
          text: '网络实用工具箱',
          items: [
            { text: '机场流量消耗与月成本智能测算器', link: '/tools/traffic-calculator' }
          ]
        },
        {
          text: '核心推荐',
          items: [
            { text: '2026 稳定新手机场推荐清单', link: '/free-airport/recommendations' },
            { text: '【光速云】真实评测与测速长图', link: '/product/guangshuyun' }
          ]
        }
      ],
      '/product/': [
        {
          text: 'Top 核心主推与优选实测',
          items: [
            { text: '【第一主推】光速云 (9Gbps 专线实测)', link: '/product/guangshuyun' },
            { text: '暮光加速 (509 Mbps 真实测速)', link: '/product/muguang' },
            { text: '飞猫云 (380 Mbps 专线实测)', link: '/product/feimao' },
            { text: '微风网络 (420 Mbps 低延迟实测)', link: '/product/weifeng' },
            { text: '星岛梦 (450 Mbps 多协议实测)', link: '/product/xingdaomeng' },
            { text: '二猫云 (410 Mbps 平价实测)', link: '/product/ermao' },
            { text: '无忧链接 (480 Mbps 专线实测)', link: '/product/wuyou' },
            { text: '唯兔云 (390 Mbps 流媒体实测)', link: '/product/weitu' }
          ]
        },
        {
          text: '性价比与进阶品牌实测',
          items: [
            { text: '宇宙云 (360 Mbps 实测)', link: '/product/yuzhou' },
            { text: 'U1S1 (430 Mbps 实测)', link: '/product/u1s1' },
            { text: '灵猫网络 (470 Mbps 实测)', link: '/product/lingmao' },
            { text: '极连云 (510 Mbps 实测)', link: '/product/jilian' },
            { text: '光年梯 (460 Mbps 实测)', link: '/product/guangnian' },
            { text: '一翻云 (390 Mbps 实测)', link: '/product/yifan' },
            { text: 'SOGO云 (530 Mbps 实测)', link: '/product/sogo' },
            { text: '可信云 (440 Mbps 实测)', link: '/product/kexin' },
            { text: '速界 (480 Mbps 实测)', link: '/product/sujie' },
            { text: '全球云 (420 Mbps 实测)', link: '/product/quanqiu' }
          ]
        },
        {
          text: '综合榜单与选型指引',
          items: [
            { text: '2026 42 家机场品牌全景评测大榜单', link: '/free-airport/recommendations' },
            { text: '免费机场试用精选与避坑指南', link: '/free-airport/trials' },
            { text: '免费 vs 付费机场深度对比', link: '/free-airport/free-vs-paid' }
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
