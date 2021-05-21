// plugins/leaflet.client.ts
import Vue from 'vue'
import { LMap, LTileLayer, LGeoJson } from 'vue2-leaflet'
import LHeatmap from '@/components/LHeatmap.vue'

Vue.component('LMap', LMap)
Vue.component('LTileLayer', LTileLayer)
Vue.component('LGeoJson', LGeoJson)
Vue.component('LHeatmap', LHeatmap)
