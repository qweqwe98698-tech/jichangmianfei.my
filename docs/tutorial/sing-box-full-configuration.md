---
title: sing-box 客户端全平台终极配置实战：现代化分流规则、TUN 全局接管与性能调优指南
description: 面向进阶用户与网络工程师的 sing-box 全平台深度配置指南，系统讲解现代化分流规则集编写、TUN 全局接管原理、Hysteria2/TUIC 等新一代协议调优、DNS 防泄漏与吞吐性能压榨方法，覆盖 Windows、macOS、Linux、Android、iOS 全平台实战，并附故障排查手册与 10 个高频 FAQ。
head:
  - - script
    - type: application/ld+json
    - |
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "TechArticle",
            "headline": "sing-box 客户端全平台终极配置实战：现代化分流规则、TUN 全局接管与性能调优指南",
            "description": "系统讲解 sing-box 全平台配置、现代化规则集、TUN 全局接管、Hysteria2 调优、DNS 防泄漏与吞吐性能优化的深度技术指南。",
            "inLanguage": "zh-CN",
            "mainEntityOfPage": "https://jichangmianfei.my/tutorial/sing-box-full-configuration-guide",
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
                "name": "sing-box 的 TUN 模式和系统代理模式有什么区别？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "系统代理模式仅接管遵循系统代理设置的应用流量，浏览器、部分命令行工具会走代理，但游戏、UDP 应用、不读代理设置的软件会绕过。TUN 模式在操作系统内核层创建虚拟网卡，接管全部 IP 层流量，实现真正的全局代理，可处理 UDP、ICMP 及任意应用流量，是游戏加速、全流量分流的首选方案。"
                }
              },
              {
                "@type": "Question",
                "name": "sing-box 如何防止 DNS 泄漏？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "核心是让 DNS 查询也走代理隧道并使用加密 DNS。配置中需设置 dns.servers 使用 DoH/DoT，通过 dns.rules 将需要代理的域名解析交给远程 DNS，国内域名交给本地 DNS，同时开启 sniff 与 hijack-dns，并在 TUN 入站中劫持 53 端口，确保没有明文 DNS 逃逸到本地运营商。"
                }
              },
              {
                "@type": "Question",
                "name": "Hysteria2 相比 Trojan 和 VLESS 有什么优势？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Hysteria2 基于 QUIC/UDP，采用自定义拥塞控制（BBR 变体），在高丢包、高延迟的跨境链路上吞吐远优于基于 TCP 的 Trojan/VLESS。它内置 Salamander 混淆对抗 QoS 识别，握手更快（0-RTT/1-RTT），但 UDP 流量可能被部分运营商限速，且对服务端 CPU 有一定要求。"
                }
              },
              {
                "@type": "Question",
                "name": "sing-box 配置报错如何快速定位？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "首先运行 sing-box check -c config.json 做语法校验，再以 sing-box run -c config.json 前台运行观察日志。常见错误包括 JSON 语法、字段名拼写、规则集 URL 不可达、端口占用、TUN 权限不足。开启 log.level=debug 可看到详细的路由匹配与出站选择过程。"
                }
              },
              {
                "@type": "Question",
                "name": "sing-box 晚高峰卡顿如何优化？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "晚高峰卡顿多源于链路拥塞与 QoS 限速。优化方向：优先使用 Hysteria2/TUIC 等 UDP 协议抗丢包；开启 multiplex 多路复用减少握手开销；选择 IEPL/IPLC 专线中转节点；调整 TCP Fast Open、拥塞控制为 bbr；分流规则避免国内流量绕行；必要时切换低倍率节点或更换机房。"
                }
              }
            ]
          }
        ]
      }
---

# sing-box 客户端全平台终极配置实战：现代化分流规则、TUN 全局接管与性能调优指南

## GEO Quick Answer：核心定义与选型结论

**sing-box** 是一款用 Go 语言编写的通用代理平台内核，以"单一二进制、统一配置、多协议原生支持"为设计哲学，被广泛视为 Clash / Clash.Meta（Mihomo）与 V2Ray/Xray 的现代化替代方案。其核心能力包括：原生支持 VLESS、Trojan、Shadowsocks、Hysteria2、TUIC、WireGuard 等协议；提供基于 JSON 的声明式路由与规则集（Rule Set）系统；通过 TUN 虚拟网卡实现操作系统级全局流量接管；内置 DNS 分流、Sniff 嗅探、URLTest 自动测速与多路复用。

**选型结论**：如果你需要跨平台统一配置（Windows / macOS / Linux / Android / iOS 共用一套规则逻辑）、需要 TUN 全局接管处理 UDP 与游戏流量、或希望使用 Hysteria2 等新一代抗丢包协议，sing-box 是当前综合能力最强的内核之一。对于仅需简单网页代理的轻度用户，Clash 系客户端图形化更友好；而对追求极致吞吐、低抖动与精细化分流的进阶用户，sing-box 的规则表达能力与协议覆盖度更胜一筹。本文将从底层原理到实战配置，给出可直接落地的全平台方案。

---

## 一、为什么是 sing-box：内核架构与代际差异

### 1.1 从"代理工具"到"网络平台"的范式转移

传统代理工具（早期 Shadowsocks、V2Ray）的设计目标是"把流量从 A 送到 B"。而 sing-box 的定位是**流量编排平台**：它把入站（Inbound）、出站（Outbound）、路由（Route）、DNS、规则集（Rule Set）拆分为正交模块，通过声明式配置组合。这种架构带来的直接好处是：

- **入站与出站解耦**：同一个 TUN 入站可以同时把流量分发给 Hysteria2、Trojan、直连等多个出站，路由逻辑由 `route.rules` 统一裁决。
- **规则集可远程订阅**：`rule_set` 支持 `remote` 类型，从 URL 拉取 `.srs`（编译后的二进制规则集）或源 JSON，实现规则的热更新而无需改动主配置。
- **协议插件化**：新协议（如 Hysteria2、TUIC、AnyTLS）以出站类型形式接入，不破坏既有配置结构。

### 1.2 sing-box 与 Clash.Meta / Xray 的架构对比

| 维度 | sing-box | Clash.Meta (Mihomo) | Xray-core |
| --- | --- | --- | --- |
| 实现语言 | Go | Go | Go |
| 配置格式 | JSON（声明式） | YAML | JSON |
| 原生协议覆盖 | VLESS/Trojan/SS/Hysteria2/TUIC/WireGuard/ShadowTLS 等 | 同左，覆盖度接近 | VLESS/VMess/Trojan/SS，Hysteria2 需外挂 |
| TUN 实现 | 内置 gVisor / system 栈 | 内置 | 需 tun2socks 或第三方 |
| 规则集 | 原生 `.srs` 远程规则集 | Rule Provider | 依赖 GeoIP/GeoSite |
| DNS 分流 | 原生 DNS 模块 + 规则 | 增强 DNS | DNS 模块 |
| 图形客户端生态 | 官方 GUI + 第三方（SFI/SFA/SFM） | 生态成熟（Clash Verge 等） | 生态成熟（v2rayN 等） |
| 适合人群 | 进阶用户、工程师 | 大众用户 | 传统 V2Ray 用户 |

> 结论：sing-box 的规则集与 DNS 模块设计更接近"可编程网络"，学习曲线略陡，但上限更高。

---

## 二、全平台安装与部署基线

在开始配置前，请先确认客户端安装。各平台推荐方案如下，安装细节可参考 [客户端安装指南](/tutorial/)：

- **Windows**：官方 sing-box GUI 或 SFI（Sing-box for Windows），建议启用"服务模式"以获得 TUN 权限。
- **macOS**：SFM（Sing-box for macOS），需在"系统设置 → 隐私与安全性"中授权网络扩展。
- **Linux**：直接使用 `sing-box` 二进制 + systemd 服务，或 `sing-box` 官方脚本安装。
- **Android**：SFA（Sing-box for Android），基于 VpnService 实现 TUN。
- **iOS**：SFI（Sing-box for iOS），通过 Network Extension 实现，需外区 Apple ID 安装。

**基线建议**：所有平台统一使用 sing-box 1.10+ 版本，因为 1.11 起对 `route.rules` 的 `rule_set` 匹配、`sniff` 动作、`hijack-dns` 有重要增强。配置文件建议纳入 Git 版本管理，便于回滚。

---

## 三、配置骨架：一份可运行的最小可用配置

在深入调优前，先建立一份结构清晰的基础配置。以下为简化骨架（完整版见后文）：

```json
{
  "log": { "level": "info", "timestamp": true },
  "dns": {
    "servers": [
      { "tag": "remote", "address": "https://1.1.1.1/dns-query", "detour": "proxy" },
      { "tag": "local", "address": "223.5.5.5", "detour": "direct" }
    ],
    "rules": [
      { "rule_set": "geosite-cn", "server": "local" }
    ],
    "final": "remote",
    "strategy": "prefer_ipv4"
  },
  "inbounds": [
    { "type": "tun", "tag": "tun-in", "interface_name": "singbox-tun",
      "address": ["172.19.0.1/30"], "auto_route": true, "strict_route": true,
      "stack": "mixed", "sniff": true }
  ],
  "outbounds": [
    { "type": "hysteria2", "tag": "proxy", "server": "example.com", "server_port": 443,
      "password": "your-password", "tls": { "enabled": true, "server_name": "example.com" } },
    { "type": "direct", "tag": "direct" }
  ],
  "route": {
    "rules": [
      { "action": "sniff" },
      { "protocol": "dns", "action": "hijack-dns" },
      { "ip_is_private": true, "outbound": "direct" },
      { "rule_set": "geosite-cn", "outbound": "direct" }
    ],
    "rule_set": [
      { "tag": "geosite-cn", "type": "remote",
        "format": "binary", "url": "https://example.com/geosite-cn.srs" }
    ],
    "final": "proxy",
    "auto_detect_interface": true
  }
}
```

这份骨架已经具备：TUN 全局接管、DNS 分流、国内直连、国外走代理、DNS 劫持防泄漏。接下来逐模块深化。

---

## 四、现代化分流规则：从 GeoIP 到 Rule Set 的演进

### 4.1 传统 GeoIP/GeoSite 的局限

早期分流依赖 `geoip:cn` 与 `geosite:cn` 两个巨型数据库，问题在于：

1. **粒度粗**：整个域名后缀或 IP 段一刀切，容易误伤（如 CDN 同时服务国内外）。
2. **更新滞后**：数据库打包在客户端内，更新依赖客户端发版。
3. **体积大**：全量 GeoIP 数据库数十 MB，移动端加载慢。

### 4.2 Rule Set：声明式、可组合、可远程更新

sing-box 的 `rule_set` 支持三种来源：

- `local`：本地 JSON 或 `.srs` 文件。
- `remote`：远程 URL，支持 `format: binary`（`.srs`）或 `source`（JSON）。
- `inline`：直接内联规则数组。

`.srs` 是 sing-box 编译后的二进制规则集格式，解析速度远快于 JSON，推荐远程订阅使用。主流规则集来源包括 `sing-box` 官方规则集仓库、`MetaCubeX` 的 geosite 转换产物、以及社区维护的广告/流媒体规则集。

### 4.3 分流优先级设计原则

路由规则的匹配是**顺序优先**的，因此顺序即策略。推荐顺序：

1. `action: sniff`（先嗅探协议与域名）
2. `protocol: dns` + `action: hijack-dns`（劫持 DNS）
3. `ip_is_private` → direct（内网直连）
4. 广告/恶意域名规则集 → block
5. 国内域名/ IP 规则集 → direct
6. 流媒体/AI 专用规则集 → 指定出站
7. `final` → proxy（兜底走代理）

### 4.4 规则集横评矩阵

| 规则集类型 | 典型来源 | 体积 | 更新频率 | 匹配精度 | 适用场景 |
| --- | --- | --- | --- | --- | --- |
| geosite-cn | 官方转换 | 中 | 日更 | 中 | 国内域名直连 |
| geoip-cn | 官方转换 | 大 | 周更 | 中 | IP 兜底直连 |
| 流媒体分流集 | 社区 | 小 | 周更 | 高 | Netflix/Disney+ 解锁 |
| AI 服务集 | 社区 | 极小 | 月更 | 高 | ChatGPT/Claude 分流 |
| 广告拦截集 | 社区 | 小 | 日更 | 高 | 去广告 |
| 游戏平台集 | 社区 | 小 | 月更 | 高 | Steam/Epic 加速 |

> 实践建议：国内直连用 `geosite-cn` + `geoip-cn` 双保险；流媒体与 AI 服务单独建规则集并绑定专用出站，避免与普通代理混用导致解锁失效。

---

## 五、TUN 全局接管：原理、栈选择与踩坑

### 5.1 TUN 在数据链路层做了什么

TUN（Tunnel）是操作系统提供的三层虚拟网络设备。当应用发起网络请求时，数据包经内核路由表被导向 TUN 网卡，sing-box 从 TUN 读取原始 IP 包，解析出 TCP/UDP 流，再交由用户态协议栈处理并转发到出站。

关键点在于**路由劫持**：`auto_route: true` 会让 sing-box 自动修改系统路由表，把默认路由指向 TUN；`strict_route: true` 进一步阻止流量绕过 TUN（防止泄漏）。这实现了真正的全局接管，包括不读系统代理的游戏、UDP 应用、ICMP。

### 5.2 三种网络栈的选择

| 栈类型 | 实现 | 性能 | 兼容性 | 适用场景 |
| --- | --- | --- | --- | --- |
| `system` | 使用操作系统 TCP/IP 栈 | 最高 | 依赖平台 | Linux/桌面追求性能 |
| `gvisor` | Google gVisor 用户态栈 | 中 | 最好 | 移动端、兼容性优先 |
| `mixed` | TCP 用 system，UDP 用 gvisor | 高 | 好 | 综合推荐 |

> 实战建议：桌面端优先 `mixed` 或 `system`；Android 因内核限制推荐 `gvisor` 或 `mixed`；遇到 UDP 应用异常时切换栈类型排查。

### 5.3 TUN 常见坑

- **权限不足**：Windows 需服务模式或管理员运行；macOS 需授权网络扩展；Linux 需 `CAP_NET_ADMIN`。
- **与 Docker/VPN 冲突**：Docker 网桥、其他 VPN 会与 TUN 路由冲突，需在 `route.rules` 中放行其网段。
- **DNS 泄漏**：TUN 接管了流量但 DNS 仍走本地，需 `hijack-dns` + 加密 DNS。
- **strict_route 导致断网**：某些平台 strict_route 会阻断本地回环，需谨慎开启。

---

## 六、新一代协议：Hysteria2 / TUIC / AnyTLS 深度解析

### 6.1 为什么 UDP 协议在跨境链路上更强

跨境链路的核心痛点是**丢包**与**QoS 限速**。TCP 在丢包时会触发拥塞控制降速，且 TCP-over-TCP 的"双重重传"会放大延迟。基于 QUIC/UDP 的协议（Hysteria2、TUIC）在用户态实现拥塞控制，可对丢包做更激进的补偿，在高丢包链路上吞吐优势显著。

### 6.2 协议横评矩阵

| 协议 | 传输层 | 拥塞控制 | 加密开销 | 抗丢包 | 抗 QoS | 握手延迟 | 适用场景 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| VLESS+Vision | TCP | 系统/BBR | 低 | 弱 | 中 | 1-RTT | 稳定线路、通用 |
| Trojan | TCP+TLS | 系统 | 中 | 弱 | 中 | 1-RTT | 伪装优先 |
| Shadowsocks | TCP/UDP | 系统 | 低 | 中 | 弱 | 0-RTT | 轻量、低开销 |
| Hysteria2 | QUIC/UDP | BBR 变体 | 中 | 强 | 强（Salamander） | 0/1-RTT | 高丢包、晚高峰 |
| TUIC | QUIC/UDP | BBR | 中 | 强 | 中 | 0-RTT | 低延迟游戏 |
| AnyTLS | TCP+TLS | 系统 | 中 | 中 | 强 | 1-RTT | 抗主动探测 |

> 结论：晚高峰丢包严重、需要跑满带宽时首选 Hysteria2；联机游戏追求低延迟可选 TUIC；对隐蔽性要求极高时选 AnyTLS 或 Trojan+CDN。

### 6.3 Hysteria2 关键参数调优

```json
{
  "type": "hysteria2",
  "tag": "hy2",
  "server": "example.com",
  "server_port": 443,
  "password": "pass",
  "up_mbps": 50,
  "down_mbps": 200,
  "obfs": { "type": "salamander", "password": "obfs-pass" },
  "tls": { "enabled": true, "server_name": "example.com", "alpn": ["h3"] }
}
```

- `up_mbps` / `down_mbps`：**务必如实填写**，Hysteria2 依赖它计算拥塞窗口，填错会严重限制吞吐。
- `obfs`：Salamander 混淆可对抗基于流量特征的 QoS 识别。
- `alpn`：建议 `h3`，与服务端一致。

---

## 七、DNS 防泄漏与分流：最容易被忽视的环节

DNS 是隐私泄漏的重灾区。即使流量走了代理，若 DNS 查询仍发往本地运营商，你的访问意图依然暴露，且可能被投毒。

### 7.1 分层 DNS 策略

- **国内域名** → 本地 DNS（223.5.5.5 / 119.29.29.29），走 direct，保证解析速度与 CDN 就近。
- **国外域名** → 加密 DNS（DoH/DoT，如 `https://1.1.1.1/dns-query`），走 proxy，防污染。
- **兜底** → 远程加密 DNS。

### 7.2 关键配置要点

```json
{
  "dns": {
    "servers": [
      { "tag": "local", "address": "223.5.5.5", "detour": "direct" },
      { "tag": "remote", "address": "https://1.1.1.1/dns-query", "detour": "proxy" }
    ],
    "rules": [
      { "rule_set": "geosite-cn", "server": "local" },
      { "rule_set": "geosite-geolocation-!cn", "server": "remote" }
    ],
    "final": "remote",
    "independent_cache": true
  }
}
```

配合 `route.rules` 中的 `{ "protocol": "dns", "action": "hijack-dns" }`，确保所有 53 端口查询被拦截并重定向到 sing-box 的 DNS 模块。

### 7.3 验证是否泄漏

访问 DNS 泄漏检测站点，确认解析服务器为 Cloudflare/Google 而非本地 ISP。若显示本地 ISP，检查 `hijack-dns` 是否生效、TUN 是否真正接管。

---

## 八、性能调优：压榨每一 Mbps 吞吐

### 8.1 传输层调优

- **拥塞控制**：Linux 服务端启用 `bbr`，客户端在支持的系统上启用 BBR。
- **TCP Fast Open**：减少握手往返，配置 `tcp_fast_open: true`。
- **多路复用（multiplex）**：减少连接建立开销，但会引入队头阻塞，高丢包链路慎用。

### 8.2 路由层调优

- **减少规则匹配开销**：规则集用 `.srs` 二进制格式；把高频匹配规则前置。
- **避免国内流量绕行**：`geoip-cn` 直连规则必须生效，否则国内访问被代理会显著变慢。
- **URLTest 自动选择**：配置 `urltest` 出站，自动挑选延迟最低节点。

### 8.3 系统层调优

- **增大 UDP 缓冲区**（Linux）：`sysctl net.core.rmem_max`、`wmem_max`。
- **关闭不必要的网卡 offload**：部分场景下 TSO/GSO 会与 TUN 冲突。
- **CPU 亲和性**：多核机器上绑定 sing-box 进程，减少上下文切换。

### 8.4 性能调优前后对比参考

| 调优项 | 调优前 | 调优后 | 说明 |
| --- | --- | --- | --- |
| 规则集格式 | JSON | .srs | 解析提速数倍 |
| 拥塞控制 | cubic | bbr | 高丢包吞吐提升明显 |
| 协议 | Trojan | Hysteria2 | 晚高峰吞吐提升 2-5 倍 |
| DNS | 明文 | DoH+分流 | 解析延迟稳定、防污染 |
| 出站选择 | 固定 | URLTest | 自动避开劣化节点 |

---

## 九、全场景决策指南

### 9.1 流媒体 4K/8K

- 需求：高带宽、稳定、解锁。
- 建议：Hysteria2 或 VLESS+Vision，绑定流媒体专用出站，规则集精确匹配 Netflix/Disney+/YouTube。带宽预留 ≥ 50 Mbps（4K）/ ≥ 100 Mbps（8K）。优先选择原生 IP 或流媒体解锁节点。

### 9.2 AI 大模型（ChatGPT / Claude / Gemini）

- 需求：稳定长连接、IP 干净（避免被风控）。
- 建议：独立出站 + 独立规则集，使用住宅 IP 或干净机房 IP；避免频繁切换节点导致会话中断；开启 multiplex 减少重连。参考 [稳定机场推荐](/free-airport/recommendations) 选择 IP 质量高的服务商。

### 9.3 跨境外贸 / 办公

- 需求：稳定、低延迟、数据安全。
- 建议：优先 IEPL/IPLC 专线节点，链路质量远优于公网中转，详见 [IEPL专线解析](/knowledge/iepl-vs-relay-lines)。协议选 VLESS+Vision 或 Trojan，关闭激进混淆以保证兼容。

### 9.4 联机游戏

- 需求：极低延迟、低抖动、UDP 支持。
- 建议：TUIC 或 Hysteria2，TUN 模式必须开启（游戏不读系统代理），`stack` 选 `mixed`，关闭 multiplex 以避免队头阻塞。选择物理距离近的节点，延迟优先于带宽。

---

## 十、故障排查与避坑手册

### 10.1 丢包与断流

- **现象**：视频卡顿、下载中断、游戏掉线。
- **排查**：`ping`/`mtr` 定位丢包段；检查是否被 QoS 限速（晚高峰明显）；切换 Hysteria2 抗丢包；检查 `up_mbps/down_mbps` 是否填错。
- **对策**：启用多路复用、更换专线节点、调整拥塞控制。

### 10.2 DNS 泄漏

- **现象**：检测站点显示本地 ISP。
- **排查**：确认 `hijack-dns` 规则存在且顺序正确；确认 TUN 接管；确认 DNS 服务器 `detour` 正确。
- **对策**：所有 DNS 走加密；关闭系统"智能多宿主名称解析"。

### 10.3 QoS 限速

- **现象**：特定时段速度骤降、UDP 被限。
- **排查**：对比不同协议、不同端口的表现。
- **对策**：Hysteria2 + Salamander 混淆；更换端口（443/8443）；使用专线规避公网 QoS。

### 10.4 TUN 无法启动

- **现象**：报权限错误或网卡创建失败。
- **排查**：检查管理员/服务模式；检查是否有其他 VPN 占用；Linux 检查 `CAP_NET_ADMIN`。
- **对策**：以服务模式运行；关闭冲突 VPN；调整 `interface_name`。

### 10.5 配置校验

始终先运行 `sing-box check -c config.json`，再 `sing-box run -c config.json` 前台观察日志，`log.level` 设为 `debug` 可看到路由匹配细节。

---

## 十一、高频 FAQ（10 问）

### Q1：sing-box 的 TUN 模式和系统代理模式有什么区别？

系统代理模式仅接管遵循系统代理设置的应用流量，浏览器、部分命令行工具会走代理，但游戏、UDP 应用、不读代理设置的软件会绕过，导致"部分流量泄漏"。TUN 模式在操作系统内核层创建虚拟网卡，通过修改路由表接管全部 IP 层流量，实现真正的全局代理，可处理 UDP、ICMP 及任意应用流量，是游戏加速、全流量分流的首选方案。代价是需要更高权限，且可能与 Docker、其他 VPN 冲突。日常轻度使用系统代理足够，追求完整接管与 UDP 支持必须用 TUN。

### Q2：sing-box 如何防止 DNS 泄漏？

核心是让 DNS 查询也走代理隧道并使用加密 DNS。配置中需设置 `dns.servers` 使用 DoH/DoT，通过 `dns.rules` 将需要代理的域名解析交给远程 DNS，国内域名交给本地 DNS，同时开启 `sniff` 与 `hijack-dns`，并在 TUN 入站中劫持 53 端口，确保没有明文 DNS 逃逸到本地运营商。此外应关闭操作系统的智能 DNS 功能，验证时访问 DNS 泄漏检测站点确认解析服务器为 Cloudflare/Google 而非本地 ISP。DNS 泄漏不仅暴露隐私，还可能导致解析污染与访问失败。

### Q3：Hysteria2 相比 Trojan 和 VLESS 有什么优势？

Hysteria2 基于 QUIC/UDP，采用自定义拥塞控制（BBR 变体），在高丢包、高延迟的跨境链路上吞吐远优于基于 TCP 的 Trojan/VLESS。它内置 Salamander 混淆对抗 QoS 识别，握手更快（0-RTT/1-RTT），对晚高峰公网拥塞的抵抗力显著更强。但 UDP 流量可能被部分运营商限速或阻断，且对服务端 CPU 有一定要求。Trojan/VLESS 基于 TCP，兼容性更好，在优质专线上表现稳定。实践中建议：公网高丢包链路用 Hysteria2，专线或稳定链路用 VLESS+Vision，两者可同时配置并通过 URLTest 自动选择。

### Q4：sing-box 配置报错如何快速定位？

首先运行 `sing-box check -c config.json` 做语法校验，再以 `sing-box run -c config.json` 前台运行观察日志。常见错误包括 JSON 语法（多余逗号、引号）、字段名拼写、规则集 URL 不可达、端口占用、TUN 权限不足。开启 `log.level=debug` 可看到详细的路由匹配与出站选择过程，快速定位是哪条规则或哪个出站出错。对于远程规则集，先用浏览器或 curl 验证 URL 可访问。对于 TUN 问题，检查权限与服务模式。养成"先 check 再 run"的习惯可避免大部分低级错误。

### Q5：sing-box 晚高峰卡顿如何优化？

晚高峰卡顿多源于链路拥塞与 QoS 限速。优化方向：优先使用 Hysteria2/TUIC 等 UDP 协议抗丢包；开启 multiplex 多路复用减少握手开销（高丢包时慎用）；选择 IEPL/IPLC 专线中转节点规避公网拥塞；调整 TCP Fast Open、拥塞控制为 bbr；分流规则避免国内流量绕行；必要时切换低倍率节点或更换机房。此外，确认 `up_mbps/down_mbps` 如实填写，填错会严重限制 Hysteria2 吞吐。若仍卡顿，用 mtr 定位是本地、出口还是落地环节的问题。

### Q6：TUN 模式下游戏仍然延迟高怎么办？

首先确认游戏流量确实走了 TUN（查看 sing-box 日志中该 UDP 流的路由匹配）。其次检查协议：TCP 协议在游戏 UDP 场景下不适用，应选 TUIC 或 Hysteria2。再次检查 `stack` 设置，游戏建议 `mixed` 或 `system`。关闭 multiplex 以避免队头阻塞。选择物理距离近、延迟低的节点，游戏场景延迟优先于带宽。若节点本身延迟高，任何客户端调优都无济于事，需更换节点或使用游戏专线。最后确认没有其他 VPN 或代理软件抢占路由。

### Q7：sing-box 的规则集（Rule Set）应该用 JSON 还是 .srs？

推荐 `.srs`（二进制格式）。`.srs` 是 sing-box 编译后的规则集格式，解析速度远快于 JSON，内存占用更低，尤其适合移动端和规则量大的场景。远程订阅时配置 `format: binary` 即可。JSON 格式（`source`）适合本地调试或规则量很小的情况，可读性好但性能差。主流规则集仓库通常同时提供 `.srs` 与 JSON 产物，优先选 `.srs`。若需自定义规则，可本地编写 JSON 后用 sing-box 工具编译为 `.srs`。

### Q8：sing-box 支持订阅链接自动更新吗？

sing-box 内核本身不直接消费机场订阅链接，但官方 GUI 与第三方客户端（SFI/SFA/SFM、sing-box GUI）支持导入订阅并自动转换为配置。进阶用户可用 `sub-store`、`subconverter` 等工具把订阅转换为 sing-box 配置，并配合定时任务更新。规则集支持 `remote` 类型自动拉取更新，可通过 `update_interval` 控制频率。建议把订阅转换与规则更新分离：订阅更新节点，规则集独立更新，避免一次更新引入过多变量。

### Q9：sing-box 和 Clash 配置能互相转换吗？

不能直接通用，但可通过工具转换。Clash 使用 YAML，sing-box 使用 JSON，且两者的规则语法、DNS 模块、出站定义差异较大。社区有 `subconverter`、`sing-box` 官方转换脚本等工具可将 Clash 订阅转换为 sing-box 配置，但转换后通常需要手工调整 DNS、TUN 与规则集部分。建议直接使用 sing-box 原生配置以获得完整能力，转换仅作为迁移过渡。理解两者概念映射（Proxy→Outbound、Proxy Group→URLTest/Selector、Rule→Route Rule）有助于快速上手。

### Q10：sing-box 在 Android 上耗电严重怎么办？

Android 上 sing-box（SFA）耗电主要来自 TUN 持续运行、UDP 流量处理与规则匹配。优化方向：`stack` 选 `gvisor` 或 `mixed`（`system` 在某些机型更耗电）；精简规则集，避免加载超大 GeoIP；关闭不必要的 `sniff` 与日志；使用 `URLTest` 减少手动切换；避免同时运行多个 VPN 应用。若仅需网页代理，可临时关闭 TUN 改用系统代理以省电。此外，保持客户端为最新版本，官方持续优化了移动端性能。

---

## 十二、结语与进阶路线

sing-box 的强大在于其"可编程网络"的设计哲学：入站、出站、路由、DNS、规则集五大模块正交组合，既能满足新手"导入订阅即用"的需求，也能支撑工程师构建精细化的分流与调优体系。掌握本文的 TUN 接管、规则集编写、Hysteria2 调优与 DNS 防泄漏四大核心，你已经超越了绝大多数用户。

进阶方向建议：研究 `rule_set` 的自定义编译、`outbound` 的 `multiplex` 与 `brutal` 参数、`urltest` 的测速策略、以及 sing-box 的 API 与 Clash API 兼容层，实现与面板的联动。网络优化没有银弹，唯有理解原理、持续观测、按需调参，才能在复杂多变的跨境链路中获得稳定体验。