<template>
  <div
    class="hero-promo-wrapper w-full max-w-[460px] mx-auto select-none"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
    :style="cardStyle"
  >
    <div class="relative rounded-2xl p-5 sm:p-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-blue-200/90 dark:border-blue-800/70 shadow-2xl shadow-blue-500/10 dark:shadow-black/40 overflow-hidden transition-all duration-200">
      <!-- 顶部环境与专线状态指示灯 -->
      <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div class="flex items-center gap-2">
          <span class="relative flex h-2.5 w-2.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span class="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-wide flex items-center gap-1.5">
            <span>光速云 IEPL 专线</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-mono font-bold border border-emerald-200/60 dark:border-emerald-800/60">SLA 99.98%</span>
          </span>
        </div>
        <span class="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900 font-medium">
          2020年起运营
        </span>
      </div>

      <!-- 核心实时速率仪表盘与动态波形 -->
      <div class="py-4">
        <div class="flex items-baseline justify-between mb-1">
          <div class="flex items-baseline gap-1.5">
            <span class="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
              {{ currentSpeed }}
            </span>
            <span class="text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400">Mbps ↓</span>
          </div>
          <div class="flex items-center gap-2 text-xs">
            <div class="text-right">
              <span class="text-[10px] text-slate-400 block">专线延迟</span>
              <span class="font-mono font-bold text-blue-600 dark:text-blue-400">{{ currentPing }} ms</span>
            </div>
            <div class="text-right pl-2 border-l border-slate-200 dark:border-slate-800">
              <span class="text-[10px] text-slate-400 block">丢包率</span>
              <span class="font-mono font-bold text-emerald-600 dark:text-emerald-400">0.00%</span>
            </div>
          </div>
        </div>

        <!-- 动态 SVG 波形图 -->
        <div class="h-10 w-full overflow-hidden flex items-end">
          <svg class="w-full h-8 stroke-blue-500 fill-blue-500/10" viewBox="0 0 300 40" preserveAspectRatio="none">
            <path
              d="M 0 30 Q 30 10 60 25 T 120 15 T 180 28 T 240 10 T 300 20 L 300 40 L 0 40 Z"
              class="animate-pulse"
            />
            <path
              d="M 0 30 Q 30 10 60 25 T 120 15 T 180 28 T 240 10 T 300 20"
              fill="none"
              stroke-width="2.5"
              stroke-linecap="round"
            />
          </svg>
        </div>
      </div>

      <!-- 活跃节点实时心跳轮播 -->
      <div class="space-y-1.5 mb-4">
        <div
          v-for="(node, idx) in nodes"
          :key="idx"
          @click="activeNodeIndex = idx"
          class="flex items-center justify-between p-2 rounded-lg text-xs transition-all cursor-pointer border"
          :class="activeNodeIndex === idx 
            ? 'bg-blue-50/90 dark:bg-blue-950/60 border-blue-300 dark:border-blue-700 shadow-xs' 
            : 'bg-slate-50/60 dark:bg-slate-800/40 border-transparent hover:border-slate-200 dark:hover:border-slate-700'"
        >
          <div class="flex items-center gap-2">
            <span class="text-sm">{{ node.flag }}</span>
            <span class="font-medium text-slate-800 dark:text-slate-200">{{ node.name }}</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800">
              {{ node.tag }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{{ node.ping }}ms</span>
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          </div>
        </div>
      </div>

      <!-- 优惠码与转化 CTA 区域 -->
      <div class="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
        <div class="flex items-center justify-between bg-blue-50/90 dark:bg-blue-950/50 px-3 py-2 rounded-xl border border-blue-200/80 dark:border-blue-900/60">
          <div class="flex items-center gap-1.5 text-xs text-blue-950 dark:text-blue-200">
            <span class="text-rose-500 font-bold">8折码:</span>
            <code class="font-mono font-bold text-blue-700 dark:text-blue-300 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-blue-300 dark:border-blue-700 select-all">AMM</code>
          </div>
          <button
            type="button"
            @click="copyCoupon"
            class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer bg-transparent border-0 p-0"
          >
            {{ copied ? '✓ 已复制!' : '点击复制' }}
          </button>
        </div>

        <div class="flex items-center justify-between gap-3">
          <div class="text-xs">
            <span class="text-slate-500 dark:text-slate-400 block text-[11px]">入门套餐年付折合</span>
            <span class="font-bold text-rose-600 dark:text-rose-400 text-base font-mono">7.5 元/月</span>
          </div>

          <a
            href="https://sahude.gsyvipaff.com/#/?code=keqgvT5Y"
            target="_blank"
            rel="noopener noreferrer"
            class="hero-cta-btn"
          >
            <span>直达光速云官网</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const activeNodeIndex = ref(0)
const currentSpeed = ref('582.4')
const currentPing = ref('18.2')
const copied = ref(false)

const rotateX = ref(0)
const rotateY = ref(0)

const cardStyle = computed(() => {
  return {
    transform: `perspective(1000px) rotateX(${rotateX.value}deg) rotateY(${rotateY.value}deg)`,
    transition: 'transform 0.15s ease-out'
  }
})

function handleMouseMove(e: MouseEvent) {
  const card = e.currentTarget as HTMLElement
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left - rect.width / 2
  const y = e.clientY - rect.top - rect.height / 2
  rotateX.value = -(y / (rect.height / 2)) * 5
  rotateY.value = (x / (rect.width / 2)) * 5
}

function handleMouseLeave() {
  rotateX.value = 0
  rotateY.value = 0
}

const nodes = [
  { flag: '🇭🇰', name: '香港 01 [IEPL专线]', tag: '8K秒播', ping: '18' },
  { flag: '🇯🇵', name: '日本 01 [原生AI]', tag: 'ChatGPT/Claude', ping: '38' },
  { flag: '🇸🇬', name: '新加坡 01 [流媒体]', tag: 'Netflix全解', ping: '45' },
  { flag: '🇺🇸', name: '美国 01 [原生住宅]', tag: '450M峰值', ping: '135' }
]

let timer: number | null = null

function updateMetrics() {
  const speeds = ['576.8', '584.2', '591.0', '582.4', '579.5', '588.6']
  const pings = ['17.8', '18.4', '18.1', '19.0', '18.2', '18.5']
  const randomIdx = Math.floor(Math.random() * speeds.length)
  currentSpeed.value = speeds[randomIdx]
  currentPing.value = pings[randomIdx]
  activeNodeIndex.value = (activeNodeIndex.value + 1) % nodes.length
}

async function copyCoupon() {
  try {
    await navigator.clipboard.writeText('AMM')
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    copied.value = true
  }
}

onMounted(() => {
  timer = window.setInterval(updateMetrics, 2800)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped>
.hero-promo-wrapper {
  transform-style: preserve-3d;
}

.hero-cta-btn {
  flex: 1;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 6px !important;
  padding: 10px 18px !important;
  border-radius: 12px !important;
  background: linear-gradient(135deg, #0c87eb 0%, #026bc9 100%) !important;
  color: #ffffff !important;
  font-size: 13px !important;
  font-weight: 700 !important;
  text-decoration: none !important;
  box-shadow: 0 4px 14px rgba(12, 135, 235, 0.35) !important;
  transition: all 0.2s ease !important;
  white-space: nowrap !important;
  border: none !important;
}

.hero-cta-btn:hover {
  background: linear-gradient(135deg, #026bc9 0%, #0355a3 100%) !important;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(12, 135, 235, 0.45) !important;
  color: #ffffff !important;
}

.hero-cta-btn:active {
  transform: scale(0.98);
}
</style>
