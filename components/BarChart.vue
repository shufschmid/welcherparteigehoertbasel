<template>
  <div>
    <zingchart :data="ChartData"></zingchart>

    Dann sagte ein LDP-Politiker: Das hat ja nur mit dem höheren
    Durschnittsalter in unserer Fraktion zu tun. Wollen wir das überprüfen?
    <TestButton @click.native="values.push(66)">Hier klicken.</TestButton>
    {{ ChartData.series[0].values }}
  </div>
</template>

<script>
// import the es6 version
import 'zingchart/es6'
import zingchartVue from 'zingchart-vue'
import TestButton from '@/components/TestButton.vue'
export default {
  components: {
    zingchart: zingchartVue,
    TestButton,
  },
  data() {
    return {
      values: [57.5, 49.7, 52.4, 43.4, 48.3, 52.4, 48.25],
    }
  },
  computed: {
    ChartData() {
      return {
        type: 'line',
        series: [
          {
            type: 'line',
            text: 'Durchschnittsalter pro Fraktion',
            values: this.values,
            backgroundColor: 'rgb(230, 0, 60)',
          },
        ],
        text: 'Durchschnittsalter pro Fraktion',
        backgroundColor: 'rgb(230, 0, 60)',
        title: {
          text: 'Wohnungen pro Fraktionsmitglied',
        },
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
