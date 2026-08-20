<template>
  <div class="my-6 rounded-xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 bg-white dark:bg-slate-900 shadow-sm">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
      <div>
        <h4 class="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
          <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>{{ title || '实测数据与延迟参考' }}</span>
        </h4>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">测试环境：{{ environment || '上海电信 1000M / 晚高峰 20:30 实测' }}</p>
      </div>
      <span class="inline-flex items-center text-[11px] px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-medium border border-emerald-200/60 dark:border-emerald-800/60 self-start sm:self-auto">
        ✓ 真实测试数据已核验
      </span>
    </div>

    <!-- 桌面端表格视图 -->
    <div class="hidden sm:block overflow-x-auto">
      <table class="min-w-full text-left text-xs sm:text-sm">
        <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-semibold">
          <tr>
            <th class="px-3 py-2.5">节点区域</th>
            <th class="px-3 py-2.5">线路类型</th>
            <th class="px-3 py-2.5">平均延迟</th>
            <th class="px-3 py-2.5">下行速率</th>
            <th class="px-3 py-2.5">4K/8K 视频体验</th>
            <th class="px-3 py-2.5">解锁状态</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
          <tr v-for="(item, idx) in records" :key="idx" class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
            <td class="px-3 py-2.5 font-medium text-slate-900 dark:text-slate-200">{{ item.region }}</td>
            <td class="px-3 py-2.5 text-slate-600 dark:text-slate-400">{{ item.line }}</td>
            <td class="px-3 py-2.5 font-mono text-blue-600 dark:text-blue-400">{{ item.ping }}</td>
            <td class="px-3 py-2.5 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{{ item.speed }}</td>
            <td class="px-3 py-2.5 text-slate-700 dark:text-slate-300">{{ item.video }}</td>
            <td class="px-3 py-2.5 text-emerald-600 dark:text-emerald-400">{{ item.unlock }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 手机端卡片视图 (Mobile Card View) -->
    <div class="block sm:hidden space-y-3">
      <div
        v-for="(item, idx) in records"
        :key="idx"
        class="p-3.5 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40"
      >
        <div class="flex items-center justify-between gap-2 pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
          <span class="font-bold text-slate-900 dark:text-white text-sm">{{ item.region }}</span>
          <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-blue-100/80 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-semibold">
            {{ item.ping }}
          </span>
        </div>

        <div class="grid grid-cols-2 gap-2 mt-2.5 text-xs">
          <div class="bg-white dark:bg-slate-900 p-2 rounded border border-slate-100 dark:border-slate-800">
            <span class="text-slate-400 dark:text-slate-500 block text-[10px]">下行峰值速率</span>
            <span class="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-xs">{{ item.speed }}</span>
          </div>
          <div class="bg-white dark:bg-slate-900 p-2 rounded border border-slate-100 dark:border-slate-800">
            <span class="text-slate-400 dark:text-slate-500 block text-[10px]">线路类型</span>
            <span class="text-slate-700 dark:text-slate-300 font-medium text-xs">{{ item.line }}</span>
          </div>
        </div>

        <div class="mt-2 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-2 rounded border border-slate-100 dark:border-slate-800 flex flex-col gap-1">
          <div class="flex items-center justify-between">
            <span class="text-slate-400 text-[10px]">流媒体体验:</span>
            <span>{{ item.video }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-slate-400 text-[10px]">AI / 流媒体解锁:</span>
            <span class="text-emerald-600 dark:text-emerald-400 font-medium">{{ item.unlock }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Record {
  region: string
  line: string
  ping: string
  speed: string
  video: string
  unlock: string
}

defineProps<{
  title?: string
  environment?: string
  records: Record[]
}>()
</script>
