<template>
  <div class="my-7 rounded-2xl border border-blue-200/80 dark:border-blue-800/60 bg-gradient-to-b from-blue-50/70 via-white to-slate-50/80 dark:from-slate-900 dark:via-slate-900/90 dark:to-blue-950/40 p-4 sm:p-6 shadow-md relative overflow-hidden">
    <!-- 顶部披露与标签 -->
    <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
      <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100/80 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 border border-blue-200/60 dark:border-blue-700/60">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        自营品牌透明披露 / 商业推荐
      </span>
      <div class="flex items-center gap-1.5">
        <span class="text-[11px] px-2 py-0.5 rounded bg-emerald-100/90 text-emerald-900 dark:bg-emerald-900/50 dark:text-emerald-300 font-medium">
          2020年起稳定运营
        </span>
        <span class="text-[11px] px-2 py-0.5 rounded bg-amber-100/90 text-amber-900 dark:bg-amber-900/50 dark:text-amber-300 font-medium">
          IEPL 专线 · VLESS
        </span>
      </div>
    </div>

    <!-- 标题与价格亮点 -->
    <div class="space-y-2">
      <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
        <h3 class="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>{{ brandName || '光速云 (Guangshu Cloud)' }}</span>
        </h3>
        <div class="text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400">
          入门套餐折合约 <span class="text-base sm:text-lg font-bold text-rose-600 dark:text-rose-400">7.5</span> 元/月 (59GB)
        </div>
      </div>

      <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        {{ description || '2020年稳定运营至今的老牌综合型专线机场。主打 IEPL 企业级内网专线与 VLESS 高性能协议，提供官方自研客户端，同时支持 Clash、Shadowrocket、sing-box、v2rayN 一键导入。' }}
      </p>

      <!-- 优惠码提示卡片 -->
      <div class="p-2.5 rounded-lg bg-blue-100/60 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/80 flex items-center justify-between gap-2 text-xs">
        <div class="flex items-center gap-1.5 text-blue-900 dark:text-blue-200">
          <span class="font-bold text-rose-600 dark:text-rose-400">🎁 新人专属 8 折优惠码：</span>
          <code class="px-2 py-0.5 rounded bg-white dark:bg-slate-900 font-mono font-bold text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700 select-all cursor-pointer">AMM</code>
        </div>
        <span class="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:inline">结账时输入立享 8 折</span>
      </div>

      <!-- 核心特性标签：移动端自适应紧凑 Badge -->
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-1 text-[11px] sm:text-xs text-slate-600 dark:text-slate-300">
        <div class="flex items-center gap-1.5 bg-white/80 dark:bg-slate-800/60 p-1.5 rounded border border-slate-100 dark:border-slate-800">
          <span class="text-emerald-500 font-bold">✓</span> IEPL 内网专线
        </div>
        <div class="flex items-center gap-1.5 bg-white/80 dark:bg-slate-800/60 p-1.5 rounded border border-slate-100 dark:border-slate-800">
          <span class="text-emerald-500 font-bold">✓</span> VLESS / SS 协议
        </div>
        <div class="flex items-center gap-1.5 bg-white/80 dark:bg-slate-800/60 p-1.5 rounded border border-slate-100 dark:border-slate-800">
          <span class="text-emerald-500 font-bold">✓</span> 提供自研客户端
        </div>
        <div class="flex items-center gap-1.5 bg-white/80 dark:bg-slate-800/60 p-1.5 rounded border border-slate-100 dark:border-slate-800">
          <span class="text-emerald-500 font-bold">✓</span> AI / 全流媒体解锁
        </div>
        <div class="flex items-center gap-1.5 bg-white/80 dark:bg-slate-800/60 p-1.5 rounded border border-slate-100 dark:border-slate-800">
          <span class="text-emerald-500 font-bold">✓</span> 支付宝 / 微信 / USDT
        </div>
        <div class="flex items-center gap-1.5 bg-white/80 dark:bg-slate-800/60 p-1.5 rounded border border-slate-100 dark:border-slate-800">
          <span class="text-emerald-500 font-bold">✓</span> 售后退款保障
        </div>
      </div>
    </div>

    <!-- 触控友好的操作按钮区 (手机端全宽) -->
    <div class="mt-4 pt-3 border-t border-slate-200/70 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
      <a
        :href="affLink || 'https://sahude.gsyvipaff.com/#/?code=keqgvT5Y'"
        target="_blank"
        rel="noopener noreferrer"
        class="w-full sm:w-auto text-center px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-sm transition-all no-underline inline-flex items-center justify-center gap-1.5 active:scale-[0.98]"
      >
        <span>前往光速云官网直达开通 (优惠码: AMM)</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </a>

      <a
        href="/product/guangshuyun"
        class="text-xs text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 text-center py-1 underline"
      >
        查看 70+ 节点实测长图与解锁报告 →
      </a>
    </div>

    <div class="mt-2 text-[10px] text-slate-400 dark:text-slate-500 text-center sm:text-left">
      * 注：7.5 元/月为入门年付套餐折算后的月均成本；支持微信、支付宝、USDT 支付，新用户结算输入 <code>AMM</code> 享 8 折特惠。
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  brandName?: string
  description?: string
  affLink?: string
}>()
</script>
