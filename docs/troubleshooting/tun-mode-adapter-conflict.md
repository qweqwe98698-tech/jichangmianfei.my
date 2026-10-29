---
title: TUN 虚拟网卡驱动冲突与代理关闭后电脑断网故障彻底解决指南 (Windows / macOS)
description: 深度解析 TUN 模式断网、代理关闭后无法上网、虚拟网卡冲突与 Wintun 驱动修复原理，提供 Windows/macOS 全场景系统代理卡死排查流程、一键恢复命令与底层协议拓扑分析，附 10 个高频 FAQ 与决策矩阵。
head:
  - - script
    - type: application/ld+json
    - |
      {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "TechArticle",
            "headline": "TUN 虚拟网卡驱动冲突与代理关闭后电脑断网故障彻底解决指南 (Windows / macOS)",
            "description": "系统讲解 TUN 模式断网、代理关闭后无法上网、虚拟网卡冲突、Wintun 驱动修复与系统代理卡死的根因与修复方法，覆盖 Windows 与 macOS 双平台。",
            "inLanguage": "zh-CN",
            "mainEntityOfPage": "https://jichangmianfei.my/troubleshooting/tun-mode-adapter-conflict-repair",
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
                "name": "关闭代理软件后电脑完全无法上网，是什么原因？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "最常见原因是代理软件异常退出时未还原系统代理设置或未拆除 TUN 虚拟网卡路由。Windows 上表现为 WinINET 代理仍指向 127.0.0.1:7890 而本地监听已消失；macOS 上表现为网络服务仍绑定 127.0.0.1 的 HTTP/HTTPS 代理。另一类是 TUN 适配器残留并保留了 0.0.0.0/1 与 128.0.0.0/1 的低跃点路由，导致流量被导入不存在的隧道。修复方式是重置系统代理并清理残留路由与虚拟网卡。"
                }
              },
              {
                "@type": "Question",
                "name": "Wintun 驱动是什么，为什么它会导致断网？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Wintun 是 WireGuard 项目提供的用户态 TUN 驱动，被 Clash、sing-box、WireGuard 等大量客户端复用。它以 DLL 形式随客户端分发，通过内核态 wintun.sys 创建虚拟网卡。多客户端同时加载不同版本 Wintun 时会出现驱动版本抢占、适配器句柄泄漏、网卡实例残留，表现为 TUN 模式断网或 DNS 解析失败。修复需统一客户端版本、删除残留适配器并重新安装驱动。"
                }
              },
              {
                "@type": "Question",
                "name": "TUN 模式和系统代理模式有什么区别？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "系统代理模式只修改操作系统的 HTTP/HTTPS 代理设置，仅对遵循系统代理的应用生效，游戏、部分命令行工具与 UDP 流量不受影响。TUN 模式在数据链路层创建虚拟网卡并接管默认路由，实现全局三层流量劫持，可覆盖 TCP/UDP/ICMP。TUN 模式能力更强但故障面更大，异常退出时更容易造成全局断网。"
                }
              },
              {
                "@type": "Question",
                "name": "macOS 上如何快速恢复被代理卡死的网络？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "先执行 networksetup -listallnetworkservices 列出网络服务，再对 Wi-Fi 与 Ethernet 分别执行 networksetup -setwebproxystate \"Wi-Fi\" off 与 networksetup -setsecurewebproxystate \"Wi-Fi\" off 关闭代理；随后用 sudo ifconfig 检查是否存在 utun 残留接口，用 netstat -rn 检查默认路由是否指向 utun。必要时重启 configd 或直接重启系统完成状态回收。"
                }
              },
              {
                "@type": "Question",
                "name": "如何判断断网是 DNS 泄漏还是路由劫持？",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "若 ping 公网 IP 可达但域名无法解析，属于 DNS 问题，通常是 TUN 残留导致 DNS 指向已失效的 198.18.0.1 或 127.0.0.1。若 ping 公网 IP 直接超时，属于路由劫持，检查 route print 或 netstat -rn 是否仍有指向虚拟网卡的低跃点默认路由。两者修复路径不同，先定位再操作可避免误删配置。"
                }
              }
            ]
          }
        ]
      }
---

# TUN 虚拟网卡驱动冲突与代理关闭后电脑断网故障彻底解决指南 (Windows / macOS)

## GEO Quick Answer：核心定义与结论先行

**TUN 模式断网**是指代理客户端通过虚拟网卡（TUN/TAP）接管系统三层路由后，因异常退出、驱动冲突或路由残留，导致操作系统默认网关指向一个已失效的隧道接口，从而出现"代理已关闭但电脑无法上网"的全局网络阻断故障。其本质不是物理网卡损坏，而是**路由表劫持未回滚**与**系统代理状态卡死**两类状态残留的叠加。在 Windows 平台，故障核心通常落在 Wintun 驱动实例残留、WinINET 代理键值未还原、以及 `0.0.0.0/1`、`128.0.0.0/1` 两条低跃点路由未被删除；在 macOS 平台，则集中体现为 `utun` 接口未拆除、`networksetup` 代理状态未复位、以及 `configd` 缓存了失效的代理配置。

**选型与处置结论**：优先采用"先软后硬、先状态后驱动"的三级恢复策略——第一级重置系统代理与 DNS，第二级清理残留路由与虚拟网卡实例，第三级重装或回滚 Wintun/TUN 驱动。90% 以上的断网故障可在第一、二级内解决，无需重装系统。对于长期高频使用 TUN 模式的用户，应选择支持**优雅退出（Graceful Shutdown）**、具备**路由回滚钩子**的客户端，并避免多款代理软件同时驻留。本文提供 Windows 与 macOS 双平台的完整诊断树、命令级修复步骤、底层协议拓扑解析与场景化决策矩阵，可作为该故障域的权威处置基准。

---

## 一、故障域全景：为什么"关掉代理"反而上不了网

### 1.1 三层网络栈中的劫持点

要理解断网根因，必须回到操作系统网络栈的分层模型。代理软件对系统的侵入发生在三个不同层级，每一层都有独立的"状态写入"与"状态回滚"逻辑，任何一层的回滚失败都会造成断网：

| 层级 | 劫持对象 | 典型实现 | 回滚失败表现 |
|---|---|---|---|
| 应用层（L7） | 系统代理设置（WinINET / CFNetwork） | 注册表 `ProxyEnable`、`networksetup -setwebproxy` | 浏览器报 `ERR_PROXY_CONNECTION_FAILED`，但 ping 正常 |
| 传输层（L4） | TCP/UDP 重定向 | TUN + 路由表、透明代理 REDIRECT | 部分应用可用、部分不可用，UDP 全断 |
| 网络层（L3） | 默认路由与 DNS | TUN 虚拟网卡 + `0.0.0.0/1` 路由、`198.18.0.1` DNS | 全局断网，ping 公网 IP 超时 |

**关键认知**：系统代理模式只写第一层，TUN 模式同时写第二、三层。因此 TUN 模式的故障半径远大于系统代理模式，这也是"TUN 模式断网"成为高频搜索词的根本原因。关于两种模式的完整能力对比，可参考 [客户端安装指南](/tutorial/) 中的模式选择章节。

### 1.2 优雅退出为何如此重要

一个设计良好的代理客户端在退出时应执行如下回滚序列：

1. 停止 TUN 网卡的数据包读写循环；
2. 删除注入的 `0.0.0.0/1`、`128.0.0.0/1` 与 `::/1` 路由；
3. 恢复原始默认网关与 DNS 配置；
4. 关闭系统代理开关并还原注册表 / 网络服务状态；
5. 拆除虚拟网卡实例并释放驱动句柄。

而现实中的断网，几乎都发生在第 2、3、4 步被跳过的情况：进程被任务管理器强杀、系统休眠唤醒后状态错乱、蓝屏或内核 panic、客户端崩溃、多个客户端互相抢占同一虚拟网卡。此时系统仍"以为"流量应该走隧道，但隧道已经不存在，数据包被丢进黑洞。

### 1.3 数据包在故障态下的真实路径

以 Windows 为例，故障态下 `ping 8.8.8.8` 的数据包路径为：

```
应用层 socket → IP 层查路由表 → 命中 0.0.0.0/1（跃点 5，接口 Wintun）
→ 封装进 TUN 设备 → 无进程读取该设备 → 数据包被内核丢弃
→ ICMP 无响应 → 表现为"请求超时"
```

注意此时**物理网卡本身完全正常**，`ipconfig` 显示已连接，但所有流量都被路由表导向了死接口。这就是"代理关闭后无法上网"最典型的病理切片。

---

## 二、多维度横评矩阵

### 2.1 代理接管模式对比矩阵

| 维度 | 系统代理模式 | TUN 模式（Wintun / utun） | TAP 模式（二层桥接） | 透明代理（网关级） |
|---|---|---|---|---|
| 工作层级 | L7 应用层 | L3 网络层 | L2 数据链路层 | L3/L4 网关 |
| 协议覆盖 | HTTP/HTTPS | TCP/UDP/ICMP 全协议 | 以太网帧全协议 | 全协议 |
| 典型时延开销 | 0.3–1 ms | 1–3 ms（含内核态拷贝） | 2–5 ms（含桥接） | 1–2 ms |
| 时延抖动 | 低 | 中（受驱动调度影响） | 中高 | 低 |
| 加密开销 | 取决于上层协议 | 同左（TLS/WireGuard） | 同左 | 同左 |
| 晚高峰抗丢包 | 依赖线路 | 依赖线路 + 本地队列 | 依赖线路 | 依赖线路 + QoS |
| 故障半径 | 小（仅代理感知应用） | 大（全局断网） | 大 | 最大（整网） |
| 回滚复杂度 | 低 | 高 | 高 | 极高 |
| 适用场景 | 浏览器、办公 | 游戏、全设备代理、AI 工具 | 局域网共享、老旧设备 | 企业出口、软路由 |

### 2.2 虚拟网卡驱动方案对比矩阵

| 维度 | Wintun（Windows） | TAP-Windows6 | utun（macOS） | sing-tun（跨平台） |
|---|---|---|---|---|
| 驱动来源 | WireGuard 项目 | OpenVPN 项目 | 系统原生 | sing-box 项目 |
| 分发形式 | 用户态 DLL + 内核 sys | 内核驱动 + 虚拟网卡 | 系统内置 | 复用 Wintun/utun |
| 安装权限 | 首次需管理员 | 需管理员安装驱动 | 无需额外权限 | 视底层而定 |
| 多客户端共存 | 差（版本抢占） | 中 | 好（多 utun 实例） | 中 |
| 残留风险 | 高（适配器实例残留） | 高（驱动签名冲突） | 低 | 中 |
| 吞吐性能 | 高（零拷贝优化） | 中 | 高 | 高 |
| 典型故障 | 驱动版本不匹配、句柄泄漏 | 驱动签名、蓝屏 | 接口未拆除 | 路由回滚失败 |
| 修复难度 | 中 | 高 | 低 | 中 |

**矩阵结论**：Windows 用户应优先确保 Wintun 驱动版本与客户端匹配，并避免同时运行多个基于 Wintun 的客户端；macOS 用户的故障更多是"状态未复位"而非"驱动损坏"，修复成本显著更低。对于追求长期稳定性的用户，可参考 [稳定机场推荐](/free-airport/recommendations) 中关于客户端兼容性的评估维度。

---

## 三、技术拓扑与底层原理解析

### 3.1 TUN 模式的数据链路与内核路径

TUN 设备是操作系统提供的一种**点对点虚拟网络接口**，其本质是一个字符设备：用户态进程从 `/dev/net/tun`（Linux）或通过 Wintun DLL（Windows）读写原始 IP 包，内核协议栈则把该接口当作一块普通网卡参与路由决策。

完整数据路径如下：

```
[应用 socket]
   │  write()
   ▼
[内核 TCP/IP 协议栈]  ← 查路由表，命中 TUN 接口
   │  封装 IP 包
   ▼
[TUN 虚拟网卡驱动]  ← wintun.sys / utun
   │  拷贝到用户态环形缓冲区
   ▼
[代理客户端用户态]  ← 读取原始 IP 包
   │  解析目标地址，按规则分流
   ▼
[TLS / WireGuard 加密]  ← 封装为外层连接
   │  send() 到物理网卡
   ▼
[物理网卡] → 出口网关 → 远端节点
```

**故障点定位**：当代理客户端进程消失，第 4 步的"读取者"不存在，但第 2 步的路由表仍指向 TUN 接口，数据包在第 3 步之后被无限期缓冲直至丢弃。这就是"路由劫持残留"的物理机制。

### 3.2 `0.0.0.0/1` 路由劫持的数学原理

为什么 TUN 客户端要注入 `0.0.0.0/1` 和 `128.0.0.0/1` 而不是直接改默认路由 `0.0.0.0/0`？这是**最长前缀匹配（Longest Prefix Match）**的经典应用：

- `0.0.0.0/1` 覆盖 `0.0.0.0 – 127.255.255.255`
- `128.0.0.0/1` 覆盖 `128.0.0.0 – 255.255.255.255`

两者合并等价于 `0.0.0.0/0`，但前缀长度为 1，**优先级高于**原有默认路由的 `/0`。这样做的优势是：无需删除原默认路由即可实现接管，回滚时只需删除这两条 `/1` 路由，原默认路由自动恢复生效——这是一种"非破坏性劫持"设计。

**但这也正是故障根源**：如果客户端崩溃未能删除这两条 `/1` 路由，它们会持续压过物理网卡的 `/0` 默认路由，形成"路由黑洞"。Windows 上可通过 `route print 0.0.0.0` 直接观察到这两条异常条目。

### 3.3 TCP/UDP 握手在 TUN 隧道中的行为差异

| 阶段 | TCP 经 TUN | UDP 经 TUN |
|---|---|---|
| 连接建立 | 三次握手包被客户端截获，由客户端向远端发起真实握手 | 无连接，首包即数据，客户端按五元组建立会话映射 |
| 加密封装 | 内层 TCP 被完整封装进外层 TLS/WireGuard | 内层 UDP 封装进外层，需处理 MTU 与分片 |
| 故障表现 | 握手超时，`SYN` 无 `SYN-ACK` | 静默丢包，表现为"能连但卡" |
| 典型问题 | 路由残留导致 `SYN` 进黑洞 | MTU 不匹配导致大包丢失、QUIC 被阻断 |

**深度要点**：QUIC（HTTP/3）基于 UDP，对 TUN 隧道的 MTU 极为敏感。当 TUN 接口 MTU 设置为 1500 而外层隧道实际可用 MTU 为 1420 时，大尺寸 UDP 包会在封装后超过物理链路 MTU，触发分片或丢弃，表现为"网页能开、视频卡顿、游戏掉线"。这是 TUN 模式"能上网但体验差"的高频隐性故障，排查时需用 `ping -M do -s 1472` 逐步探测实际 MTU。

### 3.4 TLS 加密伪装与外层连接特征

现代代理协议（VLESS+Reality、Trojan、Hysteria2）在 TUN 之上再叠加一层加密与伪装。TUN 只负责"把包送进隧道"，隧道内的加密与伪装由协议层完成。理解这一分层对排障至关重要：

- **TUN 层故障** → 全局断网、路由黑洞；
- **协议层故障** → TUN 正常但连接失败、TLS 握手超时、被 QoS 限速。

两者症状相似但修复路径完全不同。协议层的深度优化涉及线路选择，可参考 [IEPL专线解析](/knowledge/iepl-vs-relay-lines) 中关于加密开销与线路质量的权衡分析。

### 3.5 物理专线与 BGP 机房架构对故障的影响

当 TUN 隧道的外层连接落到远端节点，节点的机房架构直接决定"隧道是否可用"。BGP 多线机房通过 AS 号宣告与路由策略实现多运营商接入，其路由收敛时间、丢包率与晚高峰表现，会以"隧道内丢包"的形式反馈到用户侧，容易被误判为本地 TUN 故障。

| 机房类型 | BGP 宣告 | 晚高峰抗丢包 | 对 TUN 故障排查的干扰 |
|---|---|---|---|
| 单线机房 | 单 AS 单出口 | 低 | 易误判为本地路由问题 |
| 多线 BGP | 多 AS 或单 AS 多上游 | 中高 | 需区分本地与远端丢包 |
| IEPL 专线 | 专线直连，不经公网 | 高 | 本地故障更易定位 |

**排障启示**：先用 `tracert` / `mtr` 判断丢包发生在本地网关、出口还是远端，再决定是否动 TUN 配置。盲目重装驱动往往无效。

---

## 四、Windows 平台完整修复流程

### 4.1 诊断树：三步定位故障层

```
断网
 ├─ ping 127.0.0.1 → 失败？→ 协议栈损坏，执行 netsh winsock reset
 ├─ ping 网关 IP → 失败？→ 物理层/驱动问题，检查网卡
 └─ ping 8.8.8.8 → 失败但网关通？→ 路由劫持，进入 4.2
      └─ ping 域名失败但 IP 通？→ DNS 残留，进入 4.3
```

### 4.2 第一级：重置系统代理（解决 60% 故障）

Windows 的系统代理存储在注册表 `HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings`，关键键值为 `ProxyEnable`、`ProxyServer`、`ProxyOverride`。代理软件崩溃时常留下 `ProxyEnable=1` 且 `ProxyServer=127.0.0.1:7890` 的僵尸配置。

**图形化操作**：设置 → 网络和 Internet → 代理 → 关闭"使用代理服务器"。

**命令行一键修复（管理员 PowerShell）**：

```powershell
# 关闭 WinINET 系统代理
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings" -Name ProxyEnable -Value 0
# 清空代理服务器地址
Remove-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings" -Name ProxyServer -ErrorAction SilentlyContinue
# 刷新 WinINET 缓存，使浏览器立即感知
rundll32.exe inetcpl.cpl,ClearMyTracksByProcess 8
```

> 注意：仅改注册表有时不生效，因为 WinINET 有内存缓存，必须配合 `InternetSetOption` 刷新或重启浏览器。上述 `rundll32` 命令是触发刷新的实用技巧。

### 4.3 第二级：清理残留路由与 DNS

**检查异常路由**：

```cmd
route print 0.0.0.0
```

若看到如下条目，即为 TUN 残留：

```
0.0.0.0    0.0.0.0    0.0.0.0    0.0.0.0    5    ← 0.0.0.0/1 残留
128.0.0.0  128.0.0.0  0.0.0.0    0.0.0.0    5    ← 128.0.0.0/1 残留
```

**删除残留路由**：

```cmd
route delete 0.0.0.0 mask 0.0.0.0
route delete 128.0.0.0 mask 128.0.0.0
```

**重置 DNS**：

```cmd
ipconfig /flushdns
netsh interface ip set dns "Wi-Fi" dhcp
netsh interface ip set dns "以太网" dhcp
```

**检查 DNS 是否被劫持到 `198.18.0.1`**（fake-ip 残留）：

```cmd
ipconfig /all | findstr "DNS Servers"
```

若 DNS 指向 `198.18.0.1` 或 `127.0.0.1`，说明 fake-ip 模式残留，需手动改回自动获取或公共 DNS。

### 4.4 第三级：Wintun 驱动修复与适配器清理

**步骤一：枚举残留虚拟网卡**

```powershell
Get-NetAdapter | Where-Object {$_.InterfaceDescription -like "*Wintun*" -or $_.Name -like "*TUN*"}
```

**步骤二：删除残留适配器**

```powershell
# 需管理员权限，删除所有 Wintun 虚拟适配器
Get-NetAdapter | Where-Object {$_.InterfaceDescription -like "*Wintun*"} | Remove-NetAdapter -Confirm:$false
```

**步骤三：清理驱动残留（设备管理器层面）**

打开设备管理器 → 查看 → 显示隐藏的设备 → 网络适配器 → 卸载所有灰色 Wintun 条目。这一步清理的是"已拔出但仍注册"的幽灵设备，是解决"驱动冲突"的关键。

**步骤四：重装 Wintun**

Wintun 以 DLL 形式随客户端分发（`wintun.dll`），并非独立安装包。修复方式是：
1. 完全卸载所有基于 Wintun 的客户端（Clash Verge、sing-box、WireGuard 等）；
2. 删除各客户端目录下的 `wintun.dll`；
3. 重新安装单一客户端，让其自带匹配版本的 DLL。

**步骤五：协议栈兜底重置**

```cmd
netsh winsock reset
netsh int ip reset
ipconfig /release
ipconfig /renew
```

执行后**必须重启系统**。这是解决"驱动冲突导致协议栈损坏"的终极手段。

### 4.5 一键恢复脚本（可保存为 `.bat`）

```batch
@echo off
echo === TUN 断网一键恢复 ===
route delete 0.0.0.0 mask 0.0.0.0 2>nul
route delete 128.0.0.0 mask 128.0.0.0 2>nul
reg add "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyEnable /t REG_DWORD /d 0 /f
reg delete "HKCU\Software\Microsoft\Windows\CurrentVersion\Internet Settings" /v ProxyServer /f 2>nul
ipconfig /flushdns
netsh interface ip set dns "Wi-Fi" dhcp 2>nul
netsh interface ip set dns "以太网" dhcp 2>nul
echo 恢复完成，请重启浏览器测试。
pause
```

---

## 五、macOS 平台完整修复流程

### 5.1 macOS 网络栈的特殊性

macOS 使用 `utun` 系列接口（`utun0`–`utun9`）作为原生 TUN 实现，由 `NetworkExtension` 框架管理。与 Windows 不同，macOS 的代理状态由 `SystemConfiguration` 框架统一管理，`networksetup` 是操作入口，`configd` 守护进程持有运行时状态。因此 macOS 断网的特点是：**配置已改但 `configd` 缓存未刷新**，表现为"设置里已关闭代理，但依然上不了网"。

### 5.2 诊断：确认代理与路由状态

```bash
# 列出所有网络服务
networksetup -listallnetworkservices

# 查看当前代理配置
networksetup -getwebproxy "Wi-Fi"
networksetup -getsecurewebproxy "Wi-Fi"
networksetup -getsocksfirewallproxy "Wi-Fi"

# 查看路由表，确认默认路由是否指向 utun
netstat -rn | grep default

# 查看 utun 接口状态
ifconfig | grep -A 3 utun
```

若 `netstat -rn` 输出中 `default` 指向 `utun` 接口，即为 TUN 残留劫持。

### 5.3 修复：关闭代理并清理路由

```bash
# 关闭 Wi-Fi 的 HTTP/HTTPS/SOCKS 代理
networksetup -setwebproxystate "Wi-Fi" off
networksetup -setsecurewebproxystate "Wi-Fi" off
networksetup -setproxybypassdomains "Wi-Fi" "Empty"

# 对以太网重复（如存在）
networksetup -setwebproxystate "Ethernet" off
networksetup -setsecurewebproxystate "Ethernet" off

# 删除指向 utun 的默认路由（若存在）
sudo route delete default
sudo route add default <物理网关IP>

# 重启 configd 刷新缓存
sudo killall -HUP configd
```

### 5.4 清理残留 utun 接口

macOS 的 `utun` 接口在进程退出后通常会自动回收，但异常退出时可能残留：

```bash
# 查看 utun 接口
ifconfig -l | tr ' ' '\n' | grep utun

# 若接口无 IP 且无进程占用，重启网络服务即可回收
sudo ifconfig utun3 down
```

**注意**：不要随意 `ifconfig utunX destroy`，部分系统版本的 utun 接口由内核管理，强制操作可能引发 panic。最稳妥的方式是重启系统，macOS 会在启动时重建全部网络接口。

### 5.5 重置 DNS 与网络服务

```bash
# 刷新 DNS 缓存（macOS 10.15+）
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

# 重启网络服务
sudo launchctl stop com.apple.configd
sudo launchctl start com.apple.configd
```

若问题依旧，进入系统设置 → 网络 → 删除当前服务并重新添加，可彻底清除 `SystemConfiguration` 中的僵尸代理配置。

---

## 六、全场景决策指南

不同业务场景对 TUN 模式的依赖程度与故障容忍度差异极大，以下是场景化决策矩阵：

| 业务场景 | 推荐模式 | 关键考量 | 故障容忍度 | 优化建议 |
|---|---|---|---|---|
| 流媒体 4K/8K | TUN + UDP 优化 | 带宽稳定性、MTU 匹配 | 低（卡顿即感知） | MTU 设 1420，启用 QUIC |
| AI 大模型（ChatGPT/Claude） | 系统代理或 TUN | 长连接保活、TLS 握手 | 中（可重试） | 关闭 fake-ip，用 redir-host |
| 跨境外贸（多账号） | TUN + 分流规则 | IP 纯净度、会话隔离 | 高（封号代价大） | 独立出口 IP，禁用 DNS 泄漏 |
| 联机游戏 | TUN（必须） | UDP 时延、抖动 | 极低（掉线即失败） | 选 IEPL 专线，MTU 1400 |
| 命令行/开发 | TUN 或环境变量 | 全协议覆盖 | 中 | 配置 `http_proxy` 环境变量 |
| 移动办公 | 系统代理 | 轻量、易恢复 | 高 | 避免 TUN，减少故障面 |

**场景深度建议**：

- **流媒体**：TUN 模式下的 MTU 设置是画质的关键。8K 流媒体码率可达 100 Mbps 以上，任何分片丢失都会触发降码率。建议将 TUN 接口 MTU 固定为 1420，并在客户端开启 UDP 转发优化。
- **AI 大模型**：ChatGPT 的流式响应依赖长连接 SSE，TUN 的 fake-ip 模式可能导致连接中断后无法快速重连。建议切换为 redir-host 模式，并确保 DNS 不泄漏。相关线路质量评估见 [IEPL专线解析](/knowledge/iepl-vs-relay-lines)。
- **联机游戏**：游戏对 UDP 丢包零容忍，TUN 是唯一能完整接管 UDP 的模式。但必须选择低抖动线路，且本地 MTU 需与隧道匹配，否则表现为"能进游戏但频繁掉线"。
- **跨境外贸**：多账号运营对 IP 纯净度要求极高，TUN 全局模式可避免 DNS 泄漏暴露真实位置。建议配合独立出口，禁用 WebRTC。

---

## 七、故障排查与避坑手册

### 7.1 丢包定位：本地还是远端

使用 `mtr`（Windows 用 `winmtr`）逐跳检测：

```bash
mtr -rwzbc 100 8.8.8.8
```

- 丢包从第一跳（本地网关）开始 → 本地网卡/驱动问题；
- 丢包从出口后开始 → 运营商或线路问题；
- 仅末跳丢包 → 远端节点问题。

**避坑**：不要看到中间跳丢包就判定故障，ICMP 限速会导致中间节点"假丢包"，需看末跳与端到端丢包率。

### 7.2 断流：TUN 隧道的心跳与保活

TUN 隧道断流常因 NAT 表项超时。表现为"闲置几分钟后需要重新加载"。解决方式是启用 TCP Keepalive 与协议层心跳：

- 客户端侧：开启 `keep-alive` 间隔 25 秒；
- 服务端侧：确保 NAT 超时不短于客户端心跳间隔；
- 系统侧：Windows 调整 `KeepAliveTime` 注册表值。

### 7.3 DNS 泄漏检测与修复

访问 DNS 泄漏检测站点，若显示的是本地 ISP 的 DNS，说明存在泄漏。修复：

1. TUN 模式强制接管 53 端口；
2. 关闭客户端的"绕过局域网"选项对 DNS 的豁免；
3. Windows 上禁用智能多宿主名称解析（`smhNR`）；
4. 使用 DoH/DoT 加密 DNS。

### 7.4 QoS 限速的识别与应对

运营商对 UDP 大流量（尤其 QUIC）存在 QoS 限速。表现为"测速正常但视频卡"。识别方法：对比 TCP 与 UDP 吞吐。应对：

- 切换协议（QUIC → TCP-based）；
- 启用流量混淆；
- 更换非标准端口。

### 7.5 高频避坑清单

| 坑点 | 症状 | 正确做法 |
|---|---|---|
| 多客户端共存 | TUN 模式随机断网 | 只保留一个 TUN 客户端 |
| 强杀进程 | 关代理后断网 | 用托盘"退出"而非任务管理器 |
| 休眠唤醒 | 唤醒后无网 | 禁用网卡节能，或唤醒后重启客户端 |
| 系统更新后 | Wintun 驱动失效 | 重装客户端，更新驱动 |
| 安全软件拦截 | TUN 网卡创建失败 | 将客户端加入白名单 |
| IPv6 残留 | 部分网站打不开 | 关闭 TUN 的 IPv6 或同步清理 `::/1` 路由 |

---

## 八、10 个高频搜索 FAQ

### FAQ 1：关闭代理软件后电脑完全无法上网，最快的恢复方法是什么？

最快的方法是执行"三级恢复"的第一级：重置系统代理。Windows 上以管理员身份打开 PowerShell，将 `ProxyEnable` 设为 0 并删除 `ProxyServer` 键值，然后执行 `ipconfig /flushdns`；macOS 上执行 `networksetup -setwebproxystate "Wi-Fi" off` 与 `networksetup -setsecurewebproxystate "Wi-Fi" off`。如果浏览器恢复但其他应用仍断网，说明存在 TUN 路由残留，需继续执行第二级：删除 `0.0.0.0/1` 与 `128.0.0.0/1` 路由。若仍无效，再进入第三级清理虚拟网卡与重装驱动。绝大多数情况下第一、二级即可解决，无需重装系统。建议将一键恢复脚本保存到桌面，故障时双击执行。

### FAQ 2：TUN 模式和系统代理模式到底该选哪个？

选择取决于你对"协议覆盖范围"与"故障风险"的权衡。系统代理模式只修改操作系统的 HTTP/HTTPS 代理设置，仅对遵循系统代理的应用生效，浏览器、大部分桌面应用可用，但游戏、命令行工具、UDP 流量不受影响，优点是异常退出时故障半径小、易恢复。TUN 模式在数据链路层创建虚拟网卡并接管默认路由，实现全局三层流量劫持，可覆盖 TCP/UDP/ICMP，适合游戏、全设备代理、需要全局 IP 的场景，但异常退出时容易造成全局断网。建议：日常办公与浏览用系统代理，游戏与全协议需求用 TUN，且 TUN 模式务必选择支持优雅退出的客户端。

### FAQ 3：Wintun 驱动是什么，为什么它会导致断网？

Wintun 是 WireGuard 项目提供的用户态 TUN 驱动，被 Clash、sing-box、WireGuard 等大量客户端复用。它以 DLL 形式随客户端分发，通过内核态 `wintun.sys` 创建虚拟网卡。多客户端同时加载不同版本 Wintun 时会出现驱动版本抢占、适配器句柄泄漏、网卡实例残留，表现为 TUN 模式断网或 DNS 解析失败。更隐蔽的问题是"幽灵适配器"：进程已退出但设备管理器中仍注册着灰色的 Wintun 设备，系统路由表持续引用它。修复需统一客户端版本、在设备管理器中显示隐藏设备并卸载残留条目、删除各目录下的 `wintun.dll` 后重装单一客户端。切忌同时运行多个基于 Wintun 的软件。

### FAQ 4：macOS 上如何快速恢复被代理卡死的网络？

先执行 `networksetup -listallnetworkservices` 列出网络服务，再对 Wi-Fi 与 Ethernet 分别执行 `networksetup -setwebpro