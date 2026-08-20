<template>
  <div class="traffic-calc-card my-8 p-5 sm:p-7 rounded-2xl border border-blue-200/90 dark:border-blue-900 bg-white dark:bg-slate-900 shadow-xl">
    <!-- 头部标题 -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
      <div>
        <h3 class="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 m-0">
          <span>📊 机场流量消耗与月成本智能测算器</span>
        </h3>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 mb-0">
          拖动下方滑块，根据日常真实网络使用场景，精确测算每月所需流量与省钱套餐方案。
        </p>
      </div>
      <div class="self-start sm:self-auto">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          实时动态测算
        </span>
      </div>
    </div>

    <!-- 交互滑块表单 (2x2 网格) -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-6">
      <!-- 1. 视频追剧 -->
      <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="flex justify-between items-center mb-2 gap-2">
          <span class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
            🎬 YouTube / Netflix 追剧时长
          </span>
          <span class="font-mono font-extrabold text-blue-600 dark:text-blue-400 text-xs sm:text-sm whitespace-nowrap">
            {{ videoHours }} 小时/天 ({{ videoQuality }})
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="8"
          step="0.5"
          v-model.number="videoHours"
          class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 my-2"
        />
        <div class="flex gap-4 mt-2 text-xs">
          <label class="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
            <input type="radio" value="1080P" v-model="videoQuality" class="accent-blue-600" />
            <span>1080P 高清 (1.5G/h)</span>
          </label>
          <label class="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
            <input type="radio" value="4K" v-model="videoQuality" class="accent-blue-600" />
            <span>4K 超清 (7G/h)</span>
          </label>
        </div>
      </div>

      <!-- 2. AI 问答交互 -->
      <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="flex justify-between items-center mb-2 gap-2">
          <span class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
            🤖 ChatGPT / Claude 问答频次
          </span>
          <span class="font-mono font-extrabold text-blue-600 dark:text-blue-400 text-xs sm:text-sm whitespace-nowrap">
            {{ aiQueries }} 次/天
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="200"
          step="10"
          v-model.number="aiQueries"
          class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 my-2"
        />
        <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
          注：文本对话流量极小，主要消耗在网页长连接保持。
        </div>
      </div>

      <!-- 3. 网页搜索与社交 -->
      <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="flex justify-between items-center mb-2 gap-2">
          <span class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
            🌐 Google 搜索 / GitHub / 推特
          </span>
          <span class="font-mono font-extrabold text-blue-600 dark:text-blue-400 text-xs sm:text-sm whitespace-nowrap">
            {{ webHours }} 小时/天
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="10"
          step="1"
          v-model.number="webHours"
          class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 my-2"
        />
        <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
          含外贸邮件、学术查重与技术文档检索。
        </div>
      </div>

      <!-- 4. 同时使用设备数量 -->
      <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
        <div class="flex justify-between items-center mb-2 gap-2">
          <span class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
            📱 同时使用设备 (手机/电脑/平板)
          </span>
          <span class="font-mono font-extrabold text-blue-600 dark:text-blue-400 text-xs sm:text-sm whitespace-nowrap">
            {{ deviceCount }} 台设备
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="6"
          step="1"
          v-model.number="deviceCount"
          class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 my-2"
        />
        <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
          支持多设备同时并发连接，不限设备类型。
        </div>
      </div>
    </div>

    <!-- 测算结果呈现面板 (强对比深蓝底色) -->
    <div class="calc-result-box p-5 sm:p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-5">
      <div class="space-y-1.5 text-center md:text-left w-full md:w-auto">
        <div class="text-xs sm:text-sm text-blue-200 font-medium">
          测算您的月度总流量需求约：
        </div>
        <div class="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight flex items-baseline justify-center md:justify-start gap-1">
          <span>{{ calculatedMonthlyTraffic }}</span>
          <span class="text-lg font-bold text-blue-200">GB / 月</span>
        </div>
        <div class="text-xs text-blue-100 pt-1">
          推荐方案：<span class="font-bold text-amber-300 underline underline-offset-4">{{ recommendedPlan.name }} ({{ recommendedPlan.traffic }}GB)</span>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
        <div class="text-center sm:text-right bg-white/10 px-4 py-2.5 rounded-xl border border-white/20 w-full sm:w-auto">
          <div class="text-[11px] text-blue-100 font-medium">
            8折码 <code class="bg-white text-blue-900 font-extrabold px-1.5 py-0.5 rounded font-mono text-xs">AMM</code> 优惠后
          </div>
          <div class="font-mono text-xl sm:text-2xl font-extrabold text-amber-300 mt-0.5">
            {{ recommendedPlan.price }} <span class="text-xs text-white font-normal">元/月起</span>
          </div>
        </div>

        <a
          href="https://sahude.gsyvipaff.com/#/?code=keqgvT5Y"
          target="_blank"
          rel="noopener noreferrer"
          class="calc-cta-btn w-full sm:w-auto"
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
  const monthlyAi = (aiQueries.value * 0.005) * 30 + 1.5
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
.calc-result-box {
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0369a1 100%) !important;
  color: #ffffff !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
}

.calc-cta-btn {
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 12px 24px !important;
  border-radius: 12px !important;
  background: #ffffff !important;
  color: #026bc9 !important;
  font-size: 14px !important;
  font-weight: 800 !important;
  text-decoration: none !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2) !important;
  transition: all 0.2s ease !important;
  white-space: nowrap !important;
  border: none !important;
  cursor: pointer !important;
}

.calc-cta-btn:hover {
  background: #f0f7ff !important;
  color: #0355a3 !important;
  transform: translateY(-1px);
  box-shadow: 0 6px 22px rgba(0, 0, 0, 0.3) !important;
}

.calc-cta-btn:active {
  transform: scale(0.98);
}
</style>
