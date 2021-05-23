<template>
  <div>
    <HeatMapWithCheckboxes v-bind:locationsOfParties="locationsOfParties" />
  </div>
</template>
<script>
import HeatMapWithCheckboxes from '@/components/HeatMapWithCheckboxes'
import locationsOfPartiesData from '@/data/locationsOfParties.json'
export default {
  components: {
    HeatMapWithCheckboxes,
  },
  data() {
    return {
      locationsOfParties: locationsOfPartiesData,
    }
  },
}
</script>
