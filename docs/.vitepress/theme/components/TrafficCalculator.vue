<template>
  <div class="my-8 p-5 sm:p-7 rounded-2xl border border-blue-200 dark:border-blue-800 bg-gradient-to-b from-blue-50/60 via-white to-slate-50/80 dark:from-slate-900 dark:via-slate-900/90 dark:to-blue-950/40 shadow-xl">
    <div class="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
      <div>
        <h3 class="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 m-0">
          <span>📊 机场流量消耗与月成本智能测算器</span>
        </h3>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 mb-0">
          拖动下方滑块，根据您的日常真实网络使用场景，精确测算每月所需流量与最佳省钱套餐方案。
        </p>
      </div>
      <span class="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
        实时计算
      </span>
    </div>

    <!-- 交互滑块表单 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <!-- 视频播放 -->
      <div class="p-4 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 shadow-xs">
        <div class="flex justify-between items-center mb-2">
          <label class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <span>🎬 每日 YouTube / Netflix 追剧时长</span>
          </label>
          <span class="font-mono font-extrabold text-blue-600 dark:text-blue-400 text-sm">
            {{ videoHours }} 小时 / 天 ({{ videoQuality }})
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="8"
          step="0.5"
          v-model.number="videoHours"
          class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div class="flex gap-3 mt-2 text-xs">
          <label class="flex items-center gap-1 cursor-pointer">
            <input type="radio" value="1080P" v-model="videoQuality" class="accent-blue-600" />
            <span class="text-slate-600 dark:text-slate-300">1080P 高清 (1.5G/h)</span>
          </label>
          <label class="flex items-center gap-1 cursor-pointer">
            <input type="radio" value="4K" v-model="videoQuality" class="accent-blue-600" />
            <span class="text-slate-600 dark:text-slate-300">4K 超清 (7G/h)</span>
          </label>
        </div>
      </div>

      <!-- AI 交互 -->
      <div class="p-4 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 shadow-xs">
        <div class="flex justify-between items-center mb-2">
          <label class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <span>🤖 每日 ChatGPT / Claude 问答频次</span>
          </label>
          <span class="font-mono font-extrabold text-blue-600 dark:text-blue-400 text-sm">
            {{ aiQueries }} 次 / 天
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="200"
          step="10"
          v-model.number="aiQueries"
          class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div class="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
          AI 对话文本流量极小，主要消耗在网页 WebSockets 长连接保持。
        </div>
      </div>

      <!-- 网页搜索与社交 -->
      <div class="p-4 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 shadow-xs">
        <div class="flex justify-between items-center mb-2">
          <label class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <span>🌐 每日 Google 搜索 / GitHub / 推特浏览</span>
          </label>
          <span class="font-mono font-extrabold text-blue-600 dark:text-blue-400 text-sm">
            {{ webHours }} 小时 / 天
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="10"
          step="1"
          v-model.number="webHours"
          class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      <!-- 设备数量与多人共享 -->
      <div class="p-4 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 shadow-xs">
        <div class="flex justify-between items-center mb-2">
          <label class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <span>📱 同时使用设备数量 (手机/电脑/平板)</span>
          </label>
          <span class="font-mono font-extrabold text-blue-600 dark:text-blue-400 text-sm">
            {{ deviceCount }} 台设备
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="6"
          step="1"
          v-model.number="deviceCount"
          class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>
    </div>

    <!-- 测算结果呈现面板 -->
    <div class="p-5 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
      <div class="space-y-1 text-center md:text-left">
        <div class="text-xs sm:text-sm text-blue-100 font-medium">
          测算您的月度总流量需求约：
        </div>
        <div class="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight flex items-baseline justify-center md:justify-start gap-1">
          <span>{{ calculatedMonthlyTraffic }}</span>
          <span class="text-lg font-bold">GB / 月</span>
        </div>
        <div class="text-xs text-blue-100/90 pt-1">
          推荐方案：<span class="font-bold underline decoration-amber-300">{{ recommendedPlan.name }} ({{ recommendedPlan.traffic }}GB)</span>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
        <div class="text-center md:text-right bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/20">
          <div class="text-[11px] text-blue-100">8折码 <code class="bg-white text-blue-900 font-bold px-1.5 py-0.5 rounded font-mono">AMM</code> 优惠后</div>
          <div class="font-mono text-xl sm:text-2xl font-extrabold text-amber-300">
            {{ recommendedPlan.price }} <span class="text-xs text-white">元/月起</span>
          </div>
        </div>

        <a
          href="https://sahude.gsyvipaff.com/#/?code=keqgvT5Y"
          target="_blank"
          rel="noopener noreferrer"
          class="calc-cta-btn"
        >
          <span>直达光速云开通推荐方案 →</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const videoHours = ref(1.5)
const videoQuality = ref<'1080P' | '4K'>('1080P')
const aiQueries = ref(40)
const webHours = ref(2)
const deviceCount = ref(2)

const calculatedMonthlyTraffic = computed(() => {
  const videoGBPerHour = videoQuality.value === '4K' ? 7 : 1.5
  const monthlyVideo = videoHours.value * videoGBPerHour * 30
  const monthlyAi = (aiQueries.value * 0.005) * 30 + 1.5 // 少量对话+长连接
  const monthlyWeb = webHours.value * 0.3 * 30
  const total = (monthlyVideo + monthlyAi + monthlyWeb) * Math.sqrt(deviceCount.value)
  return Math.max(20, Math.round(total))
})

const recommendedPlan = computed(() => {
  const traffic = calculatedMonthlyTraffic.value
  if (traffic <= 60) {
    return { name: '光速云·基础入门年付款', traffic: 59, price: '7.5' }
  } else if (traffic <= 160) {
    return { name: '光速云·进阶主力日常款', traffic: 150, price: '15.0' }
  } else if (traffic <= 320) {
    return { name: '光速云·旗舰大流量款', traffic: 300, price: '25.0' }
  } else {
    return { name: '光速云·企业商务尊享款', traffic: 600, price: '45.0' }
  }
})
</script>

<style scoped>
.calc-cta-btn {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 12px 22px !important;
  border-radius: 12px !important;
  background: #ffffff !important;
  color: #026bc9 !important;
  font-size: 14px !important;
  font-weight: 700 !important;
  text-decoration: none !important;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15) !important;
  transition: all 0.2s ease !important;
  white-space: nowrap !important;
  border: none !important;
}

.calc-cta-btn:hover {
  background: #f0f7ff !important;
  color: #0355a3 !important;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25) !important;
}

.calc-cta-btn:active {
  transform: scale(0.98);
}
</style>
