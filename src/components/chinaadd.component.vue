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
  name: "chinaDayAddList",
  //to do:
  //change to a line chart
  async mounted() {
    let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart);
    chart.paddingRight = 20;

    const result = await axios
      .create({
        baseURL: url + "chinadayaddlist",
        timeout: 5000,
        headers: {
          "content-type": "application/json",
          Accept: "*/*"
        }
      })
      .get("");
    chart.data = result.data.chinaDayAddList;

    chart.dateFormatter.inputDateFormat = "MM.dd";

    chart.colors.list = [
      am4core.color("#FFD952"),
      am4core.color("#000000"),
      am4core.color("#228C22"),
      am4core.color("#FF9671"),
      am4core.color("#FF5B57")
    ];

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    // chart.scrollbarY = new am4core.Scrollbar();
    // chart.scrollbarY.parent = chart.leftAxesContainer;
    // chart.scrollbarY.toBack();

    // Create a horizontal scrollbar with previe and place it underneath the date axis
    // chart.scrollbarX = new am4charts.XYChartScrollbar();

    // chart.scrollbarX.parent = chart.bottomAxesContainer;

    dateAxis.start = 0;
    dateAxis.keepSelection = true;

    function createAxisAndSeries(field, name, opposite) {
      // if (chart.yAxes.indexOf(valueAxis) != 0) {
      //   valueAxis.syncWithAxis = chart.yAxes.getIndex(0);
      // }

      let series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = field;
      series.dataFields.dateX = "date";
      series.strokeWidth = 2;
      series.yAxis = valueAxis;
      series.name = name;
      series.tooltipText = "{name}: [bold]{valueY}[/]";
      series.tensionX = 0.8;
      series.showOnInit = true;

      let interfaceColors = new am4core.InterfaceColorSet();

      let bullet = series.bullets.push(new am4charts.Bullet());
      bullet.width = 12;
      bullet.height = 12;
      bullet.horizontalCenter = "middle";
      bullet.verticalCenter = "middle";

      let triangle = bullet.createChild(am4core.Rectangle);
      triangle.stroke = interfaceColors.getFor("background");
      triangle.strokeWidth = 2;
      triangle.direction = "top";
      triangle.width = 12;
      triangle.height = 12;

      valueAxis.renderer.line.strokeOpacity = 1;
      valueAxis.renderer.line.strokeWidth = 2;
      // valueAxis.renderer.line.stroke = series.stroke;
      // valueAxis.renderer.labels.template.fill = series.stroke;
      valueAxis.renderer.opposite = opposite;
      //   chart.scrollbarX.series.push(series);
    }
    createAxisAndSeries("suspect", "疑似", true);

    createAxisAndSeries("dead", "死亡", true);
    createAxisAndSeries("heal", "治愈", false);
    createAxisAndSeries("confirm", "确诊", false);

    chart.colors.step = 2;

    chart.legend = new am4charts.Legend();
    chart.legend.useDefaultMarker = true;
    let marker = chart.legend.markers.template.children.getIndex(0);
    marker.cornerRadius(12, 12, 12, 12);
    marker.strokeWidth = 2;
    marker.strokeOpacity = 1;
    marker.stroke = am4core.color("#ccc");

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
  width: 95%;
  height: 600px;
}
</style>