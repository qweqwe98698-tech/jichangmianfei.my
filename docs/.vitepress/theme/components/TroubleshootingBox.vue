<template>
  <div class="my-6 rounded-xl border border-amber-200/80 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 p-4 sm:p-5 border-l-4 border-l-amber-500">
    <div class="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300 text-sm sm:text-base mb-3">
      <svg class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <span>{{ title || '排查决策树：常见症状与针对解决' }}</span>
    </div>
    
    <div class="space-y-2.5">
      <div
        v-for="(step, idx) in steps"
        :key="idx"
        class="bg-white/90 dark:bg-slate-900/80 p-3 sm:p-3.5 rounded-lg border border-amber-100/80 dark:border-amber-950/60 shadow-xs"
      >
        <div class="font-semibold text-slate-800 dark:text-slate-200 text-xs sm:text-sm flex items-start gap-2">
          <span class="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex-shrink-0 flex items-center justify-center font-bold mt-0.5">{{ idx + 1 }}</span>
          <span>{{ step.symptom }}</span>
        </div>
        <div class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5 pl-6 leading-relaxed">
          <span class="text-amber-800 dark:text-amber-400 font-semibold">解决方案：</span>{{ step.solution }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string
  steps: Array<{ symptom: string; solution: string }>
}>()
</script>
