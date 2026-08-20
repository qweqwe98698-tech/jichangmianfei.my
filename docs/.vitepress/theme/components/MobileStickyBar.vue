<template>
  <!-- 手机端长文常驻底部悬浮转化栏 (Sticky Bottom CTA Bar) -->
  <Transition name="fade-slide">
    <div
      v-if="isVisible"
      class="fixed bottom-0 left-0 right-0 z-40 sm:hidden px-4 py-2.5 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800/80 shadow-lg pb-[max(0.625rem,env(safe-area-inset-bottom))]"
    >
      <div class="flex items-center justify-between gap-3 max-w-md mx-auto">
        <a
          href="/free-airport/recommendations"
          class="flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 active:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-transform active:scale-95 no-underline"
        >
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>⚡ 光速云专线实测 / 直达</span>
        </a>

        <a
          href="https://sahude.gsyvipaff.com/#/?code=keqgvT5Y"
          target="_blank"
          rel="noopener noreferrer"
          class="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-blue-600 text-xs font-medium border border-slate-200 dark:border-slate-700 transition-colors no-underline whitespace-nowrap"
        >
          官网注册 →
        </a>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const isVisible = ref(false)

function handleScroll() {
  // 不在首页展示底部悬浮栏，仅在文章长文页面展示
  if (route.path === '/' || route.path === '/index.html') {
    isVisible.value = false
    return
  }

  const scrollY = window.scrollY
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  // 当滑动超过 200px 且未到底部时展示
  if (scrollY > 250 && docHeight > 600) {
    isVisible.value = true
  } else {
    isVisible.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(100%);
}
</style>
