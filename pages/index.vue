<template>
  <div>
    <!-- <HeatMapWithCheckboxes v-bind:locationsOfParties="locationsOfParties" /> -->
    <h1>Bar-Chart</h1>
    <ApexBarChart />
  </div>
</template>
<script>
import ApexBarChart from '@/components/ApexBarChart.vue'
// import HeatMapWithCheckboxes from '@/components/HeatMapWithCheckboxes'
import locationsOfPartiesData from '@/data/locationsOfParties.json'
export default {
  components: {
    // HeatMapWithCheckboxes,
    ApexBarChart,
  },
  data() {
    return {
      locationsOfParties: locationsOfPartiesData,
    }
  },
}
</script>
