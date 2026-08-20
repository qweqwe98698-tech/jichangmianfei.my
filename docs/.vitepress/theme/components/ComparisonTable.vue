<template>
  <div class="my-6">
    <!-- 桌面端/平板端：标准结构化表格 -->
    <div class="hidden sm:block overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900/60">
      <table class="min-w-full text-left text-sm divide-y divide-slate-200 dark:divide-slate-800">
        <thead class="bg-slate-100/80 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100">
          <tr>
            <th v-for="(col, i) in headers" :key="i" class="px-4 py-3 font-semibold text-xs tracking-wider uppercase">
              {{ col }}
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900/40">
          <tr v-for="(row, rIndex) in rows" :key="rIndex" class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
            <td v-for="(cell, cIndex) in row" :key="cIndex" class="px-4 py-3 text-slate-700 dark:text-slate-300">
              <span v-if="typeof cell === 'string' && cell.startsWith('✓')" class="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                {{ cell }}
              </span>
              <span v-else-if="typeof cell === 'string' && cell.startsWith('✗')" class="inline-flex items-center gap-1 text-rose-500 font-semibold">
                {{ cell }}
              </span>
              <span v-else>{{ cell }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 手机端 (<640px)：智能卡片化呈现 (Mobile Card View) -->
    <div class="block sm:hidden space-y-3">
      <div
        v-for="(row, rIndex) in rows"
        :key="rIndex"
        class="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
      >
        <!-- 主标题 (通常为第一列) -->
        <div class="font-bold text-slate-900 dark:text-white text-sm pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span>{{ row[0] }}</span>
          <span class="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 font-medium">
            指标 {{ rIndex + 1 }}
          </span>
        </div>

        <!-- 详细键值对 (后续各列) -->
        <div class="mt-2.5 space-y-2 text-xs">
          <div
            v-for="(cell, cIndex) in row.slice(1)"
            :key="cIndex"
            class="flex flex-col gap-0.5 bg-slate-50/70 dark:bg-slate-800/40 p-2 rounded-lg"
          >
            <span class="text-slate-400 dark:text-slate-500 font-medium text-[11px]">
              {{ headers[cIndex + 1] }}
            </span>
            <span class="text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
              <span v-if="typeof cell === 'string' && cell.startsWith('✓')" class="text-emerald-600 dark:text-emerald-400 font-medium">
                {{ cell }}
              </span>
              <span v-else-if="typeof cell === 'string' && cell.startsWith('✗')" class="text-rose-500 font-medium">
                {{ cell }}
              </span>
              <span v-else>{{ cell }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  headers: string[]
  rows: Array<string[]>
}>()
</script>
