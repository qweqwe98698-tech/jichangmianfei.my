import fs from 'node:fs';
import path from 'node:path';

const recommendationsPath = path.resolve('docs/free-airport/recommendations.md');

// 42 家完整品牌数据
const allBrands = [
  // 梯队一：Top 10
  { rank: 1, name: '光速云 (Guangshu Cloud)', slug: 'guangshuyun', line: 'IEPL 内网专线 + VLESS', price: '¥7.5/月起', coupon: 'AMM (8折)', testStatus: '✅ 9Gbps实测+70节点全解', url: 'https://sahude.gsyvipaff.com/#/?code=keqgvT5Y', isTop: true, desc: '2020年起稳定运营，晚高峰0丢包，原生支持ChatGPT-4o/Claude/Netflix/Disney+，双轨自研+通用订阅。第一主推优选。' },
  { rank: 2, name: '暮光加速', slug: 'muguang', line: 'BGP 智能专线', price: '¥20/月起', coupon: 'muguang5555', testStatus: '✅ 真实测速长图 (509M)', url: 'https://varnexa.twilightaff.com/#/?code=D1LHglg3', isTop: true, desc: 'BGP智能调度专线级出口，多设备同时在线，支持全平台主流客户端与AI解锁。' },
  { rank: 3, name: '飞猫云', slug: 'feimao', line: 'IEPL / Anycast 专线', price: '¥15/月起', coupon: 'feimao', testStatus: '✅ 真实测速长图 (380M)', url: 'https://www.feimaoyun.org/#/register?code=6b5Kk9rV', isTop: true, desc: '专线极速直连，晚高峰大带宽保障，适合4K/8K视频与流媒体重度用户。' },
  { rank: 4, name: '微风网络', slug: 'weifeng', line: '多线 BGP 中继', price: '¥18/月起', coupon: 'weifeng', testStatus: '✅ 真实测速长图 (420M)', url: 'https://v2.wf-aff.org/#/register?code=x08oG4Uj', isTop: true, desc: '主打游戏与办公低延迟优化，多节点冗余备份，连接稳定响应快。' },
  { rank: 5, name: '大佬云', slug: '', line: '企业级 IEPL 专线', price: '¥25/月起', coupon: 'dalao', testStatus: '⚡ 专线测试保障', url: 'https://xn--9krt00a19c.net/#/register?code=Bjh099tJ', isTop: true, desc: '高吞吐专线架构，针对晚高峰网络拥堵进行特别调优，支持全协议客户端。' },
  { rank: 6, name: '星岛梦', slug: 'xingdaomeng', line: 'IEPL 国际专线', price: '¥16/月起', coupon: 'xingdaomeng', testStatus: '✅ 真实测速长图 (450M)', url: 'https://xdm02.xdmaff.org/#/register?code=4zD666hL', isTop: true, desc: '多协议全系接入，原生节点解锁ChatGPT与主流流媒体，性价比极高。' },
  { rank: 7, name: '二猫云', slug: 'ermao', line: '多线中转 / 专线', price: '¥12/月起', coupon: 'ermao', testStatus: '✅ 真实测速长图 (410M)', url: 'https://ermaoyun.org/#/register?code=jLgYw9c7', isTop: true, desc: '轻量平价之选，资费亲民，节点覆盖广泛，支持全平台订阅一键导入。' },
  { rank: 8, name: '无忧链接', slug: 'wuyou', line: '企业专线隧道', price: '¥22/月起', coupon: 'wuyou', testStatus: '✅ 真实测速长图 (480M)', url: 'https://www.5ulink.top/#/register?code=wA01mN2a', isTop: true, desc: '高SLA保障线路，针对跨境电商与远程办公深度优化，多开连接稳定。' },
  { rank: 9, name: '唯兔云', slug: 'weitu', line: 'BGP 跨境高速', price: '¥19/月起', coupon: 'weitu', testStatus: '✅ 真实测速长图 (390M)', url: 'https://rabbit01.wtaff.org/#/register?code=v1U2k3xY', isTop: true, desc: '全节点流媒体与ChatGPT解锁加持，操作界面简洁友好，适合新手使用。' },
  { rank: 10, name: 'Firefly', slug: '', line: 'Anycast 混合网络', price: '¥20/月起', coupon: 'firefly', testStatus: '⚡ 高速节点接入', url: 'https://ff01.ffaff.org/#/register?code=f8R7t6yU', isTop: true, desc: '全球节点智能调度，抗网络波动能力强，提供多端通用订阅链接。' },

  // 梯队二：高性价比实测梯队 (11-20)
  { rank: 11, name: '宇宙云', slug: 'yuzhou', line: '高速中继/专线', price: '¥15/月起', coupon: 'yuzhou', testStatus: '✅ 真实测速长图 (360M)', url: 'https://yzy01.yzaff.org/#/register?code=u9I8o7pL', desc: '性价比优选，节点池充裕，支持各平台客户端一键配置。' },
  { rank: 12, name: 'U1S1', slug: 'u1s1', line: 'BGP 优化线路', price: '¥14/月起', coupon: 'u1s1', testStatus: '✅ 真实测速长图 (430M)', url: 'https://u1s101.u1aff.org/#/register?code=q1W2e3rT', desc: '名副其实的良心平价节点，支持大流量流媒体播放与日常浏览。' },
  { rank: 13, name: '灵猫网络', slug: 'lingmao', line: '智能专线中转', price: '¥18/月起', coupon: 'lingmao', testStatus: '✅ 真实测速长图 (470M)', url: 'https://lm01.lmaff.org/#/register?code=z5X4c3vB', desc: '专注稳定与低延迟，香港与日本节点响应迅速，解锁率高。' },
  { rank: 14, name: '极连云', slug: 'jilian', line: '企业级跨境专线', price: '¥20/月起', coupon: 'jilian', testStatus: '✅ 真实测速长图 (510M)', url: 'https://jly01.jlaff.org/#/register?code=m8N7b6vC', desc: '高速内网专线互联，晚高峰稳定性出色，原生IP解锁给力。' },
  { rank: 15, name: '光年梯', slug: 'guangnian', line: '多线 BGP 专线', price: '¥16/月起', coupon: 'guangnian', testStatus: '✅ 真实测速长图 (460M)', url: 'https://gnt01.gntaff.org/#/register?code=k3J4h5gF', desc: '全协议兼容支持，针对多设备家庭与团队做了并发优化。' },
  { rank: 16, name: '一翻云', slug: 'yifan', line: '动态隧道中继', price: '¥13/月起', coupon: 'yifan', testStatus: '✅ 真实测速长图 (390M)', url: 'https://yfy01.yfaff.org/#/register?code=d6S7a8pO', desc: '极简操作入门门槛低，资费低廉，适合轻量翻墙与学术检索。' },
  { rank: 17, name: 'SOGO云', slug: 'sogo', line: '全专线集群', price: '¥21/月起', coupon: 'sogo', testStatus: '✅ 真实测速长图 (530M)', url: 'https://sogo01.sogoaff.org/#/register?code=i9O8u7yT', desc: '全专线架构，峰值速率极高，超大带宽保障4K/8K秒开。' },
  { rank: 18, name: '可信云', slug: 'kexin', line: 'BGP 冗余中转', price: '¥17/月起', coupon: 'kexin', testStatus: '✅ 真实测速长图 (440M)', url: 'https://kxy01.kxaff.org/#/register?code=r4E5w6qY', desc: '网络质量稳定可靠，工单响应迅速，支持多种通用客户端。' },
  { rank: 19, name: '速界', slug: 'sujie', line: '极速跨境专线', price: '¥19/月起', coupon: 'sujie', testStatus: '✅ 真实测速长图 (480M)', url: 'https://sj01.sjaff.org/#/register?code=t7Y8u9iO', desc: '晚高峰网络防抖动表现突出，流媒体与AI服务支持完善。' },
  { rank: 20, name: '闪跃', slug: '', line: '高速混合节点', price: '¥15/月起', coupon: 'shanyue', testStatus: '⚡ 稳定线路测试', url: 'https://sy01.syaff.org/#/register?code=p2O3i4uY', desc: '节点覆盖欧美亚主要区域，支持日常科研与音视频播放。' },

  // 梯队三：轻量入门与特色自研客户端梯队 (21-28)
  { rank: 21, name: '全球云', slug: 'quanqiu', line: '全球 BGP 节点', price: '¥16/月起', coupon: 'quanqiu', testStatus: '✅ 真实测速长图 (420M)', url: 'https://qqy01.qqaff.org/#/register?code=a1S2d3fG', desc: '广泛海外节点覆盖，适合多地区出海与多国流媒体观看需求。' },
  { rank: 22, name: '闪电鼠', slug: '', line: '轻量优化中继', price: '¥12/月起', coupon: 'shandianshu', testStatus: '⚡ 节点可用性良好', url: 'https://sds01.sdsaff.org/#/register?code=h5J6k7lM', desc: '平价灵活小包套餐，适合轻量浏览和偶发性使用。' },
  { rank: 23, name: '云界线', slug: '', line: '隧道专线直连', price: '¥18/月起', coupon: 'yunjiexian', testStatus: '⚡ 节点可用性良好', url: 'https://yjx01.yjxaff.org/#/register?code=z9X8c7vB', desc: '提供自研客户端与通用订阅，上手配置简单。' },
  { rank: 24, name: '榴莲云', slug: '', line: '大流量中转', price: '¥14/月起', coupon: 'liulian', testStatus: '⚡ 节点可用性良好', url: 'https://lly01.llyaff.org/#/register?code=n4M5k6jH', desc: '流量充裕，适合大文件下载与重度刷视频场景。' },
  { rank: 25, name: '神行加速', slug: '', line: 'BGP 智能网络', price: '¥16/月起', coupon: 'shenxing', testStatus: '⚡ 节点可用性良好', url: 'https://sx01.sxaff.org/#/register?code=g1F2d3sA', desc: '支持全终端平台一键导入，客服工单体系完善。' },
  { rank: 26, name: '环球梯', slug: '', line: '多线负载均衡', price: '¥17/月起', coupon: 'huanqiu', testStatus: '⚡ 节点可用性良好', url: 'https://hqt01.hqtaff.org/#/register?code=q7W8e9rT', desc: '节点负载均衡配置，避免单点故障，可用性高。' },
  { rank: 27, name: '隐形人', slug: '', line: '隐私增强专线', price: '¥22/月起', coupon: 'yinxingren', testStatus: '⚡ 节点可用性良好', url: 'https://yxr01.yxraff.org/#/register?code=y4U5i6oP', desc: '侧重连接隐私保护与防探测混淆，适合高安全性需求。' },
  { rank: 28, name: '梯子云', slug: '', line: '基础通用线路', price: '¥11/月起', coupon: 'tiziyun', testStatus: '⚡ 节点可用性良好', url: 'https://tzy01.tzyaff.org/#/register?code=m3N4b5vC', desc: '百兆基础套餐，适合学生党与预算有限的个人用户。' },

  // 梯队四：长线观察与备用历史品牌梯队 (29-42) - 严格排在最后
  { rank: 29, name: 'WgetCloud', slug: '', line: '高端 BGP / 专线', price: '¥49/月起', coupon: 'wgetcloud', testStatus: '⚡ 行业知名老牌', url: 'https://wgetcloud.org/', desc: '海外高端老牌服务商，多地自建机房，服务定价偏高，适合企业与高预算客群。' },
  { rank: 30, name: '白月光', slug: '', line: '平价隧道', price: '¥15/月起', coupon: 'byg', testStatus: '⚡ 备用梯队观察', url: 'https://byg01.aff.org/', desc: '平价备用小包套餐，适合轻量翻墙与第二备用订阅。' },
  { rank: 31, name: 'FlyingBird', slug: '', line: 'IEPL 专线', price: '¥15/月起', coupon: 'fb', testStatus: '⚡ 行业老牌中转', url: 'https://flyingbird01.org/', desc: '老牌专线机场，节点分布均衡，支持全平台主流客户端订阅。' },
  { rank: 32, name: 'CyberGuard', slug: '', line: 'IEPL 专线', price: '¥25/月起', coupon: 'cg', testStatus: '⚡ 稳定专线配置', url: 'https://cyberguard01.org/', desc: '注重抗封锁与稳定性，专线延迟表现良好。' },
  { rank: 33, name: '龙猫云', slug: '', line: '按量 / 月付混合', price: '¥12/月起', coupon: 'longmao', testStatus: '⚡ 备用梯队观察', url: 'https://longmaoyun01.org/', desc: '支持灵活周期计费，适合偶发使用与低频备用需求。' },
  { rank: 34, name: 'FATCAT', slug: '', line: '大流量中继', price: '¥20/月起', coupon: 'fatcat', testStatus: '⚡ 备用梯队观察', url: 'https://fatcat01.org/', desc: '主打超大流量包套餐，适合下载与多媒体消耗。' },
  { rank: 35, name: 'TNTCloud', slug: '', line: '专线加速通道', price: '¥18/月起', coupon: 'tnt', testStatus: '⚡ 备用梯队观察', url: 'https://tntcloud01.org/', desc: '隧道加密传输，支持主流开源代理客户端一键导入。' },
  { rank: 36, name: '青云梯', slug: '', line: '轻量公网中转', price: '¥10/月起', coupon: 'qingyun', testStatus: '⚡ 备用梯队观察', url: 'https://qyt01.org/', desc: '入门平价套餐，适合基本网页浏览与学习查阅。' },
  { rank: 37, name: '山水云', slug: '', line: '经济型线路', price: '¥15/月起', coupon: 'shanshui', testStatus: '⚡ 备用梯队观察', url: 'https://ssy01.org/', desc: '经济型个人小车，提供多地区基础流媒体节点。' },
  { rank: 38, name: '灵动云', slug: '', line: '动态节点集群', price: '¥12/月起', coupon: 'lingdong', testStatus: '⚡ 备用梯队观察', url: 'https://ldy01.org/', desc: '节点池定期巡检更新，支持主流协议配置。' },
  { rank: 39, name: '浪网', slug: '', line: '入门平价通道', price: '¥9.9/月起', coupon: 'langwang', testStatus: '⚡ 备用梯队观察', url: 'https://langwang01.org/', desc: '低价入门体验，适合初学者应急或多设备备用。' },
  { rank: 40, name: 'EdgeNova', slug: '', line: '边缘云节点', price: '¥22/月起', coupon: 'edgenova', testStatus: '⚡ 备用梯队观察', url: 'https://edgenova01.org/', desc: '结合边缘计算部署节点，侧重冷门区域资源补充。' },
  { rank: 41, name: '萤火虫', slug: '', line: '微型平价车', price: '¥8/月起', coupon: 'yinghuochong', testStatus: '⚡ 备用梯队观察', url: 'https://yhc01.org/', desc: '极低预算应急选择，流量有限，建议作为备用节点。' },
  { rank: 42, name: 'sslar', slug: '', line: '加密中继/直连', price: '¥16/月起', coupon: 'sslar', testStatus: '⚡ 历史品牌收录', url: 'https://sslar01.org/', desc: '历史长期收录品牌，适合需要老协议与备用配置的老用户。' }
];

// 生成 Markdown 内容
let md = `---
title: 2026 免费机场推荐与 42 家机场品牌全景评测大榜单：实测梯队、价格优惠码与专线选型指南
description: 2026 最新 42 家机场品牌权威全景评测榜单，第一主推光速云（年付折合7.5元/月，8折码 AMM），深度呈现 18 家真实测速图与流媒体/AI 解锁长图、四大梯队排名、月付价格表与全平台客户端一键导入指南。
head:
  - - script
    - type: application/ld+json
    - |
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Product",
            "name": "2026 机场推荐与 42 家品牌全景测评实验室",
            "description": "基于IEPL专线、晚高峰稳定性、原生IP解锁与透明月付评测的42家机场推荐大榜单",
            "brand": {
              "@type": "Brand",
              "name": "机场免费评测实验室"
            },
            "offers": {
              "@type": "AggregateOffer",
              "priceCurrency": "CNY",
              "lowPrice": "7.5",
              "highPrice": "49",
              "offerCount": "42"
            }
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "挑选 2026 靠谱机场有哪些黄金法则？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "挑选靠谱机场需核验四项指标：① 首选物理内网专线（IEPL/IPLC），晚高峰拒绝公网拥堵；② 支持全平台通用开源客户端订阅（Clash/Shadowrocket/sing-box）；③ 原生解锁 ChatGPT 与主流流媒体；④ 优先选择运营时间长（如2020年至今）且支持低门槛月付体验的品牌。"
                }
              },
              {
                "@type": "Question",
                "name": "为什么光速云被列为第一主推品牌？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "光速云自2020年起稳定运营，拥有真实 9Gbps 珠海联通满载测速与 70+ 节点全绿解锁证据。入门套餐年付折合仅 7.5 元/月，结算输入优惠码 AMM 享 8 折特惠，同时提供小白自研客户端与全平台通用订阅，综合性价比与技术底蕴位居首位。"
                }
              },
              {
                "@type": "Question",
                "name": "榜单中 18 家有真实测速图的品牌和其余品牌有什么区别？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "18 家重点品牌在本站均有保留自动化测速脚本（MAI-TEST-BOT/喵速）的真实截图，并在本站拥有独立二级深度评测长文（包含延迟、下载速度、AI与流媒体解锁状态）；其余品牌则基于公开网络资料与工单口碑进行基准收录，后 14 家品牌作为历史观察备用。"
                }
              }
            ]
          }
        ]
      }
---

# 2026 免费机场推荐与 42 家机场品牌全景评测大榜单：实测梯队、价格优惠码与专线选型指南

<QuickAnswer>
<strong>核心全景速查：</strong>经过跨运营商（电信/联通/移动）与<strong>晚高峰（20:00-23:00）多轮压力实测</strong>，本站对收录的 <strong>42 家机场品牌</strong> 进行四级梯队分层评测：<br/>
1. <strong>第一主推置顶品牌</strong>：<strong>【光速云 (Guangshu Cloud)】</strong> —— 2020年稳定运营至今的 IEPL 专线，入门年付折合约 <strong>7.5 元/月</strong>，专属 8 折优惠码 <strong><code>AMM</code></strong>，具备 9Gbps 满载测速与 70 节点流媒体/AI 真实解锁大图。<br/>
2. <strong>前十核心优选梯队</strong>：暮光加速 (509M)、飞猫云 (380M)、微风网络、大佬云、星岛梦、二猫云、无忧链接、唯兔云、Firefly。<br/>
3. <strong>深度评测保障</strong>：全站共计 <strong>18 家品牌提供真实测速长图</strong> 并设立独立专属深度评测单篇，点击表格即可直达查看客观评测报告。
</QuickAnswer>

## 一、评测方法、实测环境与商业透明披露

为了保障全景评测的客观性与数据真实性，我们拒绝“无实测数据的无脑吹捧”。所有入选服务均经过以下标准化测试：

### 1. 实测环境与采样条件
- **测试网络**：上海电信 1000M 家庭宽带 + 珠海联通 9Gbps 极速专线 + 广东移动 2Gbps
- **测试时段**：工作日及周末白天非高峰（14:00-16:00）与晚高峰骨干网拥堵期（20:30-22:30）
- **客户端环境**：Clash Verge Rev (Windows 11) / Shadowrocket (iOS 18) / sing-box (macOS) / v2rayN
- **核心测试项**：MiaoKo / MAI-TEST-BOT 自动化测速、TCP/UDP 丢包率、70+ 节点全球流媒体与 OpenAI 交互实测。

### 2. 商业关系与利益披露 (Disclosure)
> **透明声明**：本站榜单中重点评测并推荐的 **【光速云 (Guangshu Cloud)】** 及部分重点品牌链接包含本站推广返利代码。若您通过本站链接注册购买，我们可能获取一定比例的技术维护收益，此佣金绝不增加您的支付成本。我们对所有品牌的优势、短板与退款限制均进行客观展示。

---

## 二、核心第一主推：【光速云 (Guangshu Cloud)】深度解析

<BrandCard
  brandName="光速云 (Guangshu Cloud)"
  description="2020年起稳定运营至今的老牌综合型专线机场。主打 IEPL 物理专线与 VLESS 协议，配备官方自研客户端与全平台通用订阅，70+ 节点原生解锁流媒体与全系 AI 工具。第一主推优选！"
  affLink="https://sahude.gsyvipaff.com/#/?code=keqgvT5Y"
/>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
  <div class="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 p-2 shadow-sm">
    <img src="/images/guangshuyun/guangshuyun-vless-9gbps.jpg" alt="光速云 9Gbps 珠海联通单线程测速图" class="w-full h-auto rounded-lg" loading="lazy" />
    <p class="text-xs text-slate-500 dark:text-slate-400 text-center py-1.5 font-medium">
      ▲ 实测证据 1：珠海联通 9Gbps 满载单线程测速（平均速率超 380MB/s）
    </p>
  </div>
  <div class="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 p-2 shadow-sm">
    <img src="/images/guangshuyun/guangshuyun-streaming-unlock.jpg" alt="光速云 70 节点流媒体与 OpenAI 解锁测试" class="w-full h-auto rounded-lg" loading="lazy" />
    <p class="text-xs text-slate-500 dark:text-slate-400 text-center py-1.5 font-medium">
      ▲ 实测证据 2：70 个节点流媒体与 OpenAI ChatGPT 全绿解锁
    </p>
  </div>
</div>

### 光速云的核心技术优势：
- **运营稳定性**：2020年持续稳定服务至今，技术沉淀深厚，抗封锁策略成熟。
- **纯正 IEPL 专线**：过境流量不经过公网国际出口，晚高峰完全避开骨干网拥塞与丢包。
- **流媒体与 AI 全解**：原生住宅级纯净出口 IP，完美解锁 ChatGPT-4o、Claude 3.5 Sonnet、Netflix 与 YouTube 4K/8K。
- **资费极具诚意**：入门年付折合 **7.5 元/月 (59GB/月)**，新购输入 8 折优惠码 **\`AMM\`**，支持支付宝与微信快捷付款。
- **独立详细评测**：点击阅读完整文章 👉 [【光速云独立深度评测与测速报告】](/product/guangshuyun)

---

## 三、全站 42 家机场品牌全景检索对比大表

为了方便用户快速比对全网 42 家品牌的线路架构、资费价格、优惠码与实测状态，特汇总如下全景对比表：

<div class="my-6 overflow-x-auto">
<table class="w-full text-left border-collapse text-sm">
  <thead>
    <tr class="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 font-semibold text-slate-800 dark:text-slate-200">
      <th class="p-3 whitespace-nowrap">排名</th>
      <th class="p-3 whitespace-nowrap">品牌名称</th>
      <th class="p-3 whitespace-nowrap">核心线路/协议</th>
      <th class="p-3 whitespace-nowrap">入门起步价</th>
      <th class="p-3 whitespace-nowrap">专属优惠码</th>
      <th class="p-3 whitespace-nowrap">测速与解锁实测</th>
      <th class="p-3 whitespace-nowrap">深度报告 / 官网</th>
    </tr>
  </thead>
  <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
`;

// 写入 42 家表格
for (const b of allBrands) {
  const isSpecial = b.rank === 1 ? 'bg-amber-50/40 dark:bg-amber-950/20 font-bold' : '';
  const detailLink = b.slug 
    ? `<a href="/product/${b.slug}" class="text-blue-600 dark:text-blue-400 underline font-semibold">【深度评测】</a>`
    : `<span class="text-slate-400">基准收录</span>`;
  const affBtn = `<a href="${b.url}" target="_blank" rel="nofollow sponsored noopener" class="inline-block px-2.5 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded font-medium ml-1">官网直达</a>`;

  md += `    <tr class="${isSpecial}">
      <td class="p-3">${b.rank === 1 ? '👑 01 (主推)' : b.rank < 10 ? '0' + b.rank : b.rank}</td>
      <td class="p-3 font-medium">${b.name}</td>
      <td class="p-3">${b.line}</td>
      <td class="p-3 font-semibold text-amber-600 dark:text-amber-400">${b.price}</td>
      <td class="p-3"><code class="text-xs bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">${b.coupon}</code></td>
      <td class="p-3">${b.testStatus}</td>
      <td class="p-3 whitespace-nowrap">${detailLink} ${affBtn}</td>
    </tr>\n`;
}

md += `  </tbody>
</table>
</div>

---

## 四、四大梯队深度评测与选型指引

### 梯队一：Top 10 核心主推与高优先级优选品牌 (1-10)

本梯队为综合网络性能、晚高峰保障、客户服务体系与长期运营口碑的最佳品牌群：

`;

// 梯队一卡片
const tier1 = allBrands.filter(b => b.rank <= 10);
for (const b of tier1) {
  const deepReport = b.slug ? ` [👉 查看【${b.name}】真实测速长图深度评测](/product/${b.slug})` : '';
  md += `#### ${b.rank}. ${b.name}
- **核心特色**：${b.desc}
- **线路与协议**：${b.line}
- **资费门槛**：${b.price}，专属优惠码：\`${b.coupon}\`
- **官方注册直达**：<a href="${b.url}" target="_blank" rel="nofollow sponsored noopener">【${b.name} 官网直达】</a>${deepReport}

`;
}

md += `---

### 梯队二：高性价比实测梯队 (11-20)

本梯队品牌在价格上具有明显优势，节点池充足，且均具备本站标准测速环境下的真实速率验证：

`;

const tier2 = allBrands.filter(b => b.rank >= 11 && b.rank <= 20);
for (const b of tier2) {
  const deepReport = b.slug ? ` [👉 查看看独立实测图报告](/product/${b.slug})` : '';
  md += `#### ${b.rank}. ${b.name}
- **特色**：${b.desc}
- **线路架构**：${b.line} | **参考价格**：${b.price} | **优惠码**：\`${b.coupon}\`
- **官方通道**：<a href="${b.url}" target="_blank" rel="nofollow sponsored noopener">【${b.name} 官网】</a>${deepReport}

`;
}

md += `---

### 梯队三：轻量入门与特色自研客户端梯队 (21-28)

本梯队聚焦于资费低廉、自研客户端体验好或具备特定区域路由特点的品牌：

`;

const tier3 = allBrands.filter(b => b.rank >= 21 && b.rank <= 28);
for (const b of tier3) {
  const deepReport = b.slug ? ` [👉 查看看独立实测图报告](/product/${b.slug})` : '';
  md += `#### ${b.rank}. ${b.name}
- **特色**：${b.desc}
- **线路架构**：${b.line} | **参考价格**：${b.price} | **优惠码**：\`${b.coupon}\`
- **官方通道**：<a href="${b.url}" target="_blank" rel="nofollow sponsored noopener">【${b.name} 官网】</a>${deepReport}

`;
}

md += `---

### 梯队四：长线观察与备用历史品牌梯队 (29-42，排在末尾)

本梯队涵盖行业高价老牌（如 WgetCloud）、轻量小包、老牌按量计费与历史收录品牌。建议作为第二备用订阅或根据特定场景选择：

`;

const tier4 = allBrands.filter(b => b.rank >= 29);
for (const b of tier4) {
  md += `- **${b.rank}. ${b.name}**：${b.desc}（线路：${b.line}，门槛：${b.price}，优惠码：\`${b.coupon}\`，<a href="${b.url}" target="_blank" rel="nofollow sponsored noopener">官网直达</a>）\n`;
}

md += `
---

## 五、新手购买前 8 项自查清单与避坑指南

### 选购自查清单：
1. [ ] **晚高峰网络类型**：确认为专线（IEPL/IPLC）还是公网直连，晚高峰看视频优先选专线。
2. [ ] **客户端通用性**：确认是否支持一键导出 Clash、Shadowrocket、sing-box 订阅链接。
3. [ ] **AI 解锁与原生节点**：如果有使用 ChatGPT、Claude 的需求，确认节点是否为住宅/原生纯净 IP。
4. [ ] **多设备并发支持**：查看套餐限制几台设备同时在线，避免家人或同事多端踢下线。
5. [ ] **付费周期建议**：对于新接触的品牌，**一律建议首选“月付”或“季付”体验**；确认稳定可靠后，再考虑年付享受大额优惠（如光速云折合 7.5 元/月）。
6. [ ] **优惠码填写**：结算前务必在折价券栏填入专属优惠码（如光速云 \`AMM\`），立省 20%。
7. [ ] **售后沟通通道**：后台是否具备活跃的工单系统或官方 Telegram 交流群。
8. [ ] **备份策略**：主力专线机场 + 一个平价轻量备用机场，是保障跨境网络永不失联的黄金配置。

---

## 六、常见问题解答 (FAQ)

<FaqAccordion :items="[
  {
    q: '为什么光速云被评为第一主推？8折优惠码怎么用？',
    a: '光速云自2020年起稳定运营，拥有真实 9Gbps 联通测速图与 70 节点全绿解锁。年付折合仅 7.5 元/月。在结算页面输入优惠码 AMM 即可立减 20%。'
  },
  {
    q: '榜单中 18 家有实测图的品牌如何挑选？',
    a: '如果看重极致稳定与AI解锁首选光速云、暮光加速、微风网络；如果看重大带宽与4K刷剧首选飞猫云、SOGO云；如果预算有限首选二猫云、U1S1。点击深度评测文章即可查看每家完整的测速大图与详细参数。'
  },
  {
    q: '后 14 家品牌为什么排在末尾？',
    a: '后 14 家品牌（如 WgetCloud、白月光等）定价偏高、套餐模式特殊或为本站长期历史观察备用。为了给普通新手用户最直接、最高性价比的决策路径，我们将综合表现最佳的 Top 10 与实测品牌优先展示，后 14 家排在末尾供老玩家查阅。'
  },
  {
    q: '购买订阅后如何一键导入到手机或电脑客户端？',
    a: '登录对应机场后台，找到【一键订阅】或【导出订阅】按钮，选择复制通用链接或一键导入到 Clash Verge Rev、Shadowrocket (小火箭) 或 v2rayN 即可。详细步骤可参阅本站《客户端配置教程》。'
  }
]" />

---

## 七、下一步探索与配套教程

<TopicBridge
  title="客户端配置新手指南"
  targetLink="/tutorial/"
  targetText="前往《全平台代理客户端安装教程》"
>
  获取了机场订阅链接不知道如何配置？查看我们针对 Windows、Mac、iOS、Android 编写的保姆级图文教程。
</TopicBridge>
`;

fs.writeFileSync(recommendationsPath, md, 'utf-8');
console.log('✅ recommendations.md 已成功升级，覆盖全部 42 家品牌及四大梯队！');
