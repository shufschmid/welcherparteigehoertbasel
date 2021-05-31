<template>
  <div>
    <h1>Heat-Map</h1>
    <HeatMapWithCheckboxes v-bind:locationsOfParties="locationsOfParties" />
    <h1>Map with Categories</h1>
    <CategoriesMap />
    <v-divider></v-divider>
    <v-divider></v-divider>
    <h1>Bar-Chart</h1>
    <ApexBarChart />
  </div>
</template>
<script>
import ApexBarChart from '@/components/ApexBarChart.vue'
import HeatMapWithCheckboxes from '@/components/HeatMapWithCheckboxes'
import CategoriesMap from '@/components/CategoriesMap.vue'
import locationsOfPartiesData from '@/data/locationsOfParties.json'
export default {
  components: {
    HeatMapWithCheckboxes,
    ApexBarChart,
    CategoriesMap,
  },
  data() {
    return {
      locationsOfParties: locationsOfPartiesData,
    }
  },
}
</script>
