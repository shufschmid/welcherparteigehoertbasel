<template>
  <client-only>
    <LMap
      style="height: 100%; overflow: auto"
      :zoom="10"
      :center="[47.334852, -1.509485]"
    >
      <LTileLayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></LTileLayer>
      <LHeatmap
        :lat-lng="latlngs"
        :radius="60"
        :min-opacity="0.75"
        :max-zoom="10"
        :blur="60"
      />
    </LMap>
  </client-only>
</template>

<script>
import LHeatmap from '@/components/LHeatmap.vue'
import { LMap, LTileLayer } from 'vue2-leaflet'

export default {
  components: {
    LMap,
    LTileLayer,
    LHeatmap,
  },
  data() {
    return {
      latlngs: [
        [47.334852, -1.509485, 1],
        [47.342596, -1.328731, 0.75],
        [47.342596, -1.329731, 1],
        [47.342596, -1.329731, 1],
        [47.342596, -1.329731, 1],
        [47.241487, -1.190568, 0.5],
        [47.234787, -1.358337, 1],
      ],
    }
  },
}
</script>

<style>
.basic-example {
  width: 100%;
  height: 500px;
}
</style>
