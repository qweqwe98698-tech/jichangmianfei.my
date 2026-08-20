import DefaultTheme from 'vitepress/theme'
import './custom.css'
import type { Theme } from 'vitepress'

import QuickAnswer from './components/QuickAnswer.vue'
import TopicBridge from './components/TopicBridge.vue'
import BrandCard from './components/BrandCard.vue'
import ComparisonTable from './components/ComparisonTable.vue'
import FaqAccordion from './components/FaqAccordion.vue'
import SpeedTestTable from './components/SpeedTestTable.vue'
import TroubleshootingBox from './components/TroubleshootingBox.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('QuickAnswer', QuickAnswer)
    app.component('TopicBridge', TopicBridge)
    app.component('BrandCard', BrandCard)
    app.component('ComparisonTable', ComparisonTable)
    app.component('FaqAccordion', FaqAccordion)
    app.component('SpeedTestTable', SpeedTestTable)
    app.component('TroubleshootingBox', TroubleshootingBox)
  }
} satisfies Theme
