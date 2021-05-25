<template>
  <div>
    <zingchart :data="myData" :series="mySeries"></zingchart>

    Dann sagte ein LDP-Politiker: Das hat ja nur mit dem höheren
    Durschnittsalter in unserer Fraktion zu tun. Wollen wir das überprüfen?
    <a @click="mySeries[1].values = []"> Hier klicken.</a>
    {{ mySeries[1].values }}
  </div>
</template>

<script>
// import the es6 version
import 'zingchart/es6'
import zingchartVue from 'zingchart-vue'
export default {
  components: {
    zingchart: zingchartVue,
  },
  data() {
    return {
      myData: {
        type: 'mixed',
        title: {
          text: 'Wohnungen pro Fraktionsmitglied',
        },
        scaleX: {
          values: ['LDP', 'SVP', 'FDP', 'SP', 'GAB', 'Mitte-EVP', 'GLP'],
          flat: false,
          guide: {
            visible: false,
          },

          item: {
            tooltip: {
              text: '%months',
            },
            fontColor: '#c0c0c0',
            fontFamily: 'Arial',
            fontSize: '10px',
          },
          label: {
            fontColor: '#ffffff',
            fontFamily: 'Arial',
            fontSize: '11px',
            fontWeight: 'normal',
          },
          lineColor: '#55717c',
          offsetY: '4px',
          tick: {
            visible: false,
          },
        },
        scaleY: {
          values: '0:5:1',
          guide: {
            alpha: 1,
            lineColor: '#5e606c',
            lineStyle: 'solid',
          },
          item: {
            fontColor: '#c0c0c0',
            fontFamily: 'Arial',
            fontSize: '10px',
          },
          label: {
            text: 'Net Profit',
            fontColor: '#ffffff',
            fontFamily: 'Arial',
            fontSize: '11px',
            fontWeight: 'normal',
          },
          lineColor: 'none',
          multiplier: true,
          tick: {
            visible: false,
          },
        },
        scaleY2: {
          values: '0:60:10',
          guide: {
            visible: false,
          },
          item: {
            fontColor: '#c0c0c0',
            fontFamily: 'Arial',
            fontSize: '10px',
          },
          label: {
            text: 'Units Sold',
            fontColor: '#ffffff',
            fontFamily: 'Arial',
            fontSize: '11px',
            fontWeight: 'normal',
            offsetX: '5px',
          },
          lineColor: 'none',
          multiplier: true,
          tick: {
            visible: false,
          },
        },
      },
      mySeries: [
        {
          type: 'bar',
          text: '2017 Sales',
          values: [3.53, 1.64, 1.43, 0.9, 0.72, 0.7, 0.375],
          backgroundColor: 'rgb(230, 0, 60)',
        },
        {
          type: 'line',
          text: 'Durchschnittsalter pro Fraktion',
          values: [57.5, 49.7, 52.4, 43.4, 48.3, 52.4, 48.25],
          backgroundColor: 'rgb(230, 0, 60)',
          scales: 'scale-x,scale-y-2',
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped></style>
