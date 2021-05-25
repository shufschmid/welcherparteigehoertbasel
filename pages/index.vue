<template>
  <div>
    <HeatMapWithCheckboxes v-bind:locationsOfParties="locationsOfParties" />
    <h1>Bar-Chart</h1>
    <BarChart />
  </div>
</template>
<script>
import BarChart from '@/components/BarChart.vue'
import HeatMapWithCheckboxes from '@/components/HeatMapWithCheckboxes'
import locationsOfPartiesData from '@/data/locationsOfParties.json'
export default {
  components: {
    HeatMapWithCheckboxes,
    BarChart,
  },
  data() {
    return {
      locationsOfParties: locationsOfPartiesData,
    }
  },
}
</script>
