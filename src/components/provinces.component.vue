<template>
  <div class="container shadow mt-5 p-3">
    <div class="hello" ref="chartdiv"></div>
  </div>
</template>

<script>
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import axios from "axios";
am4core.useTheme(am4themes_animated);

export default {
  name: "byProvince",
  //to do:
  //change to a line chart
  async mounted() {
    let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart);
    chart.paddingRight = 20;

    const result = await axios
      .create({
        baseURL: url + "allprovince",
        timeout: 5000,
        headers: {
          "content-type": "application/json",
          Accept: "*/*"
        }
      })
      .get("");
    chart.data = [];
    for (let entry of result.data) {
      let new_entry = {
        province_name: entry.name,
        todayConfirm: entry.today.confirm,
        todayUpdated: entry.today.isUpdated,
        totalConfirm: entry.total.confirm,
        totalDead: entry.total.dead,
        totalHeal: entry.total.heal
      };
      chart.data.push(new_entry);
    }

    chart.colors.list = [
      am4core.color("#FFD952"),
      am4core.color("#000000"),
      am4core.color("#228C22"),
      am4core.color("#FF9671"),
      am4core.color("#FF5B57")
    ];

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "province_name";
    categoryAxis.title.text = "各省市当前数据";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 20;
    categoryAxis.renderer.cellStartLocation = 0.1;
    categoryAxis.renderer.cellEndLocation = 0.9;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.title.text = "病例数量 （单位：例）";

    // Create series
    function createSeries(field, name, stacked) {
      var series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = field;
      series.dataFields.categoryX = "province_name";
      series.name = name;
      series.columns.template.tooltipText = "{name}: [bold]{valueY}[/]";
      series.stacked = stacked;
      series.columns.template.width = am4core.percent(95);
    }
    createSeries("todayConfirm", "本日新增", false);
    createSeries("totalDead", "死亡病例", true);
    createSeries("totalHeal", "已治愈", true);
    createSeries("totalConfirm", "累计确诊", true);

    chart.scrollbarY = new am4core.Scrollbar();
    chart.scrollbarY.parent = chart.leftAxesContainer;
    chart.scrollbarY.toBack();

    // Create a horizontal scrollbar with previe and place it underneath the date axis
    chart.scrollbarX = new am4charts.XYChartScrollbar();

    chart.scrollbarX.parent = chart.bottomAxesContainer;

    let title = chart.titles.create();
    title.text = "每日新增";
    title.fontSize = 25;
    title.marginBottom = 30;

    chart.cursor = new am4charts.XYCursor();

    this.chart = chart;
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  width: 100%;
  height: 500px;
}
.container {
  width: 100%;
  margin: auto;
}
</style>