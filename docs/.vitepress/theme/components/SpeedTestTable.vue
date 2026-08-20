<template>
  <div class="my-6 rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900 shadow-sm">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-200 dark:border-slate-800">
      <div>
        <h4 class="font-bold text-slate-900 dark:text-white text-base">{{ title || '实测数据与延迟参考' }}</h4>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">测试环境：{{ environment || '上海电信 1000M / 晚高峰 20:30 实测' }}</p>
      </div>
      <span class="inline-flex items-center text-xs px-2.5 py-1 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-medium">
        已核验 (2026)
      </span>
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full text-left text-xs sm:text-sm">
        <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-semibold">
          <tr>
            <th class="px-3 py-2">节点区域</th>
            <th class="px-3 py-2">线路类型</th>
            <th class="px-3 py-2">平均延迟</th>
            <th class="px-3 py-2">下行速率</th>
            <th class="px-3 py-2">4K/8K 视频体验</th>
            <th class="px-3 py-2">解锁状态</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
          <tr v-for="(item, idx) in records" :key="idx" class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
            <td class="px-3 py-2.5 font-medium text-slate-900 dark:text-slate-200">{{ item.region }}</td>
            <td class="px-3 py-2.5 text-slate-600 dark:text-slate-400">{{ item.line }}</td>
            <td class="px-3 py-2.5 font-mono text-blue-600 dark:text-blue-400">{{ item.ping }}</td>
            <td class="px-3 py-2.5 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{{ item.speed }}</td>
            <td class="px-3 py-2.5">{{ item.video }}</td>
            <td class="px-3 py-2.5 text-emerald-600 dark:text-emerald-400">{{ item.unlock }}</td>
          </tr>
        </tbody>
      </table>
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
