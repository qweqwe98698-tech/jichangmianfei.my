# 🚀 机场免费 (jichangmianfei.my)

> **2026 免费机场与节点测速评测指南 · 全平台客户端教程 · 网络故障排查与高性价比专线深度评测**

[![VitePress](https://img.shields.io/badge/SSG-VitePress%201.6-0c87eb?logo=vitepress&logoColor=white)](https://vitepress.dev/)
[![SEO Ready](https://img.shields.io/badge/SEO-Clean%20URLs%20%7C%20Canonical%20%7C%20Schema.org-emerald?logo=google)](https://jichangmianfei.my)
[![Playwright E2E](https://img.shields.io/badge/Testing-Playwright%2011%2F11%20Passed-blueviolet?logo=playwright)](https://playwright.dev/)
[![IndexNow](https://img.shields.io/badge/IndexNow-Enabled-orange?logo=bing)](https://www.bing.com/indexnow)

---

## 📖 项目简介 (Overview)

`jichangmianfei.my` 是一个严格遵循 **E-E-A-T (专业度、经验、权威度与信任度)** 与 **反薄内容 (Anti-Thin Content)** 架构建立的现代化网络技术知识库与选型决策站。全站共收录 **51 篇纯静态预渲染深度图文** 与 **在线交互式流量测算工具**，覆盖从网络协议原理、客户端配置到晚高峰实测数据链的完整闭环。

---

## 🌟 核心特色与功能模块 (Core Modules)

| 专题分类 | 页面规模 | 核心覆盖内容与技术亮点 |
| :--- | :---: | :--- |
| **✈️ 免费机场选型中心** | 6 篇 | 免费 vs 付费深度对比、安全审计风险、选型 8 大指标、2026 稳定推荐榜单与免责声明 |
| **📚 网络知识百科 (Pillar)** | 9 篇 | SS/VMess/VLESS/Trojan/Hysteria2 协议深度横评、IEPL 专线架构、ChatGPT/Claude AI 网络指南 |
| **🌐 免费节点与订阅中心** | 6 篇 | Clash / v2rayN / Shadowrocket 免费订阅源配置、全球常用节点地区（港/日/美/新）延迟对比 |
| **📱 客户端实战教程库** | 11 篇 | Clash Verge Rev 规则集、Mihomo 内核与 TUN 模式、sing-box 进阶配置、iOS Loon/圈X、OpenClash 软路由 |
| **🔧 网络故障排查中心** | 11 篇 | 节点全部超时/全红决策树、已连接无网络修复、GitHub/Docker 镜像加速、Steam 101/105 错误 |
| **📊 在线实用工具箱** | 1 篇 | 机场流量消耗与月成本智能测算器 (`TrafficCalculator.vue`)，支持拖动滑块实时预估月度 GB 需求 |
| **⚡ 自营产品与实测大图** | 3 篇 | 【光速云 (Guangshu Cloud)】9Gbps 满载单线程测速、70 节点全流媒体解锁与 8 折优惠码 `AMM` |

---

## 🛠️ 技术栈与工程架构 (Tech Stack)

- **核心框架**：[VitePress 1.6](https://vitepress.dev/) + [Vue 3](https://vuejs.org/) (SSR 静态预渲染，禁用 JS 依然 100% 爬虫可读)
- **样式与组件**：[Tailwind CSS](https://tailwindcss.com/) + PostCSS + 现代化定制微交互组件
- **自动化测试**：[Playwright](https://playwright.dev/) E2E 自动化测试套件 (包含桌面端与移动端响应式视口测试)
- **SEO 安全门禁**：Node.js 自研 `scripts/seo-check.mjs` (每次构建自动检测 Canonical、Noindex、死链与 Schema JSON 语法)
- **搜索引擎即时推送**：[IndexNow](https://www.bing.com/indexnow) 自动推送引擎 (`scripts/indexnow-ping.mjs`)
- **服务器配置**：Apache 生产级 `.htaccess` (强制 HTTPS 301、统一 non-www、Clean URLs 伪静态、Gzip/Brotli 压缩、1 年静态长效缓存)

---

## 🚀 本地开发与构建指令 (Getting Started)

### 1. 安装依赖
```bash
npm install
```

### 2. 启动本地实时开发热重载
```bash
npm run dev
```
访问本地开发服务器：`http://localhost:5173/`

### 3. 全量构建与 SEO 门禁检测
```bash
npm run build
```
> 执行该命令将完成 **VitePress 静态预渲染** 并自动触发 **SEO Health Check 门禁扫描**。

### 4. 运行 E2E 自动化测试
```bash
npm run test:e2e
```

### 5. 向 IndexNow 推送最新 URL
```bash
npm run indexnow
```

---

## 🛡️ SEO 发布安全门禁标准 (SEO Health Check)

项目集成了强制性的发布安全门禁，确保每次部署 0 掉索引风险：

```text
==============================================================================
                           SEO HEALTH CHECK REPORT                            
==============================================================================
Build:            ✅ PASS (纯静态 HTML 预渲染)
Robots:           ✅ PASS (Allow: / 且声明 Sitemap)
Noindex:          ✅ PASS (正式内容页 0 个 noindex 泄漏)
Canonical:        ✅ PASS (50 个页面 100% 绝对标准 URL 匹配)
Sitemap:          ✅ PASS (50 条清洗后的 Clean URLs)
Internal Links:   ✅ PASS (0 条内部死链，点击深度 ≤ 3)
Core URLs:        ✅ PASS (所有核心落地页均为 200 静态渲染)
Schema:           ✅ PASS (JSON-LD 语法 100% 有效)
Duplicate Titles: ✅ PASS (0 关键词自相残杀与标题堆砌)
Page Count:       ✅ PASS (51 篇静态 HTML)
------------------------------------------------------------------------------
RELEASE_DECISION: 🟢 READY (允许安全发布)
==============================================================================
```

---

## 📄 商业透明披露与版权 (License & Disclosure)

- 本站所有评测坚持客观真实原则，测速环境与参数均公开核验；自营品牌与商业合作链接均已在文章顶部与页脚进行显式透明披露。
- Copyright © 2026 **机场免费 (jichangmianfei.my)** 保留所有权利。
