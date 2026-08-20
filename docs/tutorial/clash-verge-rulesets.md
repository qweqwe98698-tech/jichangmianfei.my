---
title: Clash Verge Rev 进阶分流规则集（ACL4SSR / Loyalsoldier）自定义配置全指南 (2026 最新)
description: 2026年最新深度详解 Clash Verge Rev 客户端如何配置 ACL4SSR 极简/全能规则集、Loyalsoldier 规则、合并本地扩展配置 (Merge Script) 与国内外智能分流防漏油方案。
head:
  - - script
    - type: application/ld+json
    - |
      {
        "@context": "https://schema.org",
        "@type": "TechArticle",
        "headline": "Clash Verge Rev 进阶分流规则集（ACL4SSR / Loyalsoldier）自定义配置全指南",
        "description": "系统剖析 Clash Verge Rev 客户端高级分流规则配置、脚本合并与智能路由策略",
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

# Clash Verge Rev 进阶分流规则集（ACL4SSR / Loyalsoldier）自定义配置全指南 (2026 最新)

<QuickAnswer>
<strong>核心配置要诀：</strong>Clash 默认配置往往只有简单的国内直连与海外代理两条粗暴规则。<strong>进阶优化方案：通过 Clash Verge Rev 的【扩展配置 (Merge / Script)】注入 ACL4SSR 规则集</strong>，实现 <strong>① OpenAI/Claude 强指定向到美日专线；② 国内流媒体（B站/爱奇艺/网易云）本地直连防封IP；③ 自动拦截 99% 网页弹窗与追踪广告</strong>。
</QuickAnswer>

## 一、主流 Clash 分流规则集横向对比矩阵

<ComparisonTable
  :headers="['规则集名称', '规则条数与体积', '去广告能力', 'AI/流媒体精细化分流', '规则维护频率', '最适合人群']"
  :rows="[
    ['ACL4SSR_Online_Mini (推荐)', '约 2,000 条 (轻量极速)', '基础拦截 (不误杀)', '★★★★★ (AI/流媒体分类清晰)', '每周自动同步更新', '新手及注重系统流畅、低内存占用的主力用户'],
    ['ACL4SSR_Online_Full', '约 8,000+ 条 (全能大包)', '强力去广告与反追踪', '★★★★★ (超细粒度分类)', '每周自动同步更新', '多策略组重度玩家、影视与多地区分流爱好者'],
    ['Loyalsoldier 规则集', '约 3,500 条 (标准模块化)', '适中', '★★★★☆ (GEOIP/GEOSITE规范)', '每日持续滚动维护', '极客开发者、喜欢自行组装 YAML 规则链者']
  ]"
/>

---

## 二、通过 Clash Verge Rev 扩展配置（Merge）一键注入规则

在 Clash Verge Rev 中，**绝对不要直接修改订阅下载下来的原始 yaml 文件**（因为一旦下次更新订阅，您的修改会被全部覆盖！）。正确的做法是利用软件内置的 **扩展配置（Merge / Script）** 功能：

### 步骤 1：打开订阅扩展配置
1. 打开 Clash Verge Rev 客户端，点击左侧【订阅 (Profiles)】；
2. 找到您导入的光速云订阅卡片，鼠标右键点击并选择 **【编辑扩展配置 (Edit Merge)】**。

### 步骤 2：粘贴标准分流增强代码
在弹出的编辑器中粘贴以下经过严格测试的高效分流脚本：

```yaml
# Clash Verge Rev 增强分流规则合并模板
prepend-rules:
  # 1. 本地局域网与常用私有地址直连
  - DOMAIN-SUFFIX,local,DIRECT
  - IP-CIDR,127.0.0.0/8,DIRECT
  - IP-CIDR,192.168.0.0/16,DIRECT
  - IP-CIDR,10.0.0.0/8,DIRECT

  # 2. 热门 AI 大模型强制走美区/新加坡专线 (防止香港节点误阻断)
  - DOMAIN-SUFFIX,openai.com,AI-Proxy
  - DOMAIN-SUFFIX,chatgpt.com,AI-Proxy
  - DOMAIN-SUFFIX,claude.ai,AI-Proxy
  - DOMAIN-SUFFIX,anthropic.com,AI-Proxy
  - DOMAIN-SUFFIX,gemini.google.com,AI-Proxy

  # 3. 海外流媒体定向分流
  - DOMAIN-SUFFIX,netflix.com,Streaming-Proxy
  - DOMAIN-SUFFIX,disneyplus.com,Streaming-Proxy
  - DOMAIN-SUFFIX,youtube.com,Streaming-Proxy

  # 4. 国内应用无条件直连 (节省专线流量，零延迟)
  - DOMAIN-SUFFIX,bilibili.com,DIRECT
  - DOMAIN-SUFFIX,taobao.com,DIRECT
  - DOMAIN-SUFFIX,jd.com,DIRECT
  - DOMAIN-SUFFIX,qq.com,DIRECT
  - GEOIP,CN,DIRECT
  - MATCH,Final-Proxy
```

---

## 三、策略组（Proxy Groups）最佳协同实践

为了配合上述分流规则，您可以在客户端策略组中为不同场景分配最适合的节点：

```text
┌─────────────────────────────────────────────────────────────┐
│                 【高效策略组分工架构】                       │
├──────────────────────────────┬──────────────────────────────┤
│ 1. 🤖 AI-Proxy (人工智能)    ──> 选【美国 01】或【新加坡 01】专线│
│ 2. 🎬 Streaming-Proxy (影视) ──> 选【新加坡 01】或【香港 01】专线│
│ 3. ⚡ Final-Proxy (兜底海外) ──> 选【自动选择 (Fallback/URL-Test)】│
│ 4. 🇨🇳 国内流量               ──> 自动直连 (DIRECT, 0 流量消耗) │
└─────────────────────────────────────────────────────────────┘
```

---

## 四、常见分流失效问题排错 (FAQ)

<TroubleshootingBox title="分流排错 3 步速查">
<ol>
  <li><strong>国内网站（如百度、淘宝）突然变慢或打不开</strong>
    <p>原因：规则集中的 <code>GEOIP,CN,DIRECT</code> 被放在了底部或未生效。解决：检查扩展配置，确保 <code>GEOIP,CN,DIRECT</code> 排在 <code>MATCH</code> 之前。</p>
  </li>
  <li><strong>ChatGPT 报错无法连接或提示所在地区不受支持</strong>
    <p>原因：AI 流量误走到了香港节点。解决：在 Clash Verge Rev 的策略组面板中，找到【AI-Proxy】分组，手动将其绑定至【美国 01】或【日本 01】专线节点。</p>
  </li>
  <li><strong>更新订阅后自定义规则丢失</strong>
    <p>原因：直接编辑了主配置文件。解决：务必使用【编辑扩展配置 (Edit Merge)】，Merge 规则会在每次订阅更新后自动叠加上去，永不丢失。</p>
  </li>
</ol>
</TroubleshootingBox>

---

## 五、下一步探索

<TopicBridge
  title="深入了解 Mihomo (Clash.Meta) 内核与 TUN 模式"
  targetLink="/tutorial/mihomo-meta-core"
  targetText="前往《Mihomo 内核深度指南：TUN 模式与 DNS》"
>
  掌握了规则分流后，如何开启 TUN 虚拟网卡实现对全系统无代理软件的无缝接管？
</TopicBridge>

<BrandCard
  brandName="光速云 (Guangshu Cloud)"
  description="2020年起稳定运营的 IEPL 专线服务商。全面兼容 Clash Verge Rev 高级规则集，支持 VLESS 协议与自研客户端，新用户结算输入优惠码 AMM 享 8 折特惠。"
  affLink="https://sahude.gsyvipaff.com/#/?code=keqgvT5Y"
/>
