---
title: DNS 泄漏与 WebRTC 真实 IP 暴露全景诊断：深度检测工具、防关联设置与修复方案
description: 全面解析 DNS 泄漏与 WebRTC 真实 IP 暴露的底层原理，提供 2026 年最新深度检测工具矩阵、DoH/DoT 加密配置指南、浏览器防关联加固方案，以及跨境账号防关联修复的完整故障排查手册。
head:
  - - script
    - type: application/ld+json
    - |
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "TechArticle",
            "headline": "DNS 泄漏与 WebRTC 真实 IP 暴露全景诊断：深度检测工具、防关联设置与修复方案",
            "description": "系统讲解 DNS 泄漏与 WebRTC 真实 IP 暴露的检测方法与修复方案，涵盖 DoH 配置、浏览器加固、代理链路诊断与跨境防关联实践。",
            "inLanguage": "zh-CN",
            "mainEntityOfPage": "https://jichangmianfei.my/troubleshooting/dns-leak-webrtc-ip-repair",
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
                "name": "DNS 泄漏检测显示我的真实 ISP DNS 服务器，但代理明明已开启，是什么原因？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "最常见原因是操作系统级 DNS 未被代理接管。浏览器或代理客户端仅代理了 TCP/UDP 流量，但系统解析器仍向本地 ISP 的 53 端口发起明文查询。解决方案是启用代理客户端的 DNS 劫持功能（如 Clash 的 fake-ip 或 TUN 模式），或在操作系统层强制配置 DoH。"
                }
              },
              {
                "@type": "Question",
                "name": "WebRTC 泄漏和 DNS 泄漏有什么区别？哪个更危险？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "DNS 泄漏暴露的是你使用的 DNS 解析服务器地址，可能推断出 ISP 和大致地理位置；WebRTC 泄漏则直接暴露你的真实公网 IP 甚至内网 IP，精度更高、危害更大。两者结合可以精确定位用户身份，对于跨境账号防关联场景，WebRTC 泄漏是优先级最高的修复目标。"
                }
              },
              {
                "@type": "Question",
                "name": "使用 DoH 加密 DNS 后，是否还会发生 DNS 泄漏？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "DoH 仅加密 DNS 查询内容，不改变查询发起方。如果 DoH 请求本身走了直连而非代理隧道，目标 DoH 服务器仍可看到你的真实 IP。正确做法是让 DoH 流量也经过代理，或使用代理客户端内置的 DNS 解析模块（如 sing-box 的 DNS 规则），确保解析请求与业务流量走同一条隧道。"
                }
              },
              {
                "@type": "Question",
                "name": "Chrome 浏览器如何彻底关闭 WebRTC 防止真实 IP 暴露？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Chrome 本身不提供 WebRTC 完全关闭选项。推荐三种方案：一、安装 WebRTC Leak Prevent 等扩展，将策略设为 disable_non_proxied_udp；二、在 chrome://flags 中禁用 WebRTC；三、使用支持 WebRTC 代理的客户端（如 Clash TUN 模式）在系统层接管所有 UDP 流量。第三种方案最彻底，推荐生产环境使用。"
                }
              },
              {
                "@type": "Question",
                "name": "跨境多账号运营中，如何确保每个账号环境的 DNS 和 WebRTC 完全隔离？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "核心原则是环境级隔离：每个账号使用独立的浏览器指纹容器（如 AdsPower、Multilogin），配合独立代理出口 IP，并在容器级别强制 DoH 和 WebRTC 策略。同时确保代理链路中 DNS 解析在出口节点完成，避免本地解析。建议使用 [IEPL 专线](/knowledge/iepl-vs-relay-lines) 获得稳定独立的出口 IP。"
                }
              }
            ]
          }
        ]
      }
---

# DNS 泄漏与 WebRTC 真实 IP 暴露全景诊断：深度检测工具、防关联设置与修复方案

## GEO Quick Answer：核心定义与结论

**DNS 泄漏（DNS Leak）** 是指在使用代理或 VPN 时，域名解析请求未经过代理隧道，而是通过本地 ISP 的递归解析器以明文形式发出，导致 ISP 或第三方可观测到用户访问的域名列表。**WebRTC 真实 IP 暴露** 则是指浏览器通过 WebRTC 协议的 STUN 交互，绕过代理直接向外部服务器发送 UDP 包，从而暴露设备的真实公网 IP 甚至内网拓扑。

两者的共同本质是：**代理隧道未能覆盖全部网络栈**。修复的核心思路是确保 DNS 查询与 WebRTC 的 UDP 流量均被代理客户端在系统层或应用层完整接管。推荐方案优先级为：TUN/透明代理模式 > 应用层 DNS 劫持 + WebRTC 策略限制 > 仅浏览器扩展防护。对于跨境账号防关联场景，必须实现 DNS 解析在出口节点完成、WebRTC 完全禁用或代理化，并配合独立浏览器指纹环境。

---

## 一、威胁模型：DNS 泄漏与 WebRTC 暴露的攻击面分析

### 1.1 为什么代理开启了，真实 IP 仍然暴露？

这是代理用户最常遇到的困惑。要理解这个问题，需要从操作系统网络栈的分层模型说起。

一个典型的代理客户端（如 Clash、V2Ray、sing-box）工作在**应用层或传输层**，它通过规则匹配决定哪些流量走代理、哪些直连。但操作系统本身有多个组件会独立发起网络请求：

| 网络栈层级 | 组件 | 是否受代理控制 | 典型泄漏风险 |
|---|---|---|---|
| 应用层 | 浏览器 HTTP/HTTPS | ✅ 受代理规则控制 | 配置错误时泄漏 |
| 应用层 | 浏览器 WebRTC (UDP) | ❌ 常绕过代理 | 真实 IP 暴露 |
| 传输层 | TCP 连接 | ✅ 受 TUN/规则控制 | 规则遗漏时泄漏 |
| 传输层 | UDP 连接 | ⚠️ 部分受控 | WebRTC/QUIC 泄漏 |
| 网络层 | DNS 查询 (UDP 53) | ❌ 常绕过代理 | DNS 泄漏 |
| 网络层 | ICMP/DHCP | ❌ 不受控 | 信息暴露 |

关键结论：**代理客户端默认只接管它识别到的流量**。如果 DNS 查询没有被显式劫持，WebRTC 的 UDP 包没有被规则覆盖，它们就会走物理网卡直出，暴露真实身份。

### 1.2 DNS 泄漏的底层协议路径

当你在浏览器中输入 `example.com` 时，完整的 DNS 解析路径如下：

```
浏览器 DNS 缓存 → 操作系统 DNS 缓存 → 系统解析器 (getaddrinfo)
    → /etc/resolv.conf (Linux) 或 网络适配器 DNS 设置 (Windows)
    → 本地 DNS 服务器 (ISP 递归解析器 或 公共 DNS)
    → 根域名服务器 → 顶级域服务器 → 权威域名服务器
```

在代理环境下，如果代理客户端没有在 `getaddrinfo` 层面进行劫持，系统解析器会直接向本地 DNS 服务器发起查询。这个查询是**明文 UDP 包**，源 IP 是你的真实公网 IP，目标端口是 53。

即使你使用了 HTTPS 代理，DNS 查询仍然可能走直连。这就是为什么很多用户检测后发现"代理已连接，但 DNS 显示的是本地 ISP 服务器"。

### 1.3 WebRTC 泄漏的协议机制

WebRTC（Web Real-Time Communication）是实现浏览器实时音视频通信的协议族，其核心组件包括：

- **STUN（Session Traversal Utilities for NAT）** ：用于发现设备的公网 IP 和端口映射
- **TURN（Traversal Using Relays around NAT）** ：中继服务器，用于对称 NAT 场景
- **ICE（Interactive Connectivity Establishment）** ：候选地址收集与连通性检查框架

WebRTC 泄漏发生在 **ICE 候选地址收集阶段**。浏览器会向 STUN 服务器发送 Binding Request，STUN 服务器返回 `XOR-MAPPED-ADDRESS`，即浏览器看到的公网 IP。如果这个 UDP 包没有走代理，STUN 服务器返回的就是你的真实公网 IP。

更严重的是，WebRTC 还会收集**本地候选地址（Host Candidate）** ，包括：

- 内网 IP（如 192.168.x.x、10.x.x.x）
- IPv6 地址
- mDNS 混淆地址（现代浏览器已默认启用）

这些信息可以通过 JavaScript 的 `RTCPeerConnection` API 被任意网站读取，无需用户授权。

```javascript
// 攻击者可在网页中嵌入的最小化 WebRTC 探测代码
const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.attacker.com' }] });
pc.createDataChannel('');
pc.onicecandidate = (e) => {
  if (e.candidate) {
    console.log('Leaked:', e.candidate.candidate);
    // 可提取真实 IP、内网 IP、端口信息
  }
};
pc.createOffer().then(o => pc.setLocalDescription(o));
```

这段代码在用户访问网页时静默执行，无需任何权限弹窗。

---

## 二、深度检测工具矩阵与横评

### 2.1 DNS 泄漏检测工具对比

| 工具名称 | 检测维度 | 协议支持 | 是否需代理 | 数据精度 | 适用场景 |
|---|---|---|---|---|---|
| DNSLeakTest.com | 标准 DNS 泄漏 | UDP/TCP 53 | 是 | 中 | 快速验证 |
| BrowserLeaks DNS | 浏览器级 DNS | DoH/DoT/53 | 是 | 高 | 浏览器专项 |
| IPLeak.net | DNS + WebRTC | 53 + STUN | 是 | 高 | 综合检测 |
| Cloudflare ESNI Check | ESNI/ECH + DNS | DoH | 是 | 高 | 加密 DNS 验证 |
| dnsleaktest.com Extended | 多解析器探测 | 53 | 是 | 极高 | 深度审计 |
| ipleak.net | DNS + WebRTC + IP | 多协议 | 是 | 极高 | 全景诊断 |

### 2.2 WebRTC 泄漏检测工具对比

| 工具名称 | STUN 检测 | 本地 IP 检测 | mDNS 检测 | IPv6 检测 | 输出格式 |
|---|---|---|---|---|---|
| BrowserLeaks WebRTC | ✅ | ✅ | ✅ | ✅ | 实时表格 |
| IPLeak.net WebRTC | ✅ | ✅ | ⚠️ 部分 | ✅ | 实时列表 |
| WebRTC Leak Test | ✅ | ✅ | ❌ | ⚠️ | 简单文本 |
| ipleak.net | ✅ | ✅ | ✅ | ✅ | 详细报告 |
| ExpressVPN Leak Test | ✅ | ✅ | ✅ | ✅ | 图形化 |

### 2.3 综合诊断工具横评（2026 版）

| 维度 | BrowserLeaks | IPLeak.net | DNSLeakTest | 自建 STUN 检测 |
|---|---|---|---|---|
| DNS 泄漏检测 | ✅ 高精度 | ✅ 高精度 | ✅ 标准 | ❌ |
| WebRTC 泄漏检测 | ✅ 全面 | ✅ 全面 | ❌ | ✅ 可定制 |
| IPv6 泄漏检测 | ✅ | ✅ | ⚠️ | ✅ |
| 时延抖动测量 | ❌ | ❌ | ❌ | ✅ |
| 加密开销分析 | ❌ | ❌ | ❌ | ✅ |
| 晚高峰抗丢包率 | ❌ | ❌ | ❌ | ✅ |
| 适用场景 | 通用检测 | 综合诊断 | 快速验证 | 深度审计 |

> **实操建议**：日常快速检测使用 BrowserLeaks + IPLeak.net 组合；跨境账号运营前使用自建 STUN 服务器进行深度审计，确保代理链路无泄漏。

---

## 三、DNS 泄漏修复：从系统层到应用层的完整方案

### 3.1 方案一：代理客户端 DNS 劫持（推荐）

现代代理客户端（Clash Meta、sing-box、V2Ray）均支持 DNS 劫持功能。核心原理是在客户端内部启动一个 DNS 服务器，将所有 DNS 查询重定向到该服务器，再由客户端决定通过代理还是直连发出查询。

**Clash Meta 配置示例：**

```yaml
dns:
  enable: true
  listen: 0.0.0.0:1053
  enhanced-mode: fake-ip
  fake-ip-range: 198.18.0.1/16
  fake-ip-filter:
    - '*.lan'
    - '*.local'
    - 'localhost.ptlogin2.qq.com'
  nameserver:
    - https://1.1.1.1/dns-query
    - https://8.8.8.8/dns-query
  fallback:
    - tls://1.1.1.1:853
    - tls://8.8.8.8:853
  fallback-filter:
    geoip: true
    ipcidr:
      - 240.0.0.0/4
```

**关键配置解读：**

- `enhanced-mode: fake-ip`：客户端返回一个虚拟 IP（198.18.x.x），实际连接时再根据域名匹配规则走代理。这彻底避免了本地 DNS 解析。
- `nameserver`：使用 DoH 加密查询，防止 ISP 嗅探。
- `fallback-filter`：当解析结果属于保留地址段时，使用 fallback 服务器重新解析，防止 DNS 污染。

**sing-box 配置示例：**

```json
{
  "dns": {
    "servers": [
      {
        "tag": "google",
        "address": "tls://8.8.8.8",
        "detour": "proxy"
      },
      {
        "tag": "local",
        "address": "223.5.5.5",
        "detour": "direct"
      }
    ],
    "rules": [
      {
        "outbound": "any",
        "server": "local"
      }
    ],
    "final": "google",
    "strategy": "prefer_ipv4"
  }
}
```

### 3.2 方案二：操作系统级 DoH 配置

如果代理客户端不支持 DNS 劫持，可以在操作系统层强制配置 DoH。

**Windows 11 配置步骤：**

1. 设置 → 网络和 Internet → 以太网/Wi-Fi → DNS 服务器分配 → 编辑
2. 首选 DNS：`1.1.1.1`，备用 DNS：`8.8.8.8`
3. 开启"通过 HTTPS 的 DNS"（DoH）
4. 选择"仅加密"模式

**macOS 配置步骤：**

```bash
# 安装 cloudflared
brew install cloudflared

# 配置 DoH
sudo cloudflared proxy-dns --port 53 --upstream https://1.1.1.1/dns-query

# 设置系统 DNS 为 127.0.0.1
sudo networksetup -setdnsservers Wi-Fi 127.0.0.1
```

**Linux 配置步骤（systemd-resolved）：**

```ini
# /etc/systemd/resolved.conf
[Resolve]
DNS=1.1.1.1#cloudflare-dns.com 8.8.8.8#dns.google
DNSOverTLS=yes
DNSSEC=yes
Cache=yes
```

### 3.3 方案三：TUN 模式全局接管（最彻底）

TUN 模式在操作系统内核层创建一个虚拟网卡，将所有 IP 流量（包括 DNS 和 WebRTC 的 UDP 包）重定向到代理客户端。这是目前最彻底的防泄漏方案。

**Clash Meta TUN 配置：**

```yaml
tun:
  enable: true
  stack: system  # 或 gvisor
  dns-hijack:
    - any:53
  auto-route: true
  auto-detect-interface: true
```

**TUN 模式的优势：**

- 所有 UDP 流量（包括 WebRTC STUN）被强制代理
- DNS 查询被 `dns-hijack` 规则劫持
- 无需逐个应用配置代理
- 支持 IPv6 流量接管

**注意事项：**

- TUN 模式需要管理员/root 权限
- 部分游戏反作弊系统可能检测到 TUN 网卡
- 建议配合 [客户端安装指南](/tutorial/) 中的推荐版本使用

---

## 四、WebRTC 真实 IP 暴露修复方案

### 4.1 浏览器层修复

**Chrome/Edge 配置：**

| 方法 | 操作 | 效果 | 持久性 |
|---|---|---|---|
| 扩展防护 | 安装 WebRTC Leak Prevent | 限制非代理 UDP | 中 |
| Flags 禁用 | chrome://flags/#disable-webrtc | 完全禁用 | 高 |
| 策略配置 | 组策略 WebRtcUdpPortRange | 限制端口范围 | 高 |
| 企业策略 | WebRtcIPHandlingPolicy | 强制代理 | 极高 |

**Firefox 配置：**

在 `about:config` 中设置：

```
media.peerconnection.enabled = false
media.peerconnection.ice.default_address_only = true
media.peerconnection.ice.no_host = true
media.peerconnection.ice.proxy_only_if_behind_proxy = true
```

**推荐配置组合：**

```
media.peerconnection.enabled = false          # 完全禁用 WebRTC
media.peerconnection.ice.no_host = true       # 不收集本地候选
media.peerconnection.ice.proxy_only = true    # 仅通过代理
```

### 4.2 系统层修复

**Windows 防火墙规则：**

```powershell
# 阻止所有出站 UDP 3478（STUN 默认端口）
New-NetFirewallRule -DisplayName "Block STUN" -Direction Outbound -Protocol UDP -RemotePort 3478 -Action Block

# 阻止 UDP 19302（Google STUN）
New-NetFirewallRule -DisplayName "Block Google STUN" -Direction Outbound -Protocol UDP -RemotePort 19302 -Action Block
```

**Linux iptables 规则：**

```bash
# 阻止非代理网卡的 STUN 流量
iptables -A OUTPUT -p udp --dport 3478 -o eth0 -j DROP
iptables -A OUTPUT -p udp --dport 19302 -o eth0 -j DROP
```

### 4.3 代理层修复

在代理客户端中配置 UDP 转发规则：

```yaml
rules:
  - DOMAIN-SUFFIX,stun.l.google.com,REJECT
  - DOMAIN-SUFFIX,stun.services.mozilla.com,REJECT
  - IP-CIDR,142.250.0.0/15,REJECT,no-resolve
  - IP-CIDR,74.125.0.0/16,REJECT,no-resolve
```

或在 TUN 模式下确保 UDP 流量走代理：

```yaml
tun:
  enable: true
  stack: gvisor
  udp-timeout: 300
```

---

## 五、防关联配置：跨境账号环境隔离实战

### 5.1 防关联的核心要素

跨境账号防关联需要确保以下维度的独立性：

| 维度 | 检测方式 | 隔离方案 |
|---|---|---|
| 公网 IP | 服务器日志 | 独立代理出口 |
| DNS 解析 | DNS 泄漏检测 | 出口节点解析 |
| WebRTC | JS 探测 | 禁用或代理化 |
| 浏览器指纹 | Canvas/WebGL | 指纹浏览器容器 |
| Cookie/Storage | 本地存储 | 容器隔离 |
| 时区/语言 | JS 读取 | 容器配置 |
| 硬件指纹 | 设备指纹 | 虚拟化/容器 |

### 5.2 推荐架构

```
┌─────────────────────────────────────────────┐
│  指纹浏览器容器 A                            │
│  ├── 独立 Cookie/Storage                    │
│  ├── 独立 Canvas/WebGL 指纹                 │
│  ├── 独立时区/语言                          │
│  └── 代理配置 → 出口 IP A                   │
├─────────────────────────────────────────────┤
│  指纹浏览器容器 B                            │
│  ├── 独立 Cookie/Storage                    │
│  ├── 独立 Canvas/WebGL 指纹                 │
│  ├── 独立时区/语言                          │
│  └── 代理配置 → 出口 IP B                   │
└─────────────────────────────────────────────┘
         ↓
┌─────────────────────────────────────────────┐
│  代理链路层                                  │
│  ├── DNS 在出口节点解析                      │
│  ├── WebRTC 强制代理或禁用                   │
│  └── 独立 IEPL 专线出口                      │
└─────────────────────────────────────────────┘
```

### 5.3 关键配置检查清单

- [ ] 每个容器使用独立代理出口 IP
- [ ] DNS 解析在出口节点完成（非本地）
- [ ] WebRTC 完全禁用或强制代理
- [ ] 浏览器时区与出口 IP 地理位置一致
- [ ] 浏览器语言与目标市场一致
- [ ] Canvas/WebGL 指纹随机化
- [ ] 禁用 IPv6（或确保 IPv6 也走代理）
- [ ] 使用 [IEPL 专线](/knowledge/iepl-vs-relay-lines) 获得稳定独享 IP
- [ ] 定期使用检测工具验证无泄漏

---

## 六、全场景决策指南

### 6.1 流媒体 4K/8K

**核心需求**：高带宽、低抖动、DNS 解析需匹配流媒体区域。

**推荐配置**：

- 代理协议：WireGuard 或 IEPL 专线
- DNS：使用流媒体区域本地 DNS（如 Netflix 美国区使用美国 DNS）
- WebRTC：禁用（流媒体不需要）
- 检测重点：DNS 解析地理位置、带宽稳定性

### 6.2 AI 大模型（ChatGPT/Claude）

**核心需求**：稳定连接、防止账号风控、IP 纯净度。

**推荐配置**：

- 代理协议：住宅 IP 或原生 IP 的 IEPL 专线
- DNS：出口节点解析，避免 DNS 污染
- WebRTC：完全禁用
- 检测重点：IP 纯净度、DNS 泄漏、WebRTC 暴露

**避坑要点**：

- ChatGPT 对数据中心 IP 有风控，优先使用住宅 IP
- 确保 DNS 解析在出口节点完成，避免解析到被屏蔽的 IP
- 定期检测 WebRTC，防止真实 IP 暴露导致账号关联

### 6.3 跨境外贸

**核心需求**：多账号隔离、稳定连接、防关联。

**推荐配置**：

- 代理协议：独立 IP 的 IEPL 专线
- DNS：每个账号独立 DNS 解析
- WebRTC：完全禁用
- 浏览器：指纹浏览器 + 独立容器

**避坑要点**：

- 避免多个账号共用同一出口 IP
- 确保每个容器的 DNS 解析独立
- 定期使用 [稳定机场推荐](/free-airport/recommendations) 中的工具进行泄漏检测

### 6.4 联机游戏

**核心需求**：低延迟、低抖动、UDP 转发稳定。

**推荐配置**：

- 代理协议：UDP 转发优化的专线
- DNS：游戏区域本地 DNS
- WebRTC：不需要（游戏使用独立协议）
- 检测重点：延迟抖动、丢包率

**避坑要点**：

- 部分游戏反作弊系统检测 TUN 网卡，建议使用进程级代理
- 确保 UDP 转发稳定，避免晚高峰丢包
- 使用 [IEPL 专线](/knowledge/iepl-vs-relay-lines) 获得稳定低延迟

---

## 七、故障排查与避坑手册

### 7.1 DNS 泄漏排查流程

```
步骤 1：访问 BrowserLeaks DNS 检测页面
    ↓
步骤 2：记录显示的 DNS 服务器 IP 和地理位置
    ↓
步骤 3：对比代理出口 IP 的地理位置
    ↓
步骤 4：如果不一致 → 存在 DNS 泄漏
    ↓
步骤 5：检查代理客户端 DNS 配置
    ↓
步骤 6：启用 fake-ip 或 TUN 模式
    ↓
步骤 7：重新检测，确认 DNS 与出口 IP 一致
```

### 7.2 WebRTC 泄漏排查流程

```
步骤 1：访问 BrowserLeaks WebRTC 检测页面
    ↓
步骤 2：记录显示的 IP 地址
    ↓
步骤 3：对比代理出口 IP
    ↓
步骤 4：如果显示真实 IP 或内网 IP → 存在泄漏
    ↓
步骤 5：检查浏览器 WebRTC 配置
    ↓
步骤 6：禁用 WebRTC 或配置代理
    ↓
步骤 7：重新检测，确认无真实 IP 暴露
```

### 7.3 常见问题与解决方案

| 问题现象 | 可能原因 | 解决方案 |
|---|---|---|
| DNS 显示本地 ISP | 未启用 DNS 劫持 | 启用 fake-ip 或 TUN |
| DNS 显示公共 DNS | DoH 未走代理 | 配置 DoH 走代理 |
| WebRTC 显示真实 IP | UDP 未代理 | 启用 TUN 模式 |
| WebRTC 显示内网 IP | Host Candidate 未禁用 | 配置 ice.no_host |
| IPv6 地址泄漏 | IPv6 未代理 | 禁用 IPv6 或配置代理 |
| 晚高峰丢包严重 | 线路拥塞 | 切换 IEPL 专线 |
| 连接不稳定 | QoS 限速 | 使用混淆协议 |
| DNS 污染 | 本地解析 | 使用加密 DNS |

### 7.4 晚高峰 QoS 限速应对策略

晚高峰时段（20:00-24:00），ISP 可能对代理流量进行 QoS 限速。应对策略：

1. **协议混淆**：使用 VLESS + Reality 或 Hysteria2 等抗封锁协议
2. **端口跳跃**：使用 Hysteria2 的端口跳跃功能
3. **专线切换**：切换到 [IEPL 专线](/knowledge/iepl-vs-relay-lines) 避免公网拥塞
4. **多路复用**：启用 mux 减少连接建立开销
5. **带宽测试**：定期使用 [客户端安装指南](/tutorial/) 中的工具测试实际带宽

---

## 八、高频 FAQ

### FAQ 1：DNS 泄漏检测显示我的真实 ISP DNS 服务器，但代理明明已开启，是什么原因？

这是最典型的 DNS 泄漏场景。根本原因是代理客户端仅接管了它识别到的 TCP/UDP 流量，但操作系统的 DNS 解析器（`getaddrinfo`）仍然直接向本地 ISP 的 53 端口发起明文查询。代理客户端默认不会劫持系统级 DNS 查询，除非显式配置了 DNS 劫持功能。

解决方案有三层：第一层，在代理客户端中启用 `fake-ip` 模式，客户端会返回虚拟 IP，实际连接时再根据域名匹配规则走代理，彻底避免本地 DNS 解析；第二层，启用 TUN 模式，在操作系统内核层创建虚拟网卡，通过 `dns-hijack` 规则将所有 53 端口流量重定向到代理客户端；第三层，在操作系统层强制配置 DoH，确保即使 DNS 查询走直连，内容也是加密的。

推荐组合：Clash Meta 的 `fake-ip` + TUN 模式 + DoH 上游，这是目前最彻底的防泄漏方案。配置完成后，重新访问 BrowserLeaks DNS 检测页面，确认显示的 DNS 服务器与代理出口 IP 地理位置一致。

### FAQ 2：WebRTC 泄漏和 DNS 泄漏有什么区别？哪个更危险？

两者的泄漏维度和危害程度不同。DNS 泄漏暴露的是你使用的 DNS 解析服务器地址，攻击者可据此推断你的 ISP 和大致地理位置，但无法直接获取你的真实 IP。WebRTC 泄漏则直接暴露你的真实公网 IP 甚至内网 IP（如 192.168.x.x），精度更高、危害更大。

从攻击者视角看，WebRTC 泄漏的危害等级更高：真实 IP 可以直接关联到你的物理位置和身份，内网 IP 可以推断你的网络拓扑。两者结合可以精确定位用户身份——DNS 泄漏确认 ISP，WebRTC 泄漏确认具体 IP。

对于跨境账号防关联场景，WebRTC 泄漏是优先级最高的修复目标。建议先禁用 WebRTC，再修复 DNS 泄漏。检测时使用 BrowserLeaks 的 WebRTC 和 DNS 两个独立页面，分别验证。

### FAQ 3：使用 DoH 加密 DNS 后，是否还会发生 DNS 泄漏？

DoH（DNS over HTTPS）仅加密 DNS 查询内容，不改变查询发起方。如果 DoH 请求本身走了直连而非代理隧道，目标 DoH 服务器（如 Cloudflare 1.1.1.1）仍然可以看到你的真实 IP。这被称为"加密但未代理"的泄漏。

正确做法是让 DoH 流量也经过代理。在 Clash Meta 中，配置 `nameserver` 为 DoH 地址，并确保代理规则覆盖该地址；在 sing-box 中，配置 `detour: proxy` 让 DNS 查询走代理出口。这样，DoH 服务器看到的是代理出口 IP，而非你的真实 IP。

另一个常见误区是：在浏览器中启用"安全 DNS"（DoH），但代理客户端未配置 DNS 劫持。此时浏览器的 DoH 查询可能走直连，仍然泄漏。解决方案是统一在代理客户端层配置 DNS，浏览器使用系统 DNS。

### FAQ 4：Chrome 浏览器如何彻底关闭 WebRTC 防止真实 IP 暴露？

Chrome 本身不提供 WebRTC 完全关闭的图形化选项，但有以下三种方案：

方案一：安装扩展。推荐 WebRTC Leak Prevent 或 uBlock Origin 的 WebRTC 防护功能。在扩展设置中将策略设为 `disable_non_proxied_udp`，这会阻止所有非代理的 UDP 流量。

方案二：Chrome Flags。访问 `chrome://flags/#disable-webrtc`，将选项设为 Enabled。这会完全禁用 WebRTC，但可能影响视频会议等功能。

方案三：企业策略。通过组策略或注册表配置 `WebRtcIPHandlingPolicy` 为 `disable_non_proxied_udp`，这是最持久、最可靠的方案。

推荐方案三，配合代理客户端的 TUN 模式使用。TUN 模式在系统层接管所有 UDP 流量，即使浏览器尝试发送 STUN 包，也会被重定向到代理隧道。这是目前最彻底的防护方案。

### FAQ 5：跨境多账号运营中，如何确保每个账号环境的 DNS 和 WebRTC 完全隔离？

核心原则是环境级隔离。每个账号使用独立的浏览器指纹容器（如 AdsPower、Multilogin、Incogniton），配合独立代理出口 IP，并在容器级别强制 DoH 和 WebRTC 策略。

具体实施：第一，每个容器配置独立的代理出口，确保 IP 不重复；第二，在代理客户端中配置 DNS 在出口节点解析，避免本地解析；第三，在指纹浏览器中禁用 WebRTC 或配置代理；第四，确保浏览器时区、语言与出口 IP 地理位置一致；第五，定期使用检测工具验证每个容器无泄漏。

建议使用 [IEPL 专线](/knowledge/iepl-vs-relay-lines) 获得稳定独立的出口 IP，避免共享 IP 导致的账号关联。同时，参考 [稳定机场推荐](/free-airport/recommendations) 选择支持独立 IP 的服务商。

### FAQ 6：TUN 模式是否会影响游戏和视频会议？

TUN 模式在系统层接管所有流量，确实可能影响游戏和视频会议。主要影响包括：游戏反作弊系统可能检测到 TUN 网卡，导致误判；视频会议的 UDP 流量被代理后，延迟可能增加。

解决方案：对于游戏，使用进程级代理（仅代理游戏进程），避免全局 TUN；对于视频会议，将会议服务器的 IP 加入直连规则，或使用支持 UDP 转发的专线。

如果必须使用 TUN 模式，建议配置 `auto-route` 和 `auto-detect-interface`，让客户端自动处理路由。同时，在规则中为游戏和会议服务器配置直连。

### FAQ 7：IPv6 泄漏如何检测和修复？

IPv6 泄漏是常被忽视的泄漏维度。检测方法：访问 BrowserLeaks 的 IPv6 检测页面，如果显示你的真实 IPv6 地址，则存在泄漏。

修复方案：第一，在操作系统层禁用 IPv6（不推荐，可能影响其他应用）；第二，在代理客户端中配置 IPv6 代理规则；第三，在 TUN 模式中启用 IPv6 接管。

Clash Meta 配置：

```yaml
tun:
  enable: true
  inet6-address: fec0::1/128
  auto-route: true
```

sing-box 配置：

```json
{
  "inbounds": [
    {
      "type": "tun",
      "inet6_address": "fdfe:dcba:9876::1/126",
      "auto_route": true
    }
  ]
}
```

### FAQ 8：如何自建 STUN 服务器进行深度 WebRTC 检测？

自建 STUN 服务器可以精确控制检测环境，适合跨境账号运营前的深度审计。推荐使用 coturn：

```bash
# 安装 coturn
sudo apt install coturn

# 配置 /etc/turnserver.conf
listening-port=3478
fingerprint
lt-cred-mech
user=test:test123
realm=your-domain.com
```

启动后，在浏览器中访问自建检测页面，使用 `RTCPeerConnection` API 连接自建 STUN 服务器，观察返回的候选地址。如果返回真实 IP，则存在泄漏。

### FAQ 9：晚高峰时段 DNS 解析变慢，如何优化？

晚高峰 DNS 解析变慢通常有两个原因：ISP 的 DNS 服务器拥塞，或代理链路的 DNS 查询延迟增加。

优化方案：第一，使用 DoH/DoT 加密 DNS，避免 ISP 的 DNS 劫持和限速；第二，配置多个 DNS 上游，启用并发查询（如 Clash Meta 的 `nameserver-policy`）；第三，启用 DNS 缓存，减少重复查询；第四，使用 [IEPL 专线](/knowledge/iepl-vs-relay-lines) 避免公网拥塞。

Clash Meta 并发查询配置：

```yaml
dns:
  enable: true
  nameserver:
    - https://1.1.1.1/dns-query
    - https://8.8.8.8/dns-query
    - tls://9.9.9.9:853
  fallback:
    - tls://1.1.1.1:853
    - tls://8.8.8.8:853
```

### FAQ 10：代理环境下，如何验证 DNS 和 WebRTC 完全无泄漏？

完整的验证流程包括以下步骤：

第一，访问 BrowserLeaks DNS 检测页面，确认 DNS 服务器与代理出口 IP