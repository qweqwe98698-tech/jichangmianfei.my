<template>
  <div class="my-6 space-y-3">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/50 dark:bg-slate-900/50 transition-colors"
    >
      <button
        type="button"
        @click="toggle(index)"
        class="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-semibold text-slate-800 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
      >
        <span class="text-sm sm:text-base flex items-center gap-2">
          <span class="text-blue-600 dark:text-blue-400 font-bold">Q:</span>
          {{ item.q }}
        </span>
        <svg
          class="w-4 h-4 flex-shrink-0 transition-transform duration-200"
          :class="{ 'rotate-180': openIndex === index }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        v-show="openIndex === index"
        class="px-5 pb-4 pt-1 text-sm text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/80 leading-relaxed"
      >
        <p class="mt-2">{{ item.a }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  items: Array<{ q: string; a: string }>
}>()

const openIndex = ref<number | null>(0)

function toggle(index: number) {
  openIndex.value = openIndex.value === index ? null : index
}
</script>
