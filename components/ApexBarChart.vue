<template>
  <div>
    <div id="chart">
      <VueApexCharts
        type="line"
        height="350"
        :options="chartOptions"
        :series="series"
      ></VueApexCharts>
      Dann sagte ein LDP-Politiker: Das hat ja nur mit dem höheren
      Durschnittsalter in unserer Fraktion zu tun.
      <a @click="updateChart">Wollen wir das überprüfen?</a>
    </div>
  </div>
</template>
<script>
// import VueApexCharts from 'vue-apexcharts'
export default {
  components: {
    VueApexCharts: () => import('vue-apexcharts'),
  },
  data() {
    return {
      series: [
        {
          name: 'Wohnungen / Fraktionsmitglied',
          type: 'column',
          data: [3.53, 1.64, 1.43, 0.9, 0.72, 0.7, 0.375],
        },
        {
          name: '',
          type: '',
          data: [],
        },
      ],
      chartOptions: {
        chart: {
          height: 350,
          type: 'line',
        },
        stroke: {
          width: [0, 4],
        },
        title: {
          text: 'Wohnungen pro Fraktionsmitglied',
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [1],
        },
        labels: ['LDP', 'SVP', 'FDP', 'SP', 'GAB', 'Mitte-EVP', 'GLP'],
        xaxis: {
          type: 'string',
        },
        yaxis: [
          {
            title: {
              text: 'Wohnungen pro Fraktionsmitglied',
            },
          },
          {
            opposite: true,
            title: {
              text: 'Durchschnittsalter Fraktionsmitglieder',
            },
          },
        ],
      },
    }
  },
  methods: {
    updateChart() {
      this.series = [
        {
          name: 'Wohnungen / Fraktionsmitglied',
          type: 'column',
          data: [3.53, 1.64, 1.43, 0.9, 0.72, 0.7, 0.375],
        },
        {
          name: 'Durchschnittsalter',
          type: 'line',
          data: [57.5, 49.7, 52.4, 43.4, 48.3, 52.4, 48.25],
        },
      ]
    },
  },
}
</script>

<style scoped></style>
