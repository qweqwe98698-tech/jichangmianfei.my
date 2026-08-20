import DefaultTheme from 'vitepress/theme'
import { h } from 'vue'
import './custom.css'
import type { Theme } from 'vitepress'

import QuickAnswer from './components/QuickAnswer.vue'
import TopicBridge from './components/TopicBridge.vue'
import BrandCard from './components/BrandCard.vue'
import ComparisonTable from './components/ComparisonTable.vue'
import FaqAccordion from './components/FaqAccordion.vue'
import SpeedTestTable from './components/SpeedTestTable.vue'
import TroubleshootingBox from './components/TroubleshootingBox.vue'
import MobileStickyBar from './components/MobileStickyBar.vue'
import HeroPromoCard from './components/HeroPromoCard.vue'
import TrafficCalculator from './components/TrafficCalculator.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'layout-bottom': () => h(MobileStickyBar),
      'home-hero-image': () => h(HeroPromoCard)
    })
  },
  enhanceApp({ app }) {
    app.component('QuickAnswer', QuickAnswer)
    app.component('TopicBridge', TopicBridge)
    app.component('BrandCard', BrandCard)
    app.component('ComparisonTable', ComparisonTable)
    app.component('FaqAccordion', FaqAccordion)
    app.component('SpeedTestTable', SpeedTestTable)
    app.component('TroubleshootingBox', TroubleshootingBox)
    app.component('MobileStickyBar', MobileStickyBar)
    app.component('HeroPromoCard', HeroPromoCard)
    app.component('TrafficCalculator', TrafficCalculator)
  }
} satisfies Theme
