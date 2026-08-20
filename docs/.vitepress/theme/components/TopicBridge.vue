<template>
  <div class="my-8 p-5 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/60 dark:bg-emerald-950/30">
    <div class="flex items-center gap-2 mb-2 font-semibold text-emerald-800 dark:text-emerald-300 text-base">
      <svg class="w-5 h-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
      <span>{{ title || '下一步建议阅读 (Next Best Step)' }}</span>
    </div>
    <div class="text-sm sm:text-base leading-relaxed pl-7 text-slate-700 dark:text-slate-200 mb-3">
      <slot></slot>
    </div>
    <div v-if="targetLink && targetText" class="pl-7">
      <a :href="targetLink" class="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors no-underline">
        <span>{{ targetText }}</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  targetLink?: string
  targetText?: string
}>()
</script>
