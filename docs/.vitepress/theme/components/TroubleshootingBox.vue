<template>
  <div class="my-6 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 p-5">
    <div class="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-300 text-base mb-3">
      <svg class="w-5 h-5 flex-shrink-0 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <span>{{ title || '排查决策树：常见症状与针对解决' }}</span>
    </div>
    
    <div class="space-y-3">
      <div
        v-for="(step, idx) in steps"
        :key="idx"
        class="bg-white/80 dark:bg-slate-900/70 p-3.5 rounded-lg border border-amber-100 dark:border-amber-950/50"
      >
        <div class="font-semibold text-slate-800 dark:text-slate-200 text-sm flex items-center gap-2">
          <span class="w-5 h-5 rounded-full bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-center font-bold">{{ idx + 1 }}</span>
          {{ step.symptom }}
        </div>
        <div class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5 pl-7 leading-relaxed">
          <span class="text-amber-700 dark:text-amber-400 font-medium">排查方案：</span>{{ step.solution }}
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
