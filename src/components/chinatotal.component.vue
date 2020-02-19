<template>
  <div class="hello" ref="chartdiv"></div>
</template>

<script>
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import axios from "axios";
import url from "./apiurl";
am4core.useTheme(am4themes_animated);

export default {
  name: "chinaTotal",

  async mounted() {
    let chart = am4core.create(this.$refs.chartdiv, am4charts.PieChart);
    chart.paddingRight = 20;

    const result = await axios

      .create({
        baseURL: url + "chinatotal",
        timeout: 5000,
        headers: {
          "content-type": "application/json",
          Accept: "*/*"
        }
      })
      .get("");

    const entry = result.data[0].chinaTotal;
    const time = result.data[0].lastUpdateTime;
    chart.data = [
      {
        name: "现有确诊（非危重）",
        number: entry.nowConfirm - entry.nowSevere,
        color: "#FFD952"
      },
      {
        name: "已治愈",
        number: entry.heal,
        color: "#228C22"
      },
      {
        name: "已死亡",
        number: entry.dead,
        color: "#000000"
      },
      {
        name: "确诊危重",
        number: entry.nowSevere,
        color: "#FF9671"
      }
    ];

    //   chart.data = new_pie_entry;

    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "number";
    pieSeries.dataFields.category = "name";
    pieSeries.slices.template.propertyFields.fill = "color";
    pieSeries.slices.template.stroke = am4core.color("#fff");
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;

    // This creates initial animation
    pieSeries.hiddenState.properties.opacity = 1;
    pieSeries.hiddenState.properties.endAngle = -90;
    pieSeries.hiddenState.properties.startAngle = -90;

    let title = chart.titles.create();
    title.text = "截至" + time + "全国累计数据";
    title.fontSize = 25;
    title.marginBottom = 30;

    chart.legend = new am4charts.Legend();

    this.chart = chart;
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  }
};
</script>

<style scoped>
.hello {
  width: 95%;
  height: 500px;
}
</style>