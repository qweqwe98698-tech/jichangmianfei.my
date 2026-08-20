<template>
  <div class="my-6 p-5 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/70 dark:bg-blue-950/40 text-slate-800 dark:text-slate-100 shadow-sm">
    <div class="flex items-center gap-2 mb-2 font-semibold text-blue-800 dark:text-blue-300 text-base">
      <svg class="w-5 h-5 flex-shrink-0 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
      <span>{{ title || '30秒快速解答 (Quick Answer)' }}</span>
    </div>
    <div class="text-sm sm:text-base leading-relaxed pl-7 text-slate-700 dark:text-slate-200">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>
