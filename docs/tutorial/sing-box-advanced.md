---
title: sing-box 进阶配置：Outbounds 出站规则编写、独立 DNS 与 Hysteria 2 极速调优 (2026 最新)
description: 2026年最新深度解析通用代理新星 sing-box 客户端架构，详解 JSON 配置结构、Inbounds/Outbounds 规则编写、独立 DNS 路由解析与 Hysteria 2 暴力拥塞控制调优。
head:
  - - script
    - type: application/ld+json
    - |
      {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": "sing-box 进阶配置：Outbounds 出站规则编写、独立 DNS 与 Hysteria 2 极速调优",
        "description": "全面剖析 sing-box 客户端架构、JSON 配置规则与高性能调优",
        "author": {
          "@type": "Organization",
          "name": "机场免费团队"
        },
        "publisher": {
          "@type": "Organization",
          "name": "机场免费",
          "logo": "https://jichangmianfei.my/logo.svg"
        },
        "datePublished": "2026-03-20",
        "dateModified": "2026-08-20"
      }
---

# sing-box 进阶配置：Outbounds 出站规则编写、独立 DNS 与 Hysteria 2 极速调优 (2026 最新)

<QuickAnswer>
<strong>核心架构解析：</strong><strong>sing-box</strong> 是由 SagerNet 团队采用 Go 语言从零开发的通用代理通用平台（支持 Windows、macOS、Linux、iOS 与 Android）。其最大特点是<strong>“高度模块化的 JSON 规则、极低的内存与 CPU 占用、以及对 VLESS-Reality、ShadowTLS、Hysteria 2 与 TUIC 协议的超原生支持”</strong>。
</QuickAnswer>

## 一、sing-box 与 Clash 架构对比横评

<ComparisonTable
  :headers="['对比指标', 'sing-box', 'Clash (Mihomo)', '核心差异与选型建议']"
  :rows="[
    ['配置文件格式', 'JSON 格式 (规范严格、逻辑清晰)', 'YAML 格式 (缩进敏感)', 'sing-box 规则语法更接近底层网络协议栈'],
    ['协议支持速度', '第一梯队 (官方原生即时跟进最新协议)', '极其迅速 (社区活跃)', '两者对 VLESS 与 Hysteria 2 均支持完美'],
    ['内存与资源消耗', '极低 (约 15MB ~ 30MB 常驻内存)', '较低 (约 30MB ~ 60MB)', 'sing-box 在低功耗嵌入式设备与老旧手机上表现更优'],
    ['跨平台一致性', '100% 统一配置内核', '不同平台 GUI 客户端实现略有差异', '同一份 config.json 可在 Mac/Win/iOS 直接通用'],
    ['图形界面上手度', '中等 (官方客户端偏极客)', '极高 (Clash Verge Rev 界面极友好)', '新手推荐 Clash Verge，进阶极客推荐 sing-box']
  ]"
/>

---

## 二、sing-box 标准 JSON 核心配置结构拆解

sing-box 的核心配置文件主要由四大模块组成：

```json
{
  "log": { "level": "info", "timestamp": true },
  "dns": { /* 独立 DNS 解析与防污染路由 */ },
  "inbounds": [ /* 本地流量接收入口 (TUN / SOCKS5 / Mixed) */ ],
  "outbounds": [ /* 节点集群与出口策略组 (Proxy / Direct / Block) */ ],
  "route": { /* 分流规则集与域名匹配 (Rule-set) */ }
}
```

### 标准极速 TUN 模式 Inbound 示例：
```json
{
  "type": "tun",
  "tag": "tun-in",
  "interface_name": "singbox-tun",
  "inet4_address": "172.19.0.1/30",
  "auto_route": true,
  "strict_route": true,
  "stack": "mixed",
  "sniff": true
}
```

---

## 三、Hysteria 2 协议在 sing-box 中的调优要诀

如果您在使用 Hysteria 2 协议节点，可以在 `outbounds` 中通过以下参数大幅降低弱网丢包时的重传开销：

```json
{
  "type": "hysteria2",
  "tag": "hy2-node-01",
  "server": "example.guangshuyun.com",
  "server_port": 443,
  "up_mbps": 100,
  "down_mbps": 500,
  "password": "your-secret-password",
  "tls": {
    "enabled": true,
    "server_name": "example.guangshuyun.com",
    "insecure": false
  }
}
```

---

## 四、常见问题解答 (FAQ)

<FaqAccordion :items="[
  {
    q: '光速云支持直接导出 sing-box 格式的订阅吗？',
    a: '支持！在光速云用户中心【一键导入】列表中，选择【sing-box】即可复制原生 JSON 订阅链接或一键唤起客户端。'
  },
  {
    q: 'sing-box 提示“decode error: invalid json”怎么排查？',
    a: '这是因为手动编辑 JSON 文件时漏掉了逗号或括号未闭合。建议将配置文件粘贴到 JSONLint 在线校验工具中快速定位语法错误。'
  }
]" />

---

## 五、下一步探索

<TopicBridge
  title="了解 iOS 端 Loon 与 Quantumult X 进阶技巧"
  targetLink="/tutorial/ios-loon-quanx"
  targetText="前往《iOS 客户端进阶：Loon 与 Quantumult X 教程》"
>
  探索苹果生态下支持丰富脚本与 MitM 重写的高级客户端配置。
</TopicBridge>

<BrandCard
  brandName="光速云 (Guangshu Cloud)"
  description="2020年起稳定运营的 IEPL 专线服务商。全面支持 sing-box 原生订阅导入，标配 VLESS 协议与企业级专线，新用户结账输入优惠码 AMM 享 8 折特惠。"
  affLink="https://sahude.gsyvipaff.com/#/?code=keqgvT5Y"
/>
