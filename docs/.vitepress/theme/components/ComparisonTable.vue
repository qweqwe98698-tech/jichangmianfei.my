<template>
  <div class="my-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
    <table class="min-w-full text-left text-sm divide-y divide-slate-200 dark:divide-slate-800">
      <thead class="bg-slate-100 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100">
        <tr>
          <th v-for="(col, i) in headers" :key="i" class="px-4 py-3 font-semibold">
            {{ col }}
          </th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900/60">
        <tr v-for="(row, rIndex) in rows" :key="rIndex" class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
          <td v-for="(cell, cIndex) in row" :key="cIndex" class="px-4 py-3 text-slate-700 dark:text-slate-300">
            <span v-if="typeof cell === 'string' && cell.startsWith('✓')" class="text-emerald-600 dark:text-emerald-400 font-semibold">{{ cell }}</span>
            <span v-else-if="typeof cell === 'string' && cell.startsWith('✗')" class="text-red-500 font-semibold">{{ cell }}</span>
            <span v-else>{{ cell }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  headers: string[]
  rows: Array<string[]>
}>()
</script>
