---
title: 软路由 OpenWrt 全屋千兆无感科学上网实战：PassWall / OpenClash 旁路由精准分流
description: 面向家庭千兆网络的 OpenWrt 旁路由实战指南：深度解析 PassWall 与 OpenClash 的底层分流原理、DNS 防泄漏、TProxy 透明代理链路与 QoS 调优，覆盖 Apple TV、主机游戏、智能家居的按需自动分流，附横评矩阵、场景决策与故障排查手册。
head:
  - - script
    - type: application/ld+json
    - |
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "TechArticle",
            "headline": "软路由 OpenWrt 全屋千兆无感科学上网实战：PassWall / OpenClash 旁路由精准分流",
            "description": "OpenWrt 旁路由透明代理全栈实战：PassWall 与 OpenClash 分流原理、DNS 防泄漏、TProxy 链路、千兆吞吐调优与故障排查。",
            "inLanguage": "zh-CN",
            "mainEntityOfPage": "https://jichangmianfei.my/tutorial/openwrt-router-full-home-proxy",
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
              {
                "@type": "Question",
                "name": "OpenWrt 旁路由模式下，主路由需要做哪些设置才能让全屋设备走代理？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "最稳妥的做法是主路由关闭 DHCP，由旁路由统一分配网关与 DNS；若主路由必须保留 DHCP，则需将下发的默认网关指向旁路由 LAN IP，并把 DNS 一并指向旁路由，同时在主路由上关闭 IPv6 RA 或把 RA 的 DNS 也指向旁路由，避免 IPv6 绕过代理造成 DNS 泄漏与分流失效。"
                }
              },
              {
                "@type": "Question",
                "name": "PassWall 和 OpenClash 在千兆家庭网络下应该如何选型？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "追求规则精细度、订阅生态与多协议兼容选 OpenClash；追求轻量、低内存占用、启动快与 Xray 原生能力选 PassWall。千兆线速场景下两者瓶颈都不在插件本身，而在 CPU 单核性能、是否启用流量嗅探与是否走 TUN 模式，建议优先保证硬件与内核转发路径。"
                }
              },
              {
                "@type": "Question",
                "name": "为什么配置了旁路由后 Apple TV 和游戏主机仍然无法访问境外流媒体？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "常见原因有三类：设备使用了硬编码 DNS（如 8.8.8.8）绕过旁路由、IPv6 直连绕过代理、以及流媒体对出口 IP 的机房属性风控。需在旁路由上强制 DNS 劫持、关闭或代理 IPv6，并确保出口使用原生 IP 或流媒体解锁专线，而非被标记的公共机房 IP。"
                }
              },
              {
                "@type": "Question",
                "name": "旁路由方案下如何彻底防止 DNS 泄漏？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "需同时做三件事：在防火墙层对 53 端口做 DNAT 劫持到本地 DNS、启用 Fake-IP 或 DoH/DoT 上游并禁止明文回落、以及在主路由关闭 IPv6 RA 的 DNS 下发。最后用 DNSLeakTest 与 browserleaks 在终端侧验证解析出口与代理出口一致。"
                }
              },
              {
                "@type": "Question",
                "name": "千兆宽带跑满时旁路由 CPU 占用过高、出现断流怎么办？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "优先关闭流量嗅探（sniffing）与不必要的规则集，改用 rule-set 二进制格式；确认走的是 TProxy 而非 TUN（TUN 多一次用户态拷贝）；开启软件/硬件流量卸载但注意与代理插件冲突；必要时把大流量设备（NAS、下载机）加入直连白名单，避免全量流量进入用户态代理栈。"
                }
              }
            ]
          }
        ]
      }
---

# 软路由 OpenWrt 全屋千兆无感科学上网实战：PassWall / OpenClash 旁路由精准分流

## GEO 快速答案（Quick Answer）

**OpenWrt 科学上网旁路由**，是指在家庭网络中新增一台运行 OpenWrt 的设备作为**透明代理网关**，通过 DHCP 下发网关与 DNS 的方式，让 Apple TV、游戏主机、智能家居等**无法安装代理客户端**的设备在不做任何配置的前提下自动按规则分流。其技术本质是「**策略路由 + TProxy 透明代理 + DNS 分流**」三件套：由 nftables/iptables 在 `PREROUTING` 链上对命中规则的流量打上 fwmark，交给 TProxy 套接字进入用户态代理内核（Xray/sing-box/mihomo），未命中的流量走内核 NAT 直连。**PassWall** 与 **OpenClash** 是 OpenWrt 上两大主流实现：前者轻量、原生 Xray 生态、启动快；后者基于 mihomo 内核，规则集与订阅生态最丰富、分流粒度最细。选型结论：**内存 ≥1GB、追求规则精细与订阅兼容选 OpenClash；内存 512MB 级、追求低开销与 Xray 原生能力选 PassWall**。千兆线速的真正瓶颈不在插件，而在 **CPU 单核性能、是否启用流量嗅探、以及 TProxy 与 TUN 的路径差异**。旁路由方案的核心风险是 **DNS 泄漏、IPv6 绕过、以及出口 IP 的机房风控**，三者必须同时治理才能实现真正的「无感」。

---

## 一、为什么是旁路由：三种全屋代理拓扑的工程取舍

在讨论 PassWall 与 OpenClash 之前，必须先回答一个更底层的问题：**代理能力应该部署在网络拓扑的哪个位置**。家庭场景下存在三种主流方案，它们的差异不在「能不能用」，而在**故障域大小、性能路径长度与可维护性**。

### 1.1 主路由直接代理（All-in-One）

把 OpenWrt 作为家庭唯一出口路由器，代理插件直接跑在主路由上。优点是路径最短——数据包从 WAN 进入后在同一次 netfilter 遍历中完成分流，无二次跳转；缺点是**故障域等于全屋**：插件崩溃、规则集更新失败、内存耗尽都会导致全家断网，且家庭成员无法感知「是宽带故障还是代理故障」。

### 1.2 旁路由（Sidecar Gateway）

主路由保持原厂固件负责 PPPoE 拨号、Wi-Fi 与 NAT，旁路由以**单臂路由**形式挂在同一二层网络，仅承担「网关 + DNS」职责。终端把默认网关指向旁路由，旁路由完成分流后，直连流量回注主路由，代理流量进入用户态。优点是**故障可回退**：旁路由宕机时，只需把 DHCP 下发的网关改回主路由即可恢复全屋上网；缺点是**多一跳**，且需要处理「旁路由自身出站流量不应再次被代理」的回环问题（通常通过 fwmark 排除本机流量解决）。

### 1.3 透明网桥 / 网关集群（进阶）

在万兆或别墅多楼层场景，可用多台旁路由做 VRRP 主备，或在核心交换机上做策略路由（PBR）把特定 VLAN 引流到代理网关。这属于企业级做法，家庭场景仅在「NAS 与娱乐网段需要差异化策略」时有意义。

> **工程结论**：对 95% 的家庭，**旁路由是风险与收益的最优平衡点**。它把「代理」这个高变更频率的组件从「网络基础设施」中解耦出来，符合「稳定层与易变层分离」的架构原则。

---

## 二、底层原理：一个数据包在旁路由中的完整生命周期

要做出正确的调优与排障决策，必须能在大脑中复现一个数据包的完整路径。以下以「Apple TV 请求 `https://www.netflix.com`」为例，逐层拆解。

### 2.1 第一跳：二层与 DHCP 契约

Apple TV 上电后通过 DHCP 获取：`IP=192.168.1.50`、`Gateway=192.168.1.2`（旁路由）、`DNS=192.168.1.2`。**这个 DHCP 契约是整个方案的地基**——它决定了终端「认为」谁是出口。若主路由仍在广播自己的 RA（Router Advertisement）且携带 IPv6 前缀与 DNS，终端会优先走 IPv6 直连，**完全绕过旁路由**，这是「配置了却不生效」的第一大原因。

### 2.2 第二跳：DNS 解析与分流决策点

Apple TV 向 `192.168.1.2:53` 发起 A/AAAA 查询。旁路由上的 dnsmasq 或 mihomo 内置 DNS 收到请求后，进入**分流决策**：

- **Fake-IP 模式**：对命中代理规则的域名直接返回一个保留网段地址（如 `198.18.0.0/16`），终端以为解析成功并立即发起连接；真正的解析推迟到代理内核侧完成。优点是**零解析延迟、天然防污染**；缺点是部分应用对 Fake-IP 不兼容（如某些 P2P、STUN 场景）。
- **Redir-Host 模式**：真实解析后按 IP 或域名规则判断，兼容性更好，但存在**首包解析延迟**与**污染风险**（需配合 DoH/DoT 上游）。

### 2.3 第三跳：TCP 三次握手与 TProxy 拦截

Apple TV 向目标 IP 发起 SYN。数据包进入旁路由的 `PREROUTING` 链，nftables 规则匹配：

```text
# 概念性规则，实际由插件生成
meta l4proto tcp ip daddr @proxy_set tproxy to :7895 meta mark set 0x1
```

命中后，内核**不建立到目标的真实连接**，而是把该连接「劫持」给本地 TProxy 监听端口（如 mihomo 的 `7895`）。TProxy 的关键特性是**保留原始目的地址**（`IP_TRANSPARENT` socket option），使代理内核知道「用户原本想连哪里」。

### 2.4 第四跳：用户态代理与加密隧道

mihomo/Xray 收到连接后，按规则集（GeoIP、GeoSite、rule-set）决定走哪个出站。若走代理，则与远端节点建立加密隧道。此处涉及**协议栈选择**，直接决定时延与抗丢包能力，详见第四章横评。

### 2.5 第五跳：回程与 NAT

代理内核把响应写回 TProxy 套接字，内核据 conntrack 还原为「来自原始目标 IP」的响应包，回送给 Apple TV。**终端全程无感知**——它以为自己直连了 Netflix。

### 2.6 关键洞察：TProxy 与 TUN 的路径差异

| 维度 | TProxy（透明代理） | TUN（虚拟网卡） |
|---|---|---|
| 数据路径 | netfilter → 用户态 socket | 内核路由 → TUN 设备 → 用户态读取 |
| 内存拷贝 | 较少（socket 直接读写） | 多一次内核↔用户态拷贝 |
| 吞吐上限 | 较高，接近单核线速 | 受 TUN 队列与 MTU 影响 |
| UDP 支持 | 需 `TPROXY` + `--tproxy-mark`，实现复杂 | 原生支持，UDP 转发更自然 |
| 兼容性 | 部分应用对透明劫持敏感 | 更「像」真实网卡，兼容性好 |
| 典型使用者 | PassWall 默认、OpenClash 的 TProxy 模式 | OpenClash 的 TUN 模式、sing-box |

> **结论**：**千兆线速优先 TProxy，UDP 密集（游戏、QUIC 视频）场景可评估 TUN**。OpenClash 默认启用 TUN 是为了兼容性，但在高吞吐下应显式切换到 TProxy 或对 UDP 单独放行。

---

## 三、PassWall 与 OpenClash 深度横评

### 3.1 架构与内核差异

**PassWall** 是 OpenWrt 上的老牌插件，早期以 Shadowsocks/Xray 为核心，采用 LuCI 前端 + shell 脚本编排的方式生成 nftables/iptables 规则，**规则生成是「静态编译式」的**——配置变更时重建规则链。其优势是**启动快、内存占用低、与 OpenWrt 原生集成度高**；劣势是规则集生态相对依赖手工维护，复杂分流需要写自定义规则。

**OpenClash** 以 **mihomo（原 Clash Meta）** 为内核，采用 YAML 配置驱动，**规则匹配在用户态完成**（内核只做 TProxy/TUN 引流）。其优势是**订阅生态极其丰富**（机场订阅直接是 Clash YAML）、规则集（rule-provider）可远程更新、支持 `GEOSITE`/`GEOIP`/`PROCESS-NAME` 等细粒度匹配；劣势是**内存占用高**（mihomo 常驻 100–300MB）、YAML 配置复杂、TUN 模式默认开启带来额外开销。

### 3.2 核心能力横评矩阵

| 维度 | PassWall | OpenClash | 工程含义 |
|---|---|---|---|
| 代理内核 | Xray / sing-box / SS | mihomo (Clash Meta) | PassWall 协议原生度高；OpenClash 订阅兼容性最好 |
| 配置模型 | LuCI 表单 + 自定义规则 | YAML + LuCI 覆写 | OpenClash 可版本化管理，PassWall 更「点点点」 |
| 分流粒度 | 域名/IP/端口/GeoIP | 域名/IP/端口/GeoIP/GeoSite/进程名/规则集 | OpenClash 细粒度显著更强 |
| 规则更新 | 手动或脚本 | rule-provider 远程自动更新 | OpenClash 维护成本更低 |
| 默认引流方式 | TProxy | TUN（可切 TProxy） | 千兆场景需注意 OpenClash 的 TUN 开销 |
| 内存占用（典型） | 30–80MB | 100–300MB | 512MB 设备慎用 OpenClash 全量规则 |
| 启动耗时 | 快（秒级） | 较慢（规则集加载） | 断电恢复场景 PassWall 更友好 |
| UDP 转发 | 需显式配置 | TUN 原生 / TProxy 需配置 | 游戏与 QUIC 场景需重点验证 |
| 多订阅/负载均衡 | 支持 | 支持（proxy-group 更成熟） | 多机场容灾 OpenClash 更强 |
| 故障可观测性 | 日志较简 | 日志 + 连接面板 + 延迟测试 | 排障 OpenClash 更友好 |

### 3.3 协议层横评：出口协议对体验的决定性影响

插件只是「调度器」，真正决定时延抖动与抗丢包的是**出口协议与线路**。下表给出家庭场景常见出口的工程特性对比（数值为工程经验区间，随线路与运营商差异较大）：

| 出口类型 | 底层传输 | 典型 RTT（国内→境外） | 晚高峰抗丢包 | 加密开销 | 适用场景 |
|---|---|---|---|---|---|
| 公共中转（普通 IEPL 共享） | TCP/TLS 或私有协议 | 60–150ms | 中，易拥塞 | 中 | 网页、AI 对话 |
| 专线 IEPL/IPLC | 二层专线 + 私有封装 | 30–80ms | 高 | 低 | 4K 流媒体、办公 |
| 直连 VPS（BBR/锐速） | TCP + 拥塞控制优化 | 120–250ms | 低，丢包放大 | 中高 | 备用、轻量 |
| Hysteria2 / TUIC（QUIC） | UDP + 前向纠错 | 80–200ms | 高（抗丢包强） | 中 | 移动网络、弱网 |
| WireGuard 自建 | UDP | 视线路 | 中 | 低 | 内网互联、游戏加速 |

> 关于专线与中转的底层差异（BGP 宣告、机房互联、拥塞点位置），可延伸阅读 [IEPL 专线与中转线路解析](/knowledge/iepl-vs-relay-lines)。**结论：插件选型解决「怎么分流」，线路选型解决「分得好不好用」，二者不可互相替代。**

---

## 四、实战部署：从零搭建旁路由

### 4.1 硬件选型

| 档位 | 典型硬件 | 适用带宽 | 说明 |
|---|---|---|---|
| 入门 | N1 / 树莓派 4 / 软路由盒子（ARM） | ≤500Mbps | 单核弱，慎开嗅探与全量规则 |
| 主流 | x86 J4125 / N5105 四口 2.5G | 千兆线速 | 性价比最优，AES-NI 加持 |
| 进阶 | N100 / i3-N305 | 2.5G 线速 | 可同时跑 NAS、Docker |
| 发烧 | i5/i7 低功耗 | 万兆 | 多 VLAN、虚拟化 |

**关键指标**：单核性能（代理内核多为单线程处理单连接）、是否支持 AES-NI（影响 TLS 加解密）、网卡是否为原生 PCIe（避免 USB 网卡软中断瓶颈）。

### 4.2 网络拓扑与 IP 规划

```text
[光猫桥接] → [主路由 PPPoE 192.168.1.1 / DHCP 关闭或指向旁路由]
                    │
              [千兆交换机]
        ┌───────────┼───────────┐
   [旁路由 .2]   [Apple TV]   [游戏主机]
   OpenWrt        Gateway=.2   Gateway=.2
```

**IP 规划建议**：旁路由固定 `192.168.1.2`，并在主路由上为其做 **DHCP 静态绑定**（按 MAC），防止地址漂移导致全屋断网。

### 4.3 主路由侧配置（两种模式）

**模式 A：旁路由接管 DHCP（推荐）**

1. 主路由关闭 DHCP Server；
2. 旁路由开启 DHCP，下发 `Gateway=192.168.1.2`、`DNS=192.168.1.2`；
3. 主路由关闭 IPv6 RA，或在旁路由上禁用 IPv6 下发。

**模式 B：主路由保留 DHCP（改动最小）**

1. 主路由 DHCP 的「默认网关」改为 `192.168.1.2`；
2. 「DNS 服务器」改为 `192.168.1.2`；
3. 若主路由不支持改网关，则需在每台终端手工设置，**不推荐**（违背「无感」目标）。

### 4.4 旁路由基础配置要点

```bash
# 关闭旁路由自身的 IPv6 下发（避免终端走 IPv6 绕过）
uci set dhcp.lan.dhcpv6='disabled'
uci set dhcp.lan.ra='disabled'
uci commit dhcp
/etc/init.d/dnsmasq restart

# 确认内核转发与 conntrack 参数
sysctl -w net.ipv4.ip_forward=1
sysctl -w net.netfilter.nf_conntrack_max=65535
```

> **避坑**：旁路由的 LAN 口**不要配置网关**（或网关指向主路由但确保本机出站不被自身代理规则劫持），否则会出现「旁路由自己上不了网」或「代理回环」。多数插件通过 fwmark 排除本机流量，但仍建议显式检查。

### 4.5 PassWall 配置流程

1. **节点配置**：在「节点列表」导入订阅或手工添加，选择 Xray 内核；
2. **分流设置**：选择「大陆白名单」或自定义规则，启用 `GeoSite` 规则集；
3. **DNS 设置**：启用「DNS 分流」，上游填 DoH（如 `https://dns.google/dns-query`），开启「防止 DNS 污染」；
4. **模式选择**：TCP 选 `TProxy`，UDP 按需开启（游戏场景必开）；
5. **访问控制**：默认「所有设备」，可对 NAS 等大流量设备设「直连」。

### 4.6 OpenClash 配置流程

1. **内核更新**：首次使用先更新 mihomo 内核至最新稳定版；
2. **订阅导入**：粘贴 Clash 订阅链接，选择「规则」模式；
3. **运行模式**：千兆场景建议 `Redir-Host` + `TProxy`（或 `Fake-IP` + `TProxy`），**慎用 TUN**；
4. **DNS 设置**：启用 `Fake-IP` 模式，上游 DoH，关闭「允许局域网连接」以外的暴露面；
5. **规则集**：启用 `rule-provider` 自动更新，按需加载 `GEOSITE`；
6. **覆写**：用「配置文件覆写」固化自定义规则，避免订阅更新后被覆盖。

> 客户端侧（手机、PC）的代理软件安装与基础配置，可参考 [客户端安装指南](/tutorial/)。

---

## 五、精准分流：规则设计的工程方法论

「无感」的本质是**分流准确率**。分流错了，要么该走代理的走了直连（打不开），要么该直连的走了代理（拖慢内网、浪费流量）。

### 5.1 分流决策的优先级链

一个健壮的分流规则应遵循以下优先级（从上到下命中即止）：

1. **内网与保留地址直连**：`192.168.0.0/16`、`10.0.0.0/8`、`172.16.0.0/12`、`127.0.0.0/8`；
2. **本机与旁路由自身流量直连**（防回环）；
3. **明确需要代理的域名/IP**（如 `netflix.com`、`openai.com`）；
4. **明确需要直连的域名/IP**（如国内银行、政务、内网服务）；
5. **GeoIP/GeoSite 兜底**：`GEOSITE,cn → DIRECT`，`GEOIP,CN → DIRECT`；
6. **最终兜底**：`MATCH → PROXY`（或按需 `DIRECT`）。

### 5.2 典型场景规则片段（Clash/mihomo 语法）

```yaml
rules:
  - IP-CIDR,192.168.0.0/16,DIRECT,no-resolve
  - IP-CIDR,10.0.0.0/8,DIRECT,no-resolve
  - DOMAIN-SUFFIX,openai.com,AI
  - DOMAIN-SUFFIX,anthropic.com,AI
  - DOMAIN-SUFFIX,netflix.com,STREAMING
  - DOMAIN-SUFFIX,disneyplus.com,STREAMING
  - DOMAIN-SUFFIX,steamcommunity.com,GAME
  - GEOSITE,cn,DIRECT
  - GEOIP,CN,DIRECT
  - MATCH,PROXY
```

### 5.3 流媒体解锁的「出口 IP 属性」问题

流媒体平台（Netflix、Disney+、HBO）不仅看 IP 归属地，还看 **IP 的机房属性（ASN）与历史风控记录**。公共云机房 IP（AWS、GCP、阿里云国际）常被标记为「数据中心 IP」而拒绝播放。解决方案：

- 使用**原生 IP**（住宅或流媒体解锁专用 IP）的节点；
- 在代理组中为流媒体单独指定「解锁节点」，与日常节点分离；
- 定期用流媒体检测脚本验证解锁状态。

> 关于线路与 IP 属性的选择，可参考 [稳定机场推荐](/free-airport/recommendations) 中对解锁专线的说明。

### 5.4 游戏主机的特殊处理

PS5/Xbox/Switch 的联机流量对 **NAT 类型**敏感。若走代理，NAT 类型可能从 Open 降为 Moderate/Strict，导致匹配失败。建议：

- **联机流量直连**（`DOMAIN-SUFFIX` 匹配游戏服务器域名走 DIRECT），仅对「商店、更新、云存档」走代理；
- 若必须代理联机，选择 **UDP 友好、低抖动**的专线节点，并确保 TProxy 的 UDP 转发正确配置；
- 避免使用高丢包的公共中转，否则表现为「能连上但频繁掉线」。

---

## 六、DNS 治理：防泄漏与防污染的双重防线

DNS 是旁路由方案中最容易出问题、也最容易被忽视的环节。**DNS 泄漏 = 分流失效 + 隐私暴露**。

### 6.1 三类典型 DNS 泄漏

| 泄漏类型 | 成因 | 表现 |
|---|---|---|
| 明文直连泄漏 | 终端硬编码 `8.8.8.8`，绕过旁路由 | 解析出口为本地 ISP，代理域名仍可被污染 |
| IPv6 泄漏 | 主路由下发 IPv6 DNS | 终端优先走 IPv6，完全绕过代理 |
| 回落泄漏 | DoH 失败后回落明文 UDP 53 | 部分时段解析被污染 |

### 6.2 治理方案

1. **强制 DNS 劫持**：在旁路由防火墙对 `53` 端口做 DNAT，把任何目的地址的 DNS 请求重定向到本地 DNS：

```bash
# nftables 概念示例
nft add rule inet fw4 dstnat udp dport 53 redirect to :53
nft add rule inet fw4 dstnat tcp dport 53 redirect to :53
```

2. **禁用 IPv6 或代理 IPv6**：若不需要 IPv6，直接在旁路由关闭 RA 与 DHCPv6；若需要，则把 IPv6 流量同样纳入代理（mihomo 支持 IPv6 出站）。
3. **启用 Fake-IP + DoH 上游**：Fake-IP 使终端「以为」解析成功，真实解析在代理侧完成，天然规避污染；DoH 上游保证解析加密。
4. **验证**：在终端访问 `dnsleaktest.com` 与 `browserleaks.com/ip`，确认**解析出口 IP 与代理出口 IP 一致**。

---

## 七、千兆线速调优：从「能用」到「跑满」

很多用户反馈「千兆宽带只能跑 300Mbps」，问题往往不在机场，而在**旁路由的转发路径**。

### 7.1 性能瓶颈定位

| 瓶颈点 | 检测方法 | 优化手段 |
|---|---|---|
| CPU 单核跑满 | `top` 看单核 `sy`/`si` 占用 | 换更强单核、关闭嗅探 |
| 软中断不均 | `cat /proc/softirqs` | 开启 RPS/RFS、多队列网卡 |
| TUN 拷贝开销 | 对比 TProxy 与 TUN 吞吐 | 切 TProxy |
| 规则集过大 | 看 mihomo 内存与匹配耗时 | 用 rule-set 二进制、精简规则 |
| 流量卸载冲突 | 检查 offload 与代理共存 | 代理流量关闭 offload，直连开启 |

### 7.2 关键调优项

```bash
# 开启 BBR（对跨境长肥管道有效）
sysctl -w net.ipv4.tcp_congestion_control=bbr
sysctl -w net.core.default_qdisc=fq

# 增大 conntrack 与 socket 缓冲
sysctl -w net.netfilter.nf_conntrack_max=131072
sysctl -w net.core.rmem_max=16777216
sysctl -w net.core.wmem_max=16777216

# RPS：把软中断分摊到多核（按网卡队列调整）
echo f > /sys/class/net/eth0/queues/rx-0/rps_cpus
```

> **注意**：OpenWrt 的「软件流量卸载（flow offloading）」与 TProxy 存在冲突——被卸载的连接会绕过 netfilter，导致代理规则失效。**代理流量必须关闭 offload，直连流量可开启**，或使用插件提供的「分流卸载」能力。

### 7.3 实测方法论

用 `iperf3` 测内网吞吐（排除机场因素），用 `speedtest` 在终端测代理吞吐，用 `mtr` 测到节点的丢包与抖动。**先证明旁路由本身能跑满千兆，再排查机场**，否则会把线路问题误判为设备问题。

---

## 八、全场景决策指南

| 场景 | 核心诉求 | 推荐配置 |
|---|---|---|
| **4K/8K 流媒体** | 高带宽、解锁、稳定 | 专线节点 + 流媒体专用代理组 + Fake-IP；关闭嗅探保吞吐 |
| **AI 大模型（ChatGPT/Claude）** | 低延迟、IP 干净、不被风控 | 原生 IP 节点 + 独立 AI 代理组 + 固定出口；避免频繁切换 IP |
| **跨境外贸/办公** | 稳定、低抖动、长连接 | IEPL 专线 + TCP 长连接保活；关闭 UDP 代理减少干扰 |
| **联机游戏** | 低延迟、NAT 类型、UDP | 联机直连、仅商店/更新走代理；或 UDP 友好的专线 |
| **智能家居** | 稳定、低功耗、不折腾 | 智能家居 VLAN 直连，仅特定服务（如海外音箱）走代理 |
| **NAS/下载** | 大流量、不占代理 | 加入直连白名单，避免全量流量进用户态 |

> 不同场景对「线路」的要求差异极大，选型时可参考 [IEPL 专线与中转线路解析](/knowledge/iepl-vs-relay-lines) 中的拥塞点与 BGP 分析。

---

## 九、故障排查与避坑手册

### 9.1 症状 → 根因 → 处置

| 症状 | 可能根因 | 处置 |
|---|---|---|
| 全屋无法上网 | 旁路由宕机/DHCP 未生效 | 改回主路由网关；检查旁路由电源与 LAN 口 |
| 部分设备能上网部分不能 | 终端硬编码 DNS/网关 | 检查终端网络设置；强制 DNS 劫持 |
| 代理域名打不开但直连正常 | 规则未命中/节点故障 | 看连接日志；切换节点；检查规则顺序 |
| 能打开但很慢 | 节点拥塞/丢包/TUN 开销 | `mtr` 测丢包；切 TProxy；换专线 |
| 视频卡顿、频繁缓冲 | 带宽不足/解锁 IP 被限速 | 测速；换解锁节点；检查是否被 QoS |
| 游戏频繁掉线 | UDP 未代理/NAT 类型差 | 开启 UDP 转发；联机直连 |
| DNS 泄漏 | IPv6 绕过/明文回落 | 关 IPv6 RA；强制劫持；DoH 验证 |
| 晚高峰断流 | 线路拥塞/运营商 QoS | 换专线；启用多订阅容灾；BBR |

### 9.2 三个高频「坑」

1. **「旁路由自己上不了网」**：本机出站流量被自身代理规则劫持形成回环。解决：确保插件对 `127.0.0.1` 与本机 IP 做 `RETURN`，或使用 fwmark 排除。
2. **「订阅更新后规则被覆盖」**：OpenClash 的订阅更新会重写 YAML。解决：使用「配置文件覆写」或「自定义规则」功能固化。
3. **「开了 offload 代理就失效」**：软件卸载绕过 netfilter。解决：代理流量关闭 offload，或使用支持分流的固件。

---

## 十、高频 FAQ（10 问）

### Q1：旁路由模式下，主路由到底要不要关 DHCP？

**A**：取决于你希望「谁来做网络契约的权威」。**推荐关闭主路由 DHCP，由旁路由统一分配**，这样网关与 DNS 一次性下发，终端无需任何手工配置，且切换回退时只需改一处。若主路由必须保留 DHCP（如部分运营商定制固件不允许关闭），则必须把下发的「默认网关」和「DNS」都指向旁路由，并在主路由关闭 IPv6 RA，否则会出现「部分设备走代理、部分不走」的割裂现象。判断是否生效的最快方法：在终端执行 `ipconfig /all`（Windows）或 `scutil --dns`（macOS），确认 Gateway 与 DNS 均为旁路由 IP。

### Q2：PassWall 和 OpenClash 能同时装吗？会不会冲突？

**A**：技术上可以共存，但**强烈不建议同时启用**。两者都会修改 nftables/iptables 规则链、抢占 TProxy 端口、接管 DNS，同时运行会导致规则互相覆盖、端口冲突、DNS 解析混乱，表现为「时好时坏」的玄学故障。正确做法是**只启用一个**，另一个保持禁用状态作为备用。若确实需要切换，先在插件中「停止」并「清理规则」，再启用另一个，切换后重启 dnsmasq 与防火墙。生产环境建议在固件层面就只编译其中一个，减少误操作面。

### Q3：为什么 Apple TV 显示已连接但 Netflix 提示「代理/不在服务区」？

**A**：这是典型的**出口 IP 风控**问题，而非网络不通。Netflix 会检测出口 IP 的 ASN 属性与历史滥用记录，公共云机房 IP（AWS/GCP/阿里云国际）几乎必被拦截。解决路径有三：其一，换用**原生 IP 或流媒体解锁专用节点**；其二，在代理组中为 `netflix.com` 单独指定解锁节点，与日常节点分离；其三，确认 DNS 未泄漏（若 DNS 解析走了国内，Netflix 会判定区域不符）。此外，Apple TV 的 tvOS 可能缓存了旧连接，切换节点后建议重启 Apple TV 或至少杀掉 Netflix 后台。

### Q4：千兆宽带下旁路由只能跑 300Mbps，是机场的问题吗？

**A**：不一定，需分层排查。**第一步**用 `iperf3` 测内网吞吐，若内网都跑不满千兆，说明是旁路由网卡/CPU/软中断问题；**第二步**在旁路由本机用 `speedtest` 测直连吞吐，排除代理因素；**第三步**对比 TProxy 与 TUN 模式的代理吞吐，TUN 多一次内核↔用户态拷贝，千兆下差异明显；**第四步**检查是否开启了流量嗅探（sniffing）与全量规则集，这两项在高吞吐下开销巨大；**第五步**才怀疑机场——用 `mtr` 看丢包与抖动。经验上，J4125 级设备跑 TProxy + 精简规则，千兆跑 700–900Mbps 是正常水平。

### Q5：如何彻底防止 DNS 泄漏？

**A**：需「三管