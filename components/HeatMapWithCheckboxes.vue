<template>
  <v-row>
    <v-col cols="12">
      <div id="map-wrap" style="height: 100vh">
        <div class="querySelector">
          <v-icon
            large
            color="black"
            :disabled="currentZoom <= minZoom"
            @click="setZoom('+')"
          >
            mdi-magnify-minus-outline
          </v-icon>
          <v-icon
            large
            color="black"
            :disabled="currentZoom >= maxZoom"
            @click="setZoom('-')"
          >
            mdi-magnify-plus-outline
          </v-icon>
          <v-checkbox
            v-for="(element, index) in locationsOfParties"
            :id="element.party"
            :key="index"
            v-model="element.visible"
            :label="element.party"
            light
            dense
            style="margin: 0px; padding: 0px"
            @change="setHeatmap(element.party)"
          />
        </div>
        <client-only>
          <l-map
            ref="map"
            :zoom="currentZoom"
            :center="center"
            @change="currentZoom = this.$refs.map.mapObject.getZoom()"
          >
            <l-tile-layer
              :options="{
                maxZoom: maxZoom,
                minZoom: minZoom,
              }"
              :url="baseMap"
            />
            <Vue2LeafletHeatmap
              :key="latlongarray.length"
              :lat-lng="latlongarray"
              :radius="60"
              :min-opacity="0.45"
              :max-zoom="maxZoom"
              :min-zoom="minZoom"
              :blur="50"
            ></Vue2LeafletHeatmap>
          </l-map>
        </client-only>
      </div>
    </v-col>
  </v-row>
</template>
<script>
import 'leaflet/dist/leaflet.css'

import Vue2LeafletHeatmap from '@/components/Vue2LeafletHeatmap'
export default {
  components: {
    Vue2LeafletHeatmap,
  },
  props: {
    locationsOfParties: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      latlongarray: [],
      latLongHilfsArray: [],
      center: [47.5586, 7.60097],
      currentZoom: 12,
      minZoom: 3.5,
      maxZoom: 16,
      baseMap:
        'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
    }
  },
  mounted() {
    this.setHeatmap()
  },
  methods: {
    setHeatmap() {
      this.locationsOfParties.forEach((element) => {
        if (element.visible === true) {
          element.locations.forEach((e) => {
            this.latLongHilfsArray.push(e)
          })
        }
      })
      this.latlongarray = this.latLongHilfsArray
      this.latLongHilfsArray = []
    },
    setZoom(v) {
      if (!this.$refs.map) return // wieso das?
      if (v === '-') {
        this.$refs.map.mapObject.zoomIn()
      } else if (v === '+') {
        this.$refs.map.mapObject.zoomOut()
      }
      this.currentZoom = this.$refs.map.mapObject.getZoom()
    },
  },
}
</script>
<style lang="scss">
.querySelector {
  position: fixed;
  right: 100px;
  top: 80px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  z-index: 1000;
  font-size: 20px;
}
.leaflet-control-attribution.leaflet-control {
  display: none;
}
.leaflet-control-container {
  display: none;
}
</style>
