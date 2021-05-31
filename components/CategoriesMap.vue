<template>
  <div id="map-wrap" style="height: 80vh">
    Da ist ja gar kein Haus markiert. Hier nicht,
    <a @click="changeLocation"> aber hier</a>
    <!--    <pre-->
    <!--      style="-->
    <!--        z-index: 9999999;-->
    <!--        position: absolute;-->
    <!--        left: 0;-->
    <!--        top: 0;-->
    <!--        width: 320px;-->
    <!--        height: 100vh;-->
    <!--      "-->
    <!--    >-->
    <!--       {{ heatMapData }}-->
    <!--    </pre>-->
    <Nav style="position: absolute; z-index: 9999"></Nav>
    <div
      class="wgb__zoom flex flex-wrapper"
      style="
        z-index: 999999;
        position: absolute;
        width: auto;
        right: 105px;
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
    <div
      class="wgb__sidebar"
      :class="{ open: showFilter }"
      style="
        position: absolute;
        z-index: 999;
        height: auto;
        top: 70px;
        right: 10px;
        overflow-y: auto;
        overflow-x: hidden;
        max-height: 100vh;
      "
    >
      <p v-if="mapSection[0]" class="p-1 pl-0">
        <b>{{ mapSection[0][0] }}</b>
      </p>
      <ul
        v-if="mapLegend"
        :class="{ closing: closing, opening: showFilter }"
        class="mx-0 wgb__nav-list"
      >
        <li
          v-for="(leg, ix) in mapLegend"
          :key="ix"
          class="
            my-1
            transition-all
            duration-150
            shadow-md
            duration-150
            relative
            hover:bg-gray-100
            hover:shadow-lg
            hover:bg-opacity-50
            py-1
            hover:text-gray-900
            text-black-700
            block
            rounded-lg
          "
          :class="{
            'bg-white bg-opacity-50': filterOptions.includes(leg),
          }"
          @click="filterClick(leg, $route.query.id)"
        >
          <span style="padding-right: 50px">{{ leg }}</span>
          <span
            v-show="filterOptions.includes(leg)"
            style="
              position: absolute;
              right: 0;
              height: 100%;
              top: 0;
              overflow-y: hidden;
              z-index: -1;
              opacity: 0.4;
            "
            :style="{
              width: `${
                (mapData[0].features.filter(
                  (e) => e.properties[mapSection[0][0]] === leg
                ).length /
                  total) *
                100
              }%`,
              backgroundColor: `${
                mapColors[leg] ? mapColors[leg].color : 'black'
              }`,
              paddingRight: '5px',
            }"
          ></span>
          <span
            v-show="mapData[0] && filterOptions.includes(leg)"
            class="text-xs transition duration-150 absolute right-0 pr-1 pt-1"
            :style="{
              maxWidth: filterOptions.includes(leg) ? '120px' : 0,
            }"
          >
            {{
              (
                (mapData[0].features.filter(
                  (e) => e.properties[mapSection[0][0]] === leg
                ).length /
                  total) *
                100
              ).toFixed(2)
            }}%
          </span>
        </li>
      </ul>
      <p
        v-if="mapData[0] && mapData[0].features && mapData[0].features.length"
        class="mt-3 mb-0"
      >
        <b>Grundstücke</b>: {{ mapData[0].features.length }}
      </p>
      <p v-if="total" class="mt-0 mb-0"><b>Total</b>: {{ total }}</p>
      <button
        v-if="mapData[0] && mapData[0].features"
        :disabled="filterOptions.length === 0"
        :class="{
          'text-black-700 hover:text-black hover:shadow-lg hover:bg-gray-100 hover:bg-opacity-50 rounded-lg':
            filterOptions.length !== 0,
          'text-gray-500': filterOptions.length === 0,
        }"
        class="
          mt-3
          flex
          w-full
          my-1
          shadow-md
          duration-150
          relative
          transition-borders
          py-1
          block
        "
        @click="revertMap()"
      >
        <span>
          <svg
            class="mt-1 ml-1 mr-1"
            width="18"
            height="18"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </span>
        Filter zurücksetzen
      </button>
      <button
        v-if="mapData[0] && mapData[0].features"
        class="
          mt-3
          flex
          w-full
          my-1
          shadow-md
          duration-150
          relative
          transition-borders
          py-1
          block
          rounded-lg
          text-black-700
          hover:text-black
          hover:shadow-lg
          hover:bg-gray-100 hover:bg-opacity-50
        "
        @click="toggleNavbar"
      >
        <span>
          <svg
            class="mt-1 ml-1 mr-1"
            width="18"
            height="18"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </span>
        Filter ausblenden
      </button>
    </div>
    <client-only>
      <l-map ref="map" :zoom="16" :center="centerNew">
        <l-tile-layer
          :options="{
            maxZoom: $route.query.heatmap ? 15 : 18,
            minZoom: 3.5,
          }"
          :url="
            $route.query.tile ||
            'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png'
          "
        />
        <template v-if="mapData">
          <template v-for="(k, ix) in mapData">
            <l-geo-json
              v-if="mapData[ix]"
              :key="ix"
              :geojson="k"
              :options="options"
            />
          </template>
        </template>
        <l-geo-json v-if="baseMap" :geojson="baseMap" :options="options" />
      </l-map>
    </client-only>
  </div>
</template>
<script>
import 'leaflet/dist/leaflet.css'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      centerNew: [47.567531, 7.576841],
      baseMap: null,
      filterOptions: [],
      heatMapData: null,
      heatMap: [],
      closing: false,
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
    await this.$store.dispatch('fetchMap', {
      id: this.$route.query.id || null,
    })
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
  created() {
    sessionStorage.clear()
  },
  updated() {
    if (!this.$fetchState.pending || !this.$route.query.id) {
      this.$store.commit('setFetched', true)
    }
  },
  async mounted() {
    // clear filters
    this.filterOptions = []
    // handle base map
    if (this.$route.query && this.$route.query.basemap) {
      this.baseMap = await this.$axios.$get(
        window.location.protocol + '//' + window.location.host + '/basemap.json'
      )
    }
    // handle heat map
    if (this.$route.query && this.$route.query.heatmap) {
      if (
        !this.$route.query.heatmap.startsWith('http') &&
        !this.$route.query.heatmap.startsWith('http').endsWith('.json')
      )
        return
      this.heatMapData = await this.$axios
        .$get(this.$route.query.heatmap)
        .then((res) => {
          const r = res.features.map((e) => [
            e.geometry.coordinates[1],
            e.geometry.coordinates[0],
            1,
          ])
          this.heatMap.push(r)
          return r
        })
    }
    // handle legends
    if (this.mapLegend.length > 0) {
      this.filterOptions.push(this.mapLegend)
    }
  },
  methods: {
    async toggleNavbar() {
      this.closing = true
      await this.$store.commit('toggleLegend')
      // this.showMenu = !this.showMenu
      setTimeout(() => {
        this.closing = false
      }, 500)
    },
    changeLocation() {
      this.$refs.map.mapObject.flyTo([47.553205, 7.58854])
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
    filterClick(val, q) {
      if (this.mapData) {
        if (this.filterOptions.includes(val)) {
          this.filterOptions = this.filterOptions.filter((e) => e !== val)
        } else {
          this.filterOptions.push(val)
        }
        this.$store.commit('filterMap', {
          key: this.mapSection[0],
          val: this.filterOptions,
          id: q,
        })
      }
    },
  },
  fetchOnServer: false,
}
</script>
<style lang="scss">
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
.wgb__sidebar {
  opacity: 0;
  transform: translateX(120%);
  transition: opacity 0.15s ease-in-out, transform 0.3s ease-in-out;
  max-width: calc(100% - 40px);
  &.open {
    opacity: 1;
    transform: translateX(0);
    overflow-x: hidden;
  }
}
.wgb__nav-list {
  li {
    max-width: 100%;
    span:first-of-type {
      display: inline-block;
      text-overflow: ellipsis;
    }
  }
  &.opening {
    @for $i from 1 through 500 {
      li:nth-child(#{$i}n) {
        transition: opacity 0.2s ease-in-out, transform 0.25s ease-in-out,
          border 0.15s ease-in-out, color 0.2s ease-in-out,
          background-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
        opacity: 1;
        animation-fill-mode: both;
        animation-delay: #{$i * 0.05}s;
        animation-duration: 0.5s;
        animation-name: menuItemAppear;
      }
    }
  }
  &.closing {
    @for $i from 1 through 500 {
      li:nth-child(#{$i}n) {
        transition: opacity 0.2s ease-in-out, transform 0.25s ease-in-out,
          border 0.15s ease-in-out, color 0.2s ease-in-out;
        opacity: 0;
        animation-fill-mode: revert;
        animation-delay: #{$i * 0.025}s;
        animation-duration: 0.3s;
        animation-name: menuItemAppear;
      }
    }
  }
}
@keyframes menuItemAppear {
  0% {
    opacity: 0;
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
@keyframes itemAppear {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes menuItemDisappear {
  0% {
    opacity: 1;
    transform: translateX(0);
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}
</style>
