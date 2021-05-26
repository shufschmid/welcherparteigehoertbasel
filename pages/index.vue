<template>
  <div>
    <h1>Heat-Map</h1>
    <HeatMapWithCheckboxes v-bind:locationsOfParties="locationsOfParties" />
    <v-divider></v-divider>
    <h1>Bar-Chart</h1>
    <ApexBarChart />
  </div>
</template>
<script>
import ApexBarChart from '@/components/ApexBarChart.vue'
import HeatMapWithCheckboxes from '@/components/HeatMapWithCheckboxes'
import locationsOfPartiesData from '@/data/locationsOfParties.json'
export default {
  components: {
    HeatMapWithCheckboxes,
    ApexBarChart,
  },
  data() {
    return {
      locationsOfParties: locationsOfPartiesData,
    }
  },
}
</script>
