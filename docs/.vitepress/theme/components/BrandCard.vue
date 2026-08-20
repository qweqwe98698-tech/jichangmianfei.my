<template>
  <div class="my-7 rounded-2xl border border-blue-200/80 dark:border-blue-800/60 bg-gradient-to-b from-blue-50/70 via-white to-slate-50/80 dark:from-slate-900 dark:via-slate-900/90 dark:to-blue-950/40 p-4 sm:p-6 shadow-md relative overflow-hidden">
    <!-- 顶部披露标签 -->
    <div class="flex flex-wrap items-center justify-between gap-2 mb-3">
      <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100/80 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 border border-blue-200/60 dark:border-blue-700/60">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        自营品牌透明披露 / 商业推荐
      </span>
      <span class="text-[11px] px-2 py-0.5 rounded bg-amber-100/90 text-amber-900 dark:bg-amber-900/50 dark:text-amber-300 font-medium">
        IEPL BGP 专线
      </span>
    </div>

    <!-- 标题与描述 -->
    <div class="space-y-2">
      <h3 class="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <span>{{ brandName || '光速云 (Guangshu Cloud)' }}</span>
      </h3>
      <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        {{ description || '全中转 BGP/IEPL 内网专线传输，晚高峰 4K/8K 视频秒开，原生流媒体与 ChatGPT/Claude/Gemini AI 全场景解锁，支持全平台一键导入。' }}
      </p>

      <!-- 核心特性标签：移动端自适应紧凑 Badge -->
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-1.5 pt-2 text-[11px] sm:text-xs text-slate-600 dark:text-slate-300">
        <div class="flex items-center gap-1.5 bg-white/80 dark:bg-slate-800/60 p-1.5 rounded border border-slate-100 dark:border-slate-800">
          <span class="text-emerald-500 font-bold">✓</span> 晚高峰速率保障
        </div>
        <div class="flex items-center gap-1.5 bg-white/80 dark:bg-slate-800/60 p-1.5 rounded border border-slate-100 dark:border-slate-800">
          <span class="text-emerald-500 font-bold">✓</span> AI / 流媒体全解锁
        </div>
        <div class="flex items-center gap-1.5 bg-white/80 dark:bg-slate-800/60 p-1.5 rounded border border-slate-100 dark:border-slate-800">
          <span class="text-emerald-500 font-bold">✓</span> 7×24h 在线客服
        </div>
        <div class="flex items-center gap-1.5 bg-white/80 dark:bg-slate-800/60 p-1.5 rounded border border-slate-100 dark:border-slate-800">
          <span class="text-emerald-500 font-bold">✓</span> 支持灵活月付
        </div>
        <div class="flex items-center gap-1.5 bg-white/80 dark:bg-slate-800/60 p-1.5 rounded border border-slate-100 dark:border-slate-800">
          <span class="text-emerald-500 font-bold">✓</span> 全平台一键订阅
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
        <span>查看实时套餐与直达官网</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </a>

      <a
        href="/product/guangshuyun"
        class="text-xs text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 text-center py-1 underline"
      >
        阅读光速云完整实测与限制说明
      </a>
    </div>

    <div class="mt-2 text-[10px] text-slate-400 dark:text-slate-500 text-center sm:text-left">
      提示：请根据实际需求理性选择月付或体验套餐，网络服务需配合合规用途使用。
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
