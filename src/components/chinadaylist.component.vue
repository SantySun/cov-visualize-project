<template>
  <div class="container shadow mt-5 p-3">
    <div class="hello" ref="chartdiv"></div>
    <div class="hint">提示：点击图例可隐藏数据曲线，在图表中选中区域可放大图表</div>
  </div>
</template>

<script>
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import axios from "axios";
import url from "./apiurl";
am4core.useTheme(am4themes_animated);
export default {
  name: "chinaDayList",
  //to do:
  //change to a line chart

  async mounted() {
    let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart);
    chart.paddingRight = 20;

    const result = await axios
      .create({
        baseURL: url + "chinadaylist",
        timeout: 5000,
        headers: {
          "content-type": "application/json",
          Accept: "*/*"
        }
      })
      .get("");
    chart.data = result.data.chinaDayList;
    const lastUpdateTime = result.data.lastUpdateTime.split(" ")[0];

    chart.dateFormatter.inputDateFormat = "MM.dd";

    chart.colors.list = [
      am4core.color("#22DDA2"),
      am4core.color("#000000"),
      am4core.color("#228C22"),
      am4core.color("#FF9671"),
      am4core.color("#FF5B57"),
      am4core.color("#FFDB87")
    ];

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.adapter.add("getTooltipText", text => {
      let month = text.split(" ")[0];
      let date = text.split(" ")[1];
      // if (month.match("0.")) month = month[1];
      const months = {
        Jan: 1,
        Feb: 2,
        Mar: 3,
        Apr: 4,
        May: 5,
        Jun: 6,
        Jul: 7,
        Aug: 8,
        Sep: 9,
        Oct: 10,
        Nov: 11,
        Dec: 12
      };
      month = months[month];
      if (date.match("0.")) date = date[1];
      return month + "月" + date + "日";
    });

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.adapter.add("getTooltipText", () => {
      return "";
    });
    //create a vertical scrollbar
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

      let triangle = bullet.createChild(am4core.Triangle);
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
      // chart.scrollbarX.series.push(series);
    }

    createAxisAndSeries("confirm", "累计确诊", true);
    createAxisAndSeries("dead", "死亡", true);
    createAxisAndSeries("heal", "治愈", false);
    createAxisAndSeries("nowConfirm", "现有确诊", false);
    createAxisAndSeries("nowSevere", "危重", false);
    createAxisAndSeries("suspect", "疑似", false);

    chart.colors.step = 2;

    chart.legend = new am4charts.Legend();
    chart.legend.useDefaultMarker = true;
    let marker = chart.legend.markers.template.children.getIndex(0);
    marker.cornerRadius(12, 12, 12, 12);
    marker.strokeWidth = 2;
    marker.strokeOpacity = 1;
    marker.stroke = am4core.color("#ccc");

    let title = chart.titles.create();
    title.text = "截至" + lastUpdateTime + "疫情扩散趋势";
    title.fontSize = 25;
    title.marginBottom = 30;

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;
    chart.cursor.lineY.disabled = true;
    chart.cursor.fullWidthLineX = true;
    chart.cursor.lineX.strokeWidth = 0;
    chart.cursor.lineX.fill = am4core.color("#666666");
    chart.cursor.lineX.fillOpacity = 0.1;
    chart.scrollbarX = new am4core.Scrollbar();
    chart.scrollbarX.parent = chart.bottomAxesContainer;
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
.container {
  width: 100%;
  margin: auto;
}
</style>