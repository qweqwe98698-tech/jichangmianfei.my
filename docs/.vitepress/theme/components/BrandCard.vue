<template>
  <div class="my-8 rounded-2xl border-2 border-blue-500/30 bg-gradient-to-br from-blue-50/90 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/40 p-6 sm:p-7 shadow-lg relative overflow-hidden">
    <!-- 商业披露标签 -->
    <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 mb-4 border border-blue-200 dark:border-blue-700">
      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>自营品牌透明披露 / 商业服务推荐</span>
    </div>

    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div class="space-y-2">
        <h3 class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>{{ brandName || '光速云 (Guangshu Cloud)' }}</span>
          <span class="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 font-normal">IEPL BGP 专线</span>
        </h3>
        <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
          {{ description || '全中转 BGP/IEPL 内网专线传输，晚高峰 4K/8K 视频秒开，原生流媒体与 ChatGPT/Claude/Gemini AI 全场景解锁，支持全平台一键导入。' }}
        </p>
        
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 text-xs text-slate-500 dark:text-slate-400">
          <div class="flex items-center gap-1">
            <span class="text-emerald-500 font-bold">✓</span> 晚高峰速率保障
          </div>
          <div class="flex items-center gap-1">
            <span class="text-emerald-500 font-bold">✓</span> AI / 流媒体全解锁
          </div>
          <div class="flex items-center gap-1">
            <span class="text-emerald-500 font-bold">✓</span> 7×24h 在线客服与工单
          </div>
          <div class="flex items-center gap-1">
            <span class="text-emerald-500 font-bold">✓</span> 支持月付 / 无绑定
          </div>
          <div class="flex items-center gap-1">
            <span class="text-emerald-500 font-bold">✓</span> 全平台客户端一键订阅
          </div>
          <div class="flex items-center gap-1">
            <span class="text-emerald-500 font-bold">✓</span> 售后退款保障承诺
          </div>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end justify-center gap-3 min-w-[200px]">
        <a
          :href="affLink || 'https://sahude.gsyvipaff.com/#/?code=keqgvT5Y'"
          target="_blank"
          rel="noopener noreferrer"
          class="w-full sm:w-auto text-center px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-base shadow-md hover:shadow-blue-500/25 transition-all no-underline inline-block"
        >
          查看实时套餐与直达官网 →
        </a>
        <a
          href="/product/guangshuyun"
          class="text-xs text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 text-center underline"
        >
          阅读光速云完整实测与限制说明
        </a>
      </div>
    </div>
    
    <div class="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 leading-tight">
      提示：网络连接服务需配合合规用途使用。请根据自身网络需求理性选择月付或短周期套餐，切勿轻信所谓的“永久免费”或无法验证的承诺。
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
