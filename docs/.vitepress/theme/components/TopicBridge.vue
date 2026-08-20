<template>
  <div class="my-6 p-4 sm:p-5 rounded-xl border border-emerald-200/80 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/30 border-l-4 border-l-emerald-600 dark:border-l-emerald-400">
    <div class="flex items-center gap-2 mb-2 font-semibold text-emerald-900 dark:text-emerald-300 text-sm sm:text-base">
      <svg class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
      <span>{{ title || '下一步建议阅读 (Next Best Step)' }}</span>
    </div>
    <div class="text-xs sm:text-sm md:text-base leading-relaxed pl-0 sm:pl-6 text-slate-700 dark:text-slate-200 mb-3">
      <slot></slot>
    </div>
    <div v-if="targetLink && targetText" class="pl-0 sm:pl-6">
      <a :href="targetLink" class="topic-btn">
        <span>{{ targetText }}</span>
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
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

<style scoped>
.topic-btn {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 6px !important;
  padding: 10px 20px !important;
  border-radius: 10px !important;
  background: linear-gradient(135deg, #059669 0%, #047857 100%) !important;
  color: #ffffff !important;
  font-size: 13px !important;
  font-weight: 700 !important;
  text-decoration: none !important;
  box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3) !important;
  transition: all 0.2s ease !important;
  border: none !important;
}

.topic-btn span {
  color: #ffffff !important;
}

.topic-btn svg {
  color: #ffffff !important;
  stroke: #ffffff !important;
}

.topic-btn:hover {
  background: linear-gradient(135deg, #047857 0%, #065f46 100%) !important;
  color: #ffffff !important;
  transform: translateY(-1px);
}

.topic-btn:active {
  transform: scale(0.98);
}
</style>
