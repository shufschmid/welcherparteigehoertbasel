<template>
  <div id="map-wrap" style="height: 100vh">
    <div
      class="wgb__zoom flex flex-wrapper"
      style="
        z-index: 999999;
        position: absolute;
        width: auto;
        right: 100px;
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
      <l-map ref="map" :zoom="14" :center="[47.5586, 7.60097]">
        <l-tile-layer
          :options="{
            maxZoom: 18,
            minZoom: 3.5,
          }"
          :url="'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png'"
        />
        <Vue2LeafletHeatmap
          :key="latlongarray.length"
          :lat-lng="latlongarray"
          :radius="100 - currentZoom * 5"
          :min-opacity="0.45"
          :max-zoom="12"
          :blur="50"
        ></Vue2LeafletHeatmap>
      </l-map>
    </client-only>
  </div>
</template>
<script>
import 'leaflet/dist/leaflet.css'
import Vue2LeafletHeatmap from '@/components/Vue2LeafletHeatmap'
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
            [47.56134861836904, 7.57324910984529],
            [47.54732406076121, 7.61166623914006],
            [47.56820800248657, 7.61518691025734],
            [47.56898526814444, 7.61674201268284],
            [47.56189950149731, 7.56543578725172],
            [47.56654367550468, 7.5951187506312],
            [47.55992578586436, 7.58490715990171],
            [47.55761144682271, 7.58356057969644],
            [47.55997760562681, 7.58428466933349],
            [47.54655813195603, 7.61227904899095],
            [47.54794883544285, 7.61169138719127],
            [47.56642706534779, 7.57038302505172],
            [47.54784304863587, 7.612818579208],
          ],
        },
        {
          party: 'FDP',
          visible: true,
          locations: [
            [47.56097833982443, 7.60818775705008],
            [47.53694371723403, 7.59003759879295],
            [47.56288213467282, 7.60421813818223],
            [47.56891391929697, 7.58340854313064],
            [47.57111662877017, 7.58225673230589],
            [47.54974907196365, 7.56250120006654],
          ],
        },
        {
          party: 'SP',
          visible: true,
          locations: [
            [47.56734578322278, 7.623254234972681],
            [47.56107684613438, 7.570517488549738],
            [47.55062818298317, 7.565800719452167],
            [47.55112223936917, 7.566302479808455],
            [47.54769276669086, 7.563115050022156],
          ],
        },
        {
          party: 'GAB',
          visible: true,
          locations: [
            [47.5517970047337, 7.607347851021916],
            [47.5503983992273, 7.608783532167177],
            [47.5417464339048, 7.603448642928584],
            [47.5653685668286, 7.617696170536426],
          ],
        },

        {
          party: 'GLP',
          visible: true,
          locations: [
            [47.5488351919705, 7.609191070175533],
            [47.5507821053151, 7.578997803269654],
            [47.5607011962836, 7.569570517339129],
          ],
        },

        {
          party: 'MITTE/EVP',
          visible: true,
          locations: [
            [47.54438585305316, 7.594225683445384],
            [47.53046506832847, 7.587275592692748],
            [47.55059724987647, 7.562678826532341],
            [47.54752106512914, 7.567645282873579],
            [47.56205527081427, 7.595272839893353],
          ],
        },

        {
          party: 'SVP',
          visible: true,
          locations: [
            [47.5602451082468, 7.599283046880076],
            [47.5684263271482, 7.569584460773292],
            [47.5719450141842, 7.601365193497154],
          ],
        },
      ],
      latlongarray: [],
      latLongHilfsArray: [],
      heatmapQueryNames: ['LDP', 'FDP', 'SP', 'MITTE/EVP', 'GLP', 'GAB', 'SVP'],
      baseMap: null,
      currentZoom: 12,
    }
  },
  async fetch() {
    // await this.$store.dispatch('fetchMap', {
    //   id: this.$route.query.id || null,
    // })
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
  right: 100px;
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
