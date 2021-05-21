<template>
  <div id="map-wrap" style="height: 100vh">
    <div
      class="wgb__zoom flex flex-wrapper"
      style="
        z-index: 999999;
        position: absolute;
        width: auto;
        right: 20px;
        height: 20px;
      "
    >
      <button
        class="
          px-2
          lg:mt-3
          mt-2
          shadow-md
          duration-150
          relative
          transition-borders
          hover:bg-gray-100
          hover:shadow-lg
          hover:bg-opacity-50
          hover:text-gray-900
          text-black-700
          block
          rounded-lg
          ml-auto
          flex
          block
          content-center
          outline-none
          focus:outline-none
          opacity-1
        "
        :class="{ 'text-gray-500 hover:text-gray-500': currentZoom === 'min' }"
        style="width: 36px; height: 38px"
        @click="setZoom('+')"
      >
        <svg
          width="24"
          height="24"
          class="mt-3"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"
          />
        </svg>
      </button>
      <button
        class="
          px-2
          lg:mt-3
          mt-2
          shadow-md
          duration-150
          flex
          content-center
          relative
          transition-borders
          hover:bg-gray-100
          hover:shadow-lg
          hover:bg-opacity-50
          hover:text-gray-900
          text-black-700
          block
          rounded-lg
          ml-auto
          flex
          block
          content-center
          outline-none
          focus:outline-none
          opacity-1
        "
        :class="{ 'text-gray-500 hover:text-gray-500': currentZoom === 'max' }"
        style="width: 36px; height: 38px"
        @click="setZoom('-')"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          width="24"
          height="24"
          class="mt-3"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
          />
        </svg>
      </button>
    </div>
    <div class="querySelector">
      <div v-for="(element, index) in locationsOfParties" :key="index">
        <v-checkbox
          :id="element.party"
          v-model="element.visible"
          :label="element.party"
          light
          @change="setHeatmap(element.party)"
        />
      </div>
      <br />
    </div>
    <client-only>
      <l-map ref="map" :zoom="14" :center="[47.5586, 7.60097]">
        <l-tile-layer
          :options="{
            maxZoom: 18,
            minZoom: 3.5,
          }"
          :url="'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png'"
        />
        <Vue2LeafletHeatmap
          :key="forceRerender"
          :lat-lng="latlongarray"
          :radius="50"
          :min-opacity="0.35"
          :max-zoom="12"
          :blur="60"
        ></Vue2LeafletHeatmap>
        <!-- <template v-if="mapData">
          <template v-for="(k, ix) in mapData">
            <l-geo-json
              v-if="mapData[ix]"
              :key="ix"
              :geojson="k"
              :options="options"
            />
          </template>
        </template> -->
        <!-- <l-geo-json v-if="baseMap" :geojson="baseMap" :options="options" /> -->
      </l-map>
    </client-only>
    <v-btn @click="latlongarray.pop()">{minus}</v-btn>
    {{ locationsOfParties.FDP }}
  </div>
</template>
<script>
import 'leaflet/dist/leaflet.css'
import Vue2LeafletHeatmap from '@/components/Vue2LeafletHeatmap'
import { mapState } from 'vuex'
export default {
  components: {
    Vue2LeafletHeatmap,
  },
  data() {
    return {
      locationsOfParties: [
        {
          party: 'LDP',
          visible: true,
          locations: [
            [47.56134861836904, 7.573249109845295],
            [47.5473240607612, 7.611666239140061],
          ],
        },
        {
          party: 'FDP',
          visible: true,
          locations: [
            [47.56820800248657, 7.615186910257345],
            [47.56898526814444, 7.616742012682842],
          ],
        },
      ],

      latlongarray: [],
      latLongHilfsArray: [],
      forceRerender: 0,
      activeHeatmaps: [],
      heatmapQueryNames: ['LDP', 'SVP'],
      baseMap: null,
      filterOptions: [],
      heatMapData: [[7.573249109845295, 47.56134861836904]],
      currentZoom: null,
      options: {
        style(feature) {
          if (!feature && !feature.properties) return
          return {
            weight: 0.3,
            color: 'black',
            fillOpacity: 0.5,
            fillColor: feature.properties.styles
              ? feature.properties.styles.color
              : 'transparent',
          }
        },
        onEachFeature(feature, layer) {
          if (feature.properties.OBJID) return
          layer.bindPopup(
            `${Object.keys(feature.properties)
              .filter((x) => !x.includes('json') && !x.includes('styles'))
              .map((e) => {
                return `<span><strong>${e}</strong>: ${feature.properties[e]}</span><br />`
              })
              .join('')}
                    `
          )
          layer.on('mouseover', function () {
            layer.setStyle({
              fillColor: 'transparent',
              fillOpacity: 0.2,
              weight: 0.8,
              color: feature.properties.styles
                ? feature.properties.styles.color
                : 'black',
            })
          })
          layer.on('mouseout', function (e) {
            layer.setStyle({
              weight: 0.3,
              fillColor: feature.properties.styles
                ? feature.properties.styles.color
                : 'gray',
              fillOpacity: 0.5,
              color: 'black',
            })
          })
        },
      },
    }
  },
  async fetch() {
    // await this.$store.dispatch('fetchMap', {
    //   id: this.$route.query.id || null,
    // })
  },
  computed: {
    ...mapState({
      total: (state) => state.total || null,
      mapData: (state) => state.mapData || [],
      showFilter: (state) => state.showLegend || false,
      mapFilters: (state) => state.mapFilters || [],
      mapLegend: (state) => state.mapLegend || [],
      mapSection: (state) => state.mapSection || [],
      mapColors: (state) => state.mapColors || [],
    }),
  },
  watch: {
    activeHeatmaps() {
      this.setHeatmap()
    },
  },
  created() {
    sessionStorage.clear()
  },
  updated() {
    if (!this.$fetchState.pending || !this.$route.query.id) {
      this.$store.commit('setFetched', true)
    }
  },
  async mounted() {
    this.setHeatmap()
    // clear filters
    this.filterOptions = []
    // handle base map
    if (this.$route.query && this.$route.query.basemap) {
      this.baseMap = await this.$axios.$get(
        window.location.protocol + '//' + window.location.host + '/basemap.json'
      )
    }
    // handle heat map
    this.initHeatmap()
    // handle legends
    if (this.mapLegend.length > 0) {
      this.filterOptions.push(this.mapLegend)
    }
  },
  methods: {
    async initHeatmap() {
      if (!this.$route.query) {
        this.heatMapData = []
        const tempActiveHeatmaps = []
        let index = 0
        const fetchUrl = `${
          process.env.NODE_ENV === 'production' ? '' : process.env.BASE_URL
        }.netlify/functions/`
        for (const queryName in this.$route.query) {
          const queryUrl = this.$route.query[queryName]
          if (queryUrl.startsWith('http') && queryUrl.endsWith('.json')) {
            await this.$axios
              .$post(fetchUrl + 'heatmaps', { url: queryUrl })
              .then((res) => {
                this.heatmapQueryNames.push(res.data.name)
                const r = res.data.features.forEach((e) =>
                  this.heatMapData.pop()
                )
                tempActiveHeatmaps.push(index)
                index++
                return r
              })
          }
        }
        this.activeHeatmaps = tempActiveHeatmaps
      }
    },
    setHeatmap() {
      this.locationsOfParties.forEach((element) => {
        if (element.visible === true) {
          element.locations.forEach((e) => {
            this.latLongHilfsArray.push(e)
          })
        }
      })

      this.latlongarray = this.latLongHilfsArray
      console.log(this.latlongarray)
      this.forceRerender++
      this.latLongHilfsArray = []
    },
    setZoom(v) {
      if (!this.$refs.map) return
      if (v === '-') {
        this.$refs.map.mapObject.zoomIn()
      } else if (v === '+') {
        this.$refs.map.mapObject.zoomOut()
      }
      if (
        this.$refs.map.mapObject._zoom ===
        this.$refs.map.mapObject._layersMinZoom
      ) {
        this.currentZoom = 'min'
      } else if (
        this.$refs.map.mapObject._layersMaxZoom ===
        this.$refs.map.mapObject._zoom
      ) {
        this.currentZoom = 'max'
      } else {
        this.currentZoom = null
      }
    },
    async revertMap() {
      this.filterOptions = []
      await this.$store.commit('filterMap', {
        key: this.mapSection[0],
        val: [],
        id: this.$route.query.id || null,
      })
    },
  },
  fetchOnServer: false,
}
</script>
<style lang="scss">
.querySelector {
  position: fixed;
  right: 20px;
  top: 80px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  z-index: 1000;
  font-size: 20px;
}
#map-wrap {
  color: black;
  max-width: 100%;
  display: block;
  overflow-x: hidden !important;
}
img {
  animation: ease-in-out;
  animation-fill-mode: both;
  animation-duration: 1.2s;
  animation-name: itemAppear;
}
.leaflet-container path,
#bajour-svg-icon path {
  transition: fill 0.4s ease-in-out, opacity 0.2s ease-in-out;
}
.leaflet-control-attribution.leaflet-control {
  display: none;
}
.leaflet-control-container {
  bottom: 0;
  left: 0;
  z-index: 999;
  width: 40px;
  height: 100px;
  position: absolute;
  display: none;
}
.leaflet-container {
  transition: all 0.2s ease-in-out;
  background: transparent;
}
</style>
