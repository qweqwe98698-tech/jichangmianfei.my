import { test, expect } from '@playwright/test'

test.describe('机场免费 jichangmianfei.my E2E 测试套件', () => {
  test('首页标题、Hero与导航元素正常加载', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/机场免费/)
    
    // 验证 Hero 标题
    const heroTitle = page.locator('.VPHero .name')
    await expect(heroTitle).toContainText('机场免费')

    // 验证核心导航链接存在
    const nav = page.locator('.VPNavBar')
    await expect(nav).toBeVisible()
    await expect(nav).toContainText('免费机场')
    await expect(nav).toContainText('免费节点与订阅')
    await expect(nav).toContainText('客户端教程')
    await expect(nav).toContainText('故障排查')
    await expect(nav).toContainText('光速云实测')
  })

  test('免费机场 Pillar 主题页深度内容与组件渲染验证', async ({ page }) => {
    await page.goto('/free-airport/')
    await expect(page).toHaveTitle(/免费机场/)

    // 验证 QuickAnswer 组件渲染
    const quickAnswer = page.locator('text=30秒快速解答')
    await expect(quickAnswer).toBeVisible()

    // 验证核心比较表格
    const table = page.locator('table')
    await expect(table.first()).toBeVisible()

    // 验证 FAQ 交互组件
    const faqQuestion = page.locator('text=免费机场真的可以一直永久使用吗？')
    await expect(faqQuestion).toBeVisible()
    await faqQuestion.click()

    // 验证 BrandCard 转化卡片与自营披露
    const brandCard = page.locator('text=自营品牌透明披露')
    await expect(brandCard).toBeVisible()
    const affLink = page.locator('a[href*="gsyvipaff.com"]')
    await expect(affLink.first()).toBeVisible()
  })

  test('客户端教程页与代码块渲染验证', async ({ page }) => {
    await page.goto('/tutorial/clash-verge-rev')
    await expect(page).toHaveTitle(/Clash Verge Rev/)

    // 验证标题与步骤
    const heading = page.locator('h1')
    await expect(heading).toContainText('Clash Verge Rev')

    // 验证 TopicBridge 下一步引导组件
    const topicBridge = page.locator('text=需要稳定不卡顿的高品质专线节点订阅')
    await expect(topicBridge).toBeVisible()
  })

  test('网络故障排查中心与决策树验证', async ({ page }) => {
    await page.goto('/troubleshooting/node-all-timeout')
    await expect(page).toHaveTitle(/节点全部超时/)

    const heading = page.locator('h1')
    await expect(heading).toContainText('节点全部超时')

    // 验证排错决策树组件
    const troubleBox = page.locator('text=节点超时现象速查与解决方案')
    await expect(troubleBox).toBeVisible()
  })

  test('光速云专属评测产品页正常加载', async ({ page }) => {
    await page.goto('/product/guangshuyun')
    await expect(page).toHaveTitle(/光速云/)

    const heading = page.locator('h1')
    await expect(heading).toContainText('光速云')

    // 验证实测数据
    const speedTable = page.locator('text=实测数据')
    await expect(speedTable.first()).toBeVisible()
  })

  test('移动端视口 (Mobile Viewport) 痛点胶囊与卡片化表格响应式验证', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // 移动端菜单按钮可见
    const mobileMenuBtn = page.locator('.VPNavBarHamburger')
    await expect(mobileMenuBtn).toBeVisible()

    // 验证手机端痛点胶囊
    const quickCapsules = page.locator('text=手机端高频痛点一键直达')
    await expect(quickCapsules).toBeVisible()

    // 进入文章页测试移动端卡片化与滚动悬浮栏
    await page.goto('/free-airport/recommendations')
    await page.evaluate(() => window.scrollTo(0, 500))
    await page.waitForTimeout(300)

    const stickyBar = page.locator('text=光速云专线实测 / 直达')
    await expect(stickyBar).toBeVisible()
  })

  test('首页 Hero 右侧光速云 3D 测速与心跳动态卡片渲染验证', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/')

    // 验证 Hero 右侧卡片状态与速率指示
    const promoCard = page.locator('.hero-promo-wrapper')
    await expect(promoCard).toBeVisible()
    await expect(promoCard).toContainText('光速云 IEPL 专线')
    await expect(promoCard).toContainText('Mbps ↓')
    await expect(promoCard).toContainText('8折码:')
    await expect(promoCard).toContainText('AMM')
    await expect(promoCard).toContainText('7.5 元/月')
  })

  test('知识百科 Pillar 与深度决策页面加载与内链闭环验证', async ({ page }) => {
    await page.goto('/knowledge/')
    await expect(page).toHaveTitle(/知识百科/)

    // 验证 QuickAnswer 与子专题链接
    const quickAnswer = page.locator('text=核心知识全景')
    await expect(quickAnswer).toBeVisible()

    // 验证进入协议深度横评页
    await page.goto('/knowledge/protocols-explained')
    await expect(page).toHaveTitle(/协议深度横评/)
    const vlessText = page.locator('h3', { hasText: 'VLESS 协议：现代代理的“轻量化王者”' })
    await expect(vlessText).toBeVisible()

    // 验证 AI 大模型网络访问指南
    await page.goto('/knowledge/ai-models-network-guide')
    await expect(page).toHaveTitle(/AI 大模型/)
    const aiBox = page.locator('text=AI 访问报错 4 大黄金排查方案')
    await expect(aiBox).toBeVisible()
  })
})
