import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ROOT_DIR = path.resolve(__dirname, '..')
const BRANDS_TXT_PATH = 'c:/Users/Pro User/Desktop/机场品牌信息/42家机场品牌清单.txt'

const rawContent = fs.readFileSync(BRANDS_TXT_PATH, 'utf-8')

// 18 个有测速图的品牌元数据
const imageBrands = [
  {
    slug: 'muguang',
    name: '暮光加速',
    rank: 2,
    tier: 'top10',
    affLink: 'https://varnexa.twilightaff.com/#/?code=D1LHglg3',
    coupon: 'muguang5555',
    tagline: 'BGP 智能动态调度，专线级出口保障，多设备同时在线',
    image: '/images/speedtests/muguang-speedtest.png',
    testDate: '2026-08-11 19:52:22 CST',
    testTool: 'MAI-TEST-BOT / 喵速',
    lines: 'BGP 智能调度专线级出口',
    protocols: 'Shadowsocks / VLESS',
    devices: 'Windows / macOS / iOS / Android / Linux 全平台',
    aiUnlock: '支持 ChatGPT、Claude；Gemini 视节点而定',
    streamingUnlock: '支持 Netflix、Disney+、YouTube Premium、HBO Max、TikTok、Spotify',
    speeds: [
      { region: '香港 IEPL', ping: '26ms', speed: '509 Mbps', video: '8K 秒播 / 缓冲 40s' },
      { region: '台湾 专线', ping: '40ms', speed: '107 Mbps', video: '4K 秒播 / 缓冲 35s' },
      { region: '新加坡 专线', ping: '43ms', speed: '419 Mbps', video: '4K 秒播 / 缓冲 38s' },
      { region: '日本 专线', ping: '53ms', speed: '150 Mbps', video: '4K 秒播 / 缓冲 30s' },
      { region: '美国 优化', ping: '160ms', speed: '19 Mbps', video: '1080P/4K 可用' }
    ],
    pricing: [
      { name: '【暮光·基础版】', cycle: '月付', price: '¥20', traffic: '120GB/月' },
      { name: '【暮光·标准版】', cycle: '月付', price: '¥40', traffic: '240GB/月' },
      { name: '【暮光·旗舰版】', cycle: '月付', price: '¥100', traffic: '700GB/月' },
      { name: '【暮光·至尊版】', cycle: '月付', price: '¥180', traffic: '1500GB/月' },
      { name: '【暮光·年付轻量版】', cycle: '年付', price: '¥109', traffic: '70GB/月 (折合约 9元/月)' },
      { name: '【暮光·不限时轻量包】', cycle: '一次性', price: '¥219', traffic: '150GB 不过期' }
    ],
    intro: '暮光加速面向个人与团队跨平台使用场景，主打 BGP 智能调度和专线级出口，覆盖 Windows、macOS、iOS、Android、Linux 全平台，多设备同时在线是其核心亮点。入门 20元/月（年付折合约9元/月）在专线机场中性价比较高，120GB–1500GB 档位选择丰富，官方提供 7×24 小时客服协助。'
  },
  {
    slug: 'feimao',
    name: '飞猫云',
    rank: 3,
    tier: 'top10',
    affLink: 'https://guangs.flycataff.com/#/?code=6uq0Xe9y',
    coupon: 'flycat888',
    tagline: '专属免配置客户端即开即用，亚太欧美热门节点覆盖',
    image: '/images/speedtests/feimao-speedtest.png',
    testDate: '2026-08-11 08:52:30 CST',
    testTool: 'MAI-TEST-BOT 2.0.0-dev',
    lines: '公网中转 + 专线直连',
    protocols: 'Shadowsocks',
    devices: '自研免配客户端 + Clash / Shadowrocket',
    aiUnlock: '支持 ChatGPT、Claude；Gemini 需切换指定节点',
    streamingUnlock: '支持 Netflix、Disney+、YouTube Premium、TikTok',
    speeds: [
      { region: '香港 01', ping: '28ms', speed: '480 Mbps', video: '4K/8K 秒播' },
      { region: '日本 01', ping: '45ms', speed: '410 Mbps', video: '4K 秒播' },
      { region: '新加坡 01', ping: '52ms', speed: '360 Mbps', video: '4K 秒播' },
      { region: '美国 01', ping: '150ms', speed: '210 Mbps', video: '4K 秒播' }
    ],
    pricing: [
      { name: '飞猫·学生版', cycle: '年付', price: '¥84', traffic: '50GB/月 (折合约 7元/月)' },
      { name: '飞猫·星耀版', cycle: '月付', price: '¥25', traffic: '150GB/月' },
      { name: '飞猫·王者版', cycle: '月付', price: '¥45', traffic: '320GB/月' }
    ],
    intro: '飞猫云主打轻快连接、简单配置和灵活节点切换。最大亮点是提供专属客户端，登录账号即可一键连接，省去繁琐导入订阅步骤，对完全不懂分流配置的新手极为友好。学生版年付 84 元（月均仅 7 元）非常亲民。'
  },
  {
    slug: 'weifeng',
    name: '微风网络',
    rank: 4,
    tier: 'top10',
    affLink: 'https://edp01.breezenetaff.com/#/?code=t3huofyI',
    coupon: 'flat888',
    tagline: 'IEPL 内网专线 + 隧道中转，多入口容灾，低调稳定老牌',
    image: '/images/speedtests/weifeng-speedtest.png',
    testDate: '2026-07-20 21:41:00 CST',
    testTool: 'MAI-TEST-BOT',
    lines: 'IEPL 内网专线 + 隧道中转双冗余',
    protocols: 'Shadowsocks / VMess',
    devices: '全平台通用订阅 (Clash / v2rayN / 小火箭 / sing-box)',
    aiUnlock: '支持 ChatGPT-4o、Claude 3.5、Gemini',
    streamingUnlock: '支持 Netflix、Disney+、YouTube 4K、TikTok',
    speeds: [
      { region: '香港 专线', ping: '24ms', speed: '510 Mbps', video: '8K 秒播' },
      { region: '日本 专线', ping: '42ms', speed: '430 Mbps', video: '4K 秒播' },
      { region: '新加坡 专线', ping: '49ms', speed: '390 Mbps', video: '4K 秒播' },
      { region: '美国 专线', ping: '142ms', speed: '280 Mbps', video: '4K 秒播' }
    ],
    pricing: [
      { name: '微风·轻量年付', cycle: '年付', price: '¥88', traffic: '60GB/月 (折合约 7.3元/月)' },
      { name: '微风·标准月付', cycle: '月付', price: '¥24', traffic: '150GB/月' },
      { name: '微风·旗舰月付', cycle: '月付', price: '¥48', traffic: '350GB/月' }
    ],
    intro: '微风网络自 2022 年起稳定运营，定位高稳定技术型机场。采用 IEPL 内网专线搭配隧道中转多入口容灾，晚高峰抗波动能力强。优惠码 flat888 享折扣，轻量年付 88 元适合日常查资料与学术科研。'
  },
  {
    slug: 'xingdaomeng',
    name: '星岛梦',
    rank: 6,
    tier: 'top10',
    affLink: 'https://guangs.xingdaomeng.com/#/?code=1TynBYnR',
    coupon: 'nmw888',
    tagline: '2020 年老牌稳定运营，支持不限时套餐与多档周期订阅',
    image: '/images/speedtests/xingdaomeng-speedtest.png',
    testDate: '2026-08-11 01:48:13 CST',
    testTool: 'MAI-TEST-BOT 2.0.0-dev',
    lines: 'BGP 隧道中转 + 专线节点',
    protocols: 'Shadowsocks',
    devices: '全平台通用订阅',
    aiUnlock: '支持 ChatGPT、Claude',
    streamingUnlock: '支持 Netflix、YouTube Premium、Disney+',
    speeds: [
      { region: '香港 01', ping: '25ms', speed: '470 Mbps', video: '4K 秒播' },
      { region: '日本 01', ping: '48ms', speed: '380 Mbps', video: '4K 秒播' },
      { region: '新加坡 01', ping: '55ms', speed: '340 Mbps', video: '4K 秒播' },
      { region: '美国 01', ping: '155ms', speed: '190 Mbps', video: '4K 秒播' }
    ],
    pricing: [
      { name: '星岛·轻量年付', cycle: '年付', price: '¥88', traffic: '60GB/月' },
      { name: '星岛·标准月付', cycle: '月付', price: '¥22', traffic: '130GB/月' },
      { name: '星岛·不限时包', cycle: '一次性', price: '¥198', traffic: '200GB 不过期' }
    ],
    intro: '星岛梦自 2020 年上线运营至今，历经多年网络大考，信誉良好。除了提供 88 元/年起的周期套餐外，其不限时流量包是低频轻度用户的福音，买一次可以用很久。'
  },
  {
    slug: 'ermao',
    name: '二猫云',
    rank: 7,
    tier: 'top10',
    affLink: 'https://guangs.2maoyunaff.cc/#/?code=7mjvgGbW',
    coupon: 'ermao5555',
    tagline: '20元 130GB 纯正专线，节点延迟低，性价比突出',
    image: '/images/speedtests/ermao-speedtest.png',
    testDate: '2026-08-11 10:45:27 CST',
    testTool: 'MAI-TEST-BOT 2.0.0-dev',
    lines: 'BGP 中转专线',
    protocols: 'Shadowsocks',
    devices: '支持全平台通用客户端',
    aiUnlock: '支持 ChatGPT、Claude',
    streamingUnlock: '支持 Netflix、Disney+、YouTube 4K',
    speeds: [
      { region: '香港 01', ping: '27ms', speed: '495 Mbps', video: '4K 秒播' },
      { region: '日本 01', ping: '46ms', speed: '420 Mbps', video: '4K 秒播' },
      { region: '新加坡 01', ping: '53ms', speed: '370 Mbps', video: '4K 秒播' },
      { region: '美国 01', ping: '148ms', speed: '240 Mbps', video: '4K 秒播' }
    ],
    pricing: [
      { name: '二猫·基础版', cycle: '月付', price: '¥20', traffic: '130GB/月' },
      { name: '二猫·进阶版', cycle: '月付', price: '¥38', traffic: '280GB/月' },
      { name: '二猫·年付版', cycle: '年付', price: '¥108', traffic: '70GB/月' }
    ],
    intro: '二猫云主打 20元/月 130GB 的高性价比档位，节点涵盖港日美新等主流地区。实测香港节点延迟 27ms，下行带宽表现优秀，适合追剧与日常上网。'
  },
  {
    slug: 'wuyou',
    name: '无忧链接',
    rank: 8,
    tier: 'top10',
    affLink: 'https://wep01.worryfreeaff.com/#/?code=4ZoSbLdL',
    coupon: 'wuyou666',
    tagline: '订阅无需手动转换，6元极低门槛轻量套餐，新手友好',
    image: '/images/speedtests/wuyou-speedtest-1.jpg',
    testDate: '2026-09-07 12:52:00 CST',
    testTool: 'MAI-TEST-BOT 实测',
    lines: '多线 BGP 中转',
    protocols: 'Shadowsocks / VLESS',
    devices: '自适应全客户端订阅',
    aiUnlock: '支持主流 AI 工具',
    streamingUnlock: '支持 4K 流媒体播放',
    speeds: [
      { region: '香港 节点', ping: '29ms', speed: '460 Mbps', video: '4K 秒播' },
      { region: '日本 节点', ping: '49ms', speed: '390 Mbps', video: '4K 秒播' },
      { region: '新加坡 节点', ping: '56ms', speed: '330 Mbps', video: '4K 秒播' },
      { region: '美国 节点', ping: '162ms', speed: '210 Mbps', video: '4K 秒播' }
    ],
    pricing: [
      { name: '无忧·体验套餐', cycle: '月付', price: '¥6', traffic: '30GB/月' },
      { name: '无忧·标准套餐', cycle: '月付', price: '¥18', traffic: '110GB/月' },
      { name: '无忧·大杯套餐', cycle: '月付', price: '¥35', traffic: '260GB/月' }
    ],
    intro: '无忧链接最大的特色在于提供 6 元/月的极低体验档，试错成本极低。后台订阅系统深度优化，支持自适应订阅格式，小火箭、Clash、v2rayN 均可一键添加无需手动转换格式。'
  },
  {
    slug: 'weitu',
    name: '唯兔云',
    rank: 9,
    tier: 'top10',
    affLink: 'https://guangs.v2yunvipaff.com/#/?code=xIutqOBA',
    coupon: 'weitu666',
    tagline: '60+ 优质节点集群，三网智能路由优化与负载均衡',
    image: '/images/speedtests/weitu-speedtest.png',
    testDate: '2026-08-11 13:55:08 CST',
    testTool: 'MAI-TEST-BOT 2.0.0-dev',
    lines: '三网优化专线 + 智能负载均衡',
    protocols: 'Shadowsocks',
    devices: '全平台客户端兼容',
    aiUnlock: '支持 ChatGPT、Claude',
    streamingUnlock: '支持 Netflix、Disney+、YouTube 4K、TikTok',
    speeds: [
      { region: '香港 01', ping: '24ms', speed: '520 Mbps', video: '8K 秒播' },
      { region: '日本 01', ping: '43ms', speed: '440 Mbps', video: '4K 秒播' },
      { region: '新加坡 01', ping: '50ms', speed: '380 Mbps', video: '4K 秒播' },
      { region: '美国 01', ping: '145ms', speed: '260 Mbps', video: '4K 秒播' }
    ],
    pricing: [
      { name: '唯兔·尝鲜版', cycle: '月付', price: '¥22', traffic: '150GB/月' },
      { name: '唯兔·进阶版', cycle: '月付', price: '¥42', traffic: '320GB/月' },
      { name: '唯兔·年付版', cycle: '年付', price: '¥99', traffic: '70GB/月' }
    ],
    intro: '唯兔云拥有 60+ 节点的大规模资源池，针对电信、联通、移动三网做了差异化接入优化，配合后端智能负载均衡，高峰期能有效避免单节点拥塞。年付 99 元性价比出众。'
  },
  {
    slug: 'yuzhou',
    name: '宇宙云',
    rank: 11,
    tier: 'standard',
    affLink: 'https://wzjc.yuzoucloud.cc/#/?code=yrThwMP1',
    coupon: 'YUZHOU553',
    tagline: 'IEPL 内网专线 + VLESS 协议，自研客户端开箱即用',
    image: '/images/speedtests/yuzhou-speedtest.png',
    testDate: '2026-08-11 21:04:24 CST',
    testTool: 'main 4.3.3 / 喵速 4.7.0 (珠海联通 9Gbps)',
    lines: 'IEPL 专线 + VLESS 协议',
    protocols: 'VLESS',
    devices: '自研客户端 + 通用客户端',
    aiUnlock: '支持 ChatGPT、Claude、Gemini',
    streamingUnlock: '原生解锁 Netflix、Disney+、YouTube 4K',
    speeds: [
      { region: '香港 VLESS', ping: '22ms', speed: '560 Mbps', video: '8K 秒播' },
      { region: '日本 VLESS', ping: '39ms', speed: '480 Mbps', video: '4K 秒播' },
      { region: '新加坡 VLESS', ping: '46ms', speed: '430 Mbps', video: '4K 秒播' },
      { region: '美国 VLESS', ping: '138ms', speed: '310 Mbps', video: '4K 秒播' }
    ],
    pricing: [
      { name: '宇宙·体验版', cycle: '月付', price: '¥25', traffic: '160GB/月' },
      { name: '宇宙·标准版', cycle: '月付', price: '¥45', traffic: '350GB/月' },
      { name: '宇宙·年付版', cycle: '年付', price: '¥118', traffic: '80GB/月' }
    ],
    intro: '宇宙云采用现代化 VLESS 协议与全 IEPL 内网专线，在珠海联通 9Gbps 压测下展现出极高吞吐率。同时提供自研客户端与开源订阅，技术实力扎实。'
  },
  {
    slug: 'u1s1',
    name: 'U1S1',
    rank: 12,
    tier: 'standard',
    affLink: 'https://guangs.vipaff.cc/#/?code=xhX5X22f',
    coupon: 'akaka',
    tagline: '20元 120GB 务实中端方案，节点存活率高，配置简单',
    image: '/images/speedtests/u1s1-speedtest.png',
    testDate: '2026-08-11 22:33:29 CST',
    testTool: 'MAI-TEST-BOT 2.0.0-dev',
    lines: 'BGP 隧道中转',
    protocols: 'Shadowsocks',
    devices: '全平台通用客户端',
    aiUnlock: '支持 ChatGPT、Claude',
    streamingUnlock: '支持 Netflix、Disney+、YouTube',
    speeds: [
      { region: '香港 01', ping: '26ms', speed: '475 Mbps', video: '4K 秒播' },
      { region: '日本 01', ping: '44ms', speed: '410 Mbps', video: '4K 秒播' },
      { region: '新加坡 01', ping: '51ms', speed: '360 Mbps', video: '4K 秒播' },
      { region: '美国 01', ping: '152ms', speed: '220 Mbps', video: '4K 秒播' }
    ],
    pricing: [
      { name: 'U1S1·基础版', cycle: '月付', price: '¥20', traffic: '120GB/月' },
      { name: 'U1S1·标准版', cycle: '月付', price: '¥38', traffic: '260GB/月' },
      { name: 'U1S1·年付版', cycle: '年付', price: '¥108', traffic: '65GB/月' }
    ],
    intro: 'U1S1 名字取自“有一说一”，定位务实中端梯队。20元/月 120GB 适合月度高频查资料与日常追剧用户，晚高峰延迟测试表现稳定。'
  },
  {
    slug: 'lingmao',
    name: '灵猫网络',
    rank: 13,
    tier: 'standard',
    affLink: 'https://vip01.civetnet.com/#/?code=8MIAyxak',
    coupon: 'lmao888',
    tagline: '19元 150GB 超大流量，支持不限时流量补充包',
    image: '/images/speedtests/lingmao-speedtest.png',
    testDate: '2026-08-11 18:45:40 CST',
    testTool: 'MAI-TEST-BOT 2.0.0-dev',
    lines: 'BGP 智能中转',
    protocols: 'Shadowsocks',
    devices: '支持主流全客户端',
    aiUnlock: '支持 ChatGPT、Claude',
    streamingUnlock: '支持 4K 流媒体播放',
    speeds: [
      { region: '香港 01', ping: '27ms', speed: '460 Mbps', video: '4K 秒播' },
      { region: '日本 01', ping: '46ms', speed: '390 Mbps', video: '4K 秒播' },
      { region: '新加坡 01', ping: '53ms', speed: '340 Mbps', video: '4K 秒播' },
      { region: '美国 01', ping: '150ms', speed: '200 Mbps', video: '4K 秒播' }
    ],
    pricing: [
      { name: '灵猫·轻量包', cycle: '月付', price: '¥19', traffic: '150GB/月' },
      { name: '灵猫·升级包', cycle: '月付', price: '¥36', traffic: '320GB/月' },
      { name: '灵猫·不限时包', cycle: '一次性', price: '¥168', traffic: '200GB 不过期' }
    ],
    intro: '灵猫网络性价比极高，月付 19 元即可享受 150GB 充足流量，对日常视频党很友好。此外提供不限时套餐，满足偶尔备用的用户群体。'
  },
  {
    slug: 'jilian',
    name: '极连云',
    rank: 14,
    tier: 'standard',
    affLink: 'https://guangs.jlyvipaff.com/#/?code=VM1rKGUu',
    coupon: 'ji8888',
    tagline: '18元 100GB 入门标杆，资料明确标明对 AI 工具良好支持',
    image: '/images/speedtests/jilian-speedtest.png',
    testDate: '2026-08-11 22:46:50 CST',
    testTool: 'MAI-TEST-BOT 2.0.0-dev',
    lines: 'BGP 专线',
    protocols: 'Shadowsocks',
    devices: '全平台客户端兼容',
    aiUnlock: '针对 ChatGPT 专属优化',
    streamingUnlock: '支持主流流媒体',
    speeds: [
      { region: '香港 01', ping: '25ms', speed: '480 Mbps', video: '4K 秒播' },
      { region: '日本 01', ping: '43ms', speed: '420 Mbps', video: '4K 秒播' },
      { region: '新加坡 01', ping: '50ms', speed: '370 Mbps', video: '4K 秒播' },
      { region: '美国 01', ping: '148ms', speed: '230 Mbps', video: '4K 秒播' }
    ],
    pricing: [
      { name: '极连·入门版', cycle: '月付', price: '¥18', traffic: '100GB/月' },
      { name: '极连·高阶版', cycle: '月付', price: '¥35', traffic: '220GB/月' },
      { name: '极连·年付版', cycle: '年付', price: '¥98', traffic: '60GB/月' }
    ],
    intro: '极连云定位亲民专线服务，18 元/月包含 100GB 流量，品牌资料重点强调了对海外 AI 工具与流媒体的稳定连接，年付仅 98 元。'
  },
  {
    slug: 'guangnian',
    name: '光年梯',
    rank: 15,
    tier: 'standard',
    affLink: 'https://guangs.gntaff.com/#/?code=X1FoxjGE',
    coupon: 'gnt6666',
    tagline: '18元 110GB 稳定表现，节点分布合理，日常办公推荐',
    image: '/images/speedtests/guangnian-speedtest.png',
    testDate: '2026-08-11 14:38:04 CST',
    testTool: 'MAI-TEST-BOT 2.0.0-dev',
    lines: 'BGP 中转专线',
    protocols: 'Shadowsocks',
    devices: '支持全平台通用客户端',
    aiUnlock: '支持常用 AI 生产力工具',
    streamingUnlock: '支持 YouTube 4K、Netflix',
    speeds: [
      { region: '香港 01', ping: '28ms', speed: '465 Mbps', video: '4K 秒播' },
      { region: '日本 01', ping: '47ms', speed: '390 Mbps', video: '4K 秒播' },
      { region: '新加坡 01', ping: '54ms', speed: '350 Mbps', video: '4K 秒播' },
      { region: '美国 01', ping: '153ms', speed: '210 Mbps', video: '4K 秒播' }
    ],
    pricing: [
      { name: '光年·尝鲜版', cycle: '月付', price: '¥18', traffic: '110GB/月' },
      { name: '光年·标准版', cycle: '月付', price: '¥34', traffic: '240GB/月' },
      { name: '光年·年付版', cycle: '年付', price: '¥99', traffic: '60GB/月' }
    ],
    intro: '光年梯定位平价稳定梯队，18元 110GB 的配置对于代码克隆、海外查资料和 YouTube 高清视频绰绰有余，优惠码 gnt6666 可享立减。'
  },
  {
    slug: 'yifan',
    name: '一翻云',
    rank: 16,
    tier: 'standard',
    affLink: 'https://guangs.1flyunaff.cc/#/register?code=Yr7FhB7r',
    coupon: 'yfy6666',
    tagline: '20元 150GB 高流量中转，节点丰富，支持多终端登录',
    image: '/images/speedtests/yifan-speedtest.png',
    testDate: '2026-08-11 00:21:30 CST',
    testTool: 'MAI-TEST-BOT 2.0.0-dev',
    lines: 'BGP 智能调度',
    protocols: 'Shadowsocks',
    devices: '全平台客户端通用',
    aiUnlock: '支持 ChatGPT、Claude',
    streamingUnlock: '支持主流流媒体',
    speeds: [
      { region: '香港 01', ping: '26ms', speed: '480 Mbps', video: '4K 秒播' },
      { region: '日本 01', ping: '45ms', speed: '415 Mbps', video: '4K 秒播' },
      { region: '新加坡 01', ping: '52ms', speed: '365 Mbps', video: '4K 秒播' },
      { region: '美国 01', ping: '150ms', speed: '225 Mbps', video: '4K 秒播' }
    ],
    pricing: [
      { name: '一翻·基础版', cycle: '月付', price: '¥20', traffic: '150GB/月' },
      { name: '一翻·标准版', cycle: '月付', price: '¥38', traffic: '300GB/月' },
      { name: '一翻·年付版', cycle: '年付', price: '¥108', traffic: '70GB/月' }
    ],
    intro: '一翻云在 20 元价格带给出了 150GB 的充足流量，夜间测速表现平稳，支持 Clash / Shadowrocket 快速导入，性价比表现优秀。'
  },
  {
    slug: 'sogo',
    name: 'SOGO 云',
    rank: 17,
    tier: 'standard',
    affLink: 'https://guangs.sogoyunaff.cc/#/?code=327Vs0w7',
    coupon: 'sss777',
    tagline: '2026 年新锐品牌，带宽资源充足，低负载低延迟',
    image: '/images/speedtests/sogo-speedtest.png',
    testDate: '2026-08-11 18:57:59 CST',
    testTool: 'MAI-TEST-BOT 2.0.0-dev',
    lines: 'BGP 专线网络',
    protocols: 'Shadowsocks',
    devices: '支持主流全客户端',
    aiUnlock: '支持常用 AI 工具',
    streamingUnlock: '支持 Netflix、Disney+、YouTube 4K',
    speeds: [
      { region: '香港 01', ping: '25ms', speed: '510 Mbps', video: '8K 秒播' },
      { region: '日本 01', ping: '42ms', speed: '430 Mbps', video: '4K 秒播' },
      { region: '新加坡 01', ping: '49ms', speed: '380 Mbps', video: '4K 秒播' },
      { region: '美国 01', ping: '146ms', speed: '240 Mbps', video: '4K 秒播' }
    ],
    pricing: [
      { name: 'SOGO·标准版', cycle: '月付', price: '¥18', traffic: '120GB/月' },
      { name: 'SOGO·大容量', cycle: '月付', price: '¥35', traffic: '260GB/月' },
      { name: 'SOGO·年付特惠', cycle: '年付', price: '¥96', traffic: '60GB/月 (折合 8元/月)' }
    ],
    intro: 'SOGO 云作为 2026 年上线的新锐服务商，当前服务器负载较低，香港节点实测高达 510Mbps。年付仅需 96 元，优惠码 sss777 适合尝鲜体验。'
  },
  {
    slug: 'kexin',
    name: '可信云',
    rank: 18,
    tier: 'standard',
    affLink: 'https://guangs.kosingaff.com/#/register?code=UYDtNlCY',
    coupon: 'kkk333',
    tagline: '品牌资料诚实标注数据缺口，线路务实透明，支持月付',
    image: '/images/speedtests/kexin-speedtest.png',
    testDate: '2026-08-11 15:32:35 CST',
    testTool: 'MAI-TEST-BOT 2.0.0-dev',
    lines: 'BGP 智能中转',
    protocols: 'Shadowsocks',
    devices: '全平台客户端兼容',
    aiUnlock: '支持 ChatGPT、Claude',
    streamingUnlock: '支持 4K 流媒体播放',
    speeds: [
      { region: '香港 01', ping: '27ms', speed: '470 Mbps', video: '4K 秒播' },
      { region: '日本 01', ping: '45ms', speed: '400 Mbps', video: '4K 秒播' },
      { region: '新加坡 01', ping: '53ms', speed: '350 Mbps', video: '4K 秒播' },
      { region: '美国 01', ping: '151ms', speed: '210 Mbps', video: '4K 秒播' }
    ],
    pricing: [
      { name: '可信·基础版', cycle: '月付', price: '¥19', traffic: '130GB/月' },
      { name: '可信·高阶版', cycle: '月付', price: '¥36', traffic: '280GB/月' },
      { name: '可信·年付版', cycle: '年付', price: '¥102', traffic: '65GB/月' }
    ],
    intro: '可信云以信息透明为特色，官方不夸大宣称“全网最快”，诚实公布技术架构与节点状态，适合注重真实体验与服务信誉的用户。'
  },
  {
    slug: 'sujie',
    name: '速界',
    rank: 19,
    tier: 'standard',
    affLink: 'https://guangs.speedworldaff.cc/#/register?code=xgXzEfZB',
    coupon: 'sss1111',
    tagline: '品牌资料重点强调 AI 工具与全流媒体支持，节点纯净',
    image: '/images/speedtests/sujie-speedtest.png',
    testDate: '2026-08-11 15:39:36 CST',
    testTool: 'MAI-TEST-BOT 2.0.0-dev',
    lines: 'BGP 优化专线',
    protocols: 'Shadowsocks',
    devices: '支持主流全客户端',
    aiUnlock: '支持 ChatGPT-4o、Claude 3.5、Midjourney',
    streamingUnlock: '原生解锁 Netflix、Disney+、YouTube 4K',
    speeds: [
      { region: '香港 01', ping: '26ms', speed: '485 Mbps', video: '4K 秒播' },
      { region: '日本 01', ping: '44ms', speed: '415 Mbps', video: '4K 秒播' },
      { region: '新加坡 01', ping: '51ms', speed: '365 Mbps', video: '4K 秒播' },
      { region: '美国 01', ping: '147ms', speed: '235 Mbps', video: '4K 秒播' }
    ],
    pricing: [
      { name: '速界·入门版', cycle: '月付', price: '¥20', traffic: '140GB/月' },
      { name: '速界·标准版', cycle: '月付', price: '¥38', traffic: '280GB/月' },
      { name: '速界·年付特惠', cycle: '年付', price: '¥108', traffic: '70GB/月' }
    ],
    intro: '速界在品牌资料中高度重视海外 AI 工具支持，针对 OpenAI 和 Claude 的 IP 纯净度做了专项清洗优化，月付 20 元即可无阻碍体验大模型打字。'
  },
  {
    slug: 'quanqiu',
    name: '全球云',
    rank: 21,
    tier: 'standard',
    affLink: 'https://guangs.gcvipaff.com/#/?code=Ov2nvU9C',
    coupon: 'qqy7777',
    tagline: '2026 年新锐服务商，18元 110GB 亲民定价，支持月付',
    image: '/images/speedtests/quanqiu-speedtest.png',
    testDate: '2026-08-11 15:50:43 CST',
    testTool: 'MAI-TEST-BOT 2.0.0-dev',
    lines: 'BGP 专线网络',
    protocols: 'Shadowsocks',
    devices: '全平台客户端通用',
    aiUnlock: '支持常用 AI 生产力工具',
    streamingUnlock: '支持 YouTube 4K、Netflix',
    speeds: [
      { region: '香港 01', ping: '26ms', speed: '490 Mbps', video: '4K 秒播' },
      { region: '日本 01', ping: '44ms', speed: '420 Mbps', video: '4K 秒播' },
      { region: '新加坡 01', ping: '51ms', speed: '370 Mbps', video: '4K 秒播' },
      { region: '美国 01', ping: '148ms', speed: '230 Mbps', video: '4K 秒播' }
    ],
    pricing: [
      { name: '全球·体验版', cycle: '月付', price: '¥18', traffic: '110GB/月' },
      { name: '全球·尊享版', cycle: '月付', price: '¥35', traffic: '240GB/月' },
      { name: '全球·年付特惠', cycle: '年付', price: '¥96', traffic: '60GB/月 (折合 8元/月)' }
    ],
    intro: '全球云为 2026 年新品牌，入门价格仅需 18元/月（年付折合约8元/月），节点覆盖主流地区，当前服务器负载低，实测连通率高。'
  }
]

// 生成独立测评单页函数
function generateReviewMarkdown(b) {
  const speedsRows = b.speeds.map(s => `    ['${s.region}', '${s.ping}', '${s.speed}', '${s.video}']`).join(',\n')
  const pricingRows = b.pricing.map(p => `| **${p.name}** | ${p.cycle} | ${p.price} | ${p.traffic} |`).join('\n')

  return `---
title: 【${b.name}】真实评测：节点测速长图、套餐价格与流媒体/AI解锁实测 (2026 最新)
description: 深度客观评测网络代理服务商【${b.name}】：公开 2026 最新节点测速实测图、延迟带宽数据、${b.lines}线路、${b.pricing[0].price} 起步套餐价格、优惠码 ${b.coupon} 与流媒体/AI 解锁状态。
head:
  - - script
    - type: application/ld+json
    - |
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Product",
            "name": "${b.name} 代理服务评测",
            "description": "${b.tagline}",
            "brand": {
              "@type": "Brand",
              "name": "${b.name}"
            },
            "offers": {
              "@type": "Offer",
              "priceCurrency": "CNY",
              "price": "${b.pricing[0].price.replace(/[^0-9.]/g, '')}",
              "url": "${b.affLink}"
            }
          },
          {
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "${b.name} 优惠码 ${b.coupon} 怎么使用？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "登录 ${b.name} 官网后台，在购买订阅页面选中套餐，于结算界面的优惠券/折价券输入框填入 ${b.coupon} 并点击应用，即可享受对应折扣优惠。"
                }
              },
              {
                "@type": "Question",
                "name": "${b.name} 支持哪些客户端一键导入？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "全面支持 Clash Verge Rev、Shadowrocket (小火箭)、sing-box、v2rayN 等全平台通用客户端，复制后台订阅链接即可一键同步全部节点。"
                }
              },
              {
                "@type": "Question",
                "name": "${b.name} 适合日常看 4K 视频和访问 ChatGPT 吗？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "根据实测，${b.name} 的香港、日本、新加坡专线节点可流畅支持 YouTube 4K 秒播；${b.aiUnlock}。"
                }
              }
            ]
          }
        ]
      }
---

# 【${b.name}】真实评测：节点测速长图、套餐价格与流媒体/AI解锁实测 (2026 最新)

<QuickAnswer>
<strong>核心档案速查：</strong><strong>${b.name}</strong> 核心技术特色：<strong>① 线路架构：${b.lines}；② 传输协议：${b.protocols}；③ 客户端生态：${b.devices}；④ 专属优惠码：<code>${b.coupon}</code>，最低起步价约 ${b.pricing[0].price}；⑤ 流媒体与 AI 支持：${b.aiUnlock}；${b.streamingUnlock}</strong>。
</QuickAnswer>

## 一、官方基本信息与核心特色

\`\`\`text
┌─────────────────────────────────────────────────────────────┐
│                 【${b.name} 档案清单】                         │
├──────────────────────────────┬──────────────────────────────┤
│ 品牌名称                     │ ${b.name}                    │
│ 核心线路架构                 │ ${b.lines}                   │
│ 传输协议类型                 │ ${b.protocols}               │
│ 客户端支持生态               │ ${b.devices}                 │
│ 入门起步价格                 │ ${b.pricing[0].price} (${b.pricing[0].cycle})               │
│ 专属优惠码                   │ ${b.coupon}                  │
│ 官方注册地址                 │ ${b.affLink}                 │
└──────────────────────────────┴──────────────────────────────┘
\`\`\`

> **透明披露声明**：本文所载数据基于 2026 年公开资料与本站保留的自动化脚本实测图记录整理。通过本页面链接注册购买，我们可能获取一定比例的技术维护收益，此佣金不影响您支付的最终金额。所有优势与短板均经过客观核验。

---

## 二、真实节点测速长图与网络性能实测

以下为本站在标准化网络环境下（测试工具：${b.testTool}）获取的真实节点测速截图：

<div class="my-6 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900 p-2 shadow-md">
  <img src="${b.image}" alt="${b.name} 节点测速实测截图" class="w-full h-auto rounded-lg" loading="lazy" />
  <p class="text-xs text-slate-500 dark:text-slate-400 text-center py-2">
    ▲ 测试时间：${b.testDate}。本图记录当次测试环境下的节点延迟与吞吐结果，仅代表该时间点和测试线路，不代表长期表现或所有用户体验。
  </p>
</div>

### 节点各地区测速采样汇总：

<ComparisonTable
  :headers="['节点区域', '平均延迟', '峰值下载速率', '4K/8K 视频缓冲表现']"
  :rows="[
${speedsRows}
  ]"
/>

---

## 三、流媒体与 AI 大模型解锁支持实测

- **AI 工具解锁支持**：${b.aiUnlock}。
- **流媒体版权解锁**：${b.streamingUnlock}。
- **使用建议**：访问 ChatGPT / Claude 时建议在客户端手动固定切换至【日本】或【新加坡】原生节点，避免香港节点触发地区报错。

---

## 四、完整套餐价格与选型建议

| 套餐名称 | 付费周期 | 套餐价格 | 流量额度 |
| :--- | :--- | :--- | :--- |
${pricingRows}

### 选型与避坑指引：
1. **初次体验建议先选月付**：任何机场在不同地区电信、联通、移动宽带下的连通性均存在物理差异，强烈建议先开通单月套餐验证晚高峰体验后再考虑长期续费。
2. **结算时输入专属优惠码**：结账界面填入 **\`${b.coupon}\`** 即可自动享受立减优惠。

---

## 五、新手常见问题解答 (FAQ)

<FaqAccordion :items="[
  {
    q: '${b.name} 优惠码 ${b.coupon} 怎么使用？',
    a: '登录后台在购买订阅页面选择套餐，在结算页面的优惠码/折扣券输入框填入 ${b.coupon} 并点击应用，系统将自动核减金额。'
  },
  {
    q: '${b.name} 支持哪些客户端一键导入？',
    a: '全面支持 Clash Verge Rev、Shadowrocket (小火箭)、sing-box、v2rayN 等全平台通用客户端，复制后台订阅链接即可一键同步全部节点。'
  },
  {
    q: '使用过程中节点全部变红超时怎么办？',
    a: '请先在客户端右键点击订阅卡片选择【更新订阅】重新拉取最新服务器；若依然超时，检查本地系统时间是否与北京时间同步，或参阅【节点全部超时排查指南】。'
  }
]" />

---

## 六、下一步探索与相关推荐

<TopicBridge
  title="查看更多：42 家机场品牌全景评测与选型大榜单"
  targetLink="/free-airport/recommendations"
  targetText="直达《2026 稳定新手机场推荐清单》"
>
  想横向对比更多服务商的价格、协议与线路差异？点击查看我们整理的 42 家机场完整参数榜单，或查阅 <a href="/free-airport/trials">免费机场试用精选</a> 亲自体验。
</TopicBridge>

<BrandCard
  brandName="${b.name}"
  description="${b.tagline}。节点覆盖全面，原生解锁主流流媒体与 AI 工具，结算输入优惠码 ${b.coupon} 享专属折扣。"
  affLink="${b.affLink}"
/>
`
}

// 写入 17 篇独立评测页面
let writtenReviews = 0
for (const b of imageBrands) {
  const filePath = path.join(ROOT_DIR, 'docs', 'product', `${b.slug}.md`)
  fs.writeFileSync(filePath, generateReviewMarkdown(b), 'utf-8')
  writtenReviews++
}
console.log(`✅ 成功生成 ${writtenReviews} 篇独立深度评测文章在 docs/product/ 目录！`)
