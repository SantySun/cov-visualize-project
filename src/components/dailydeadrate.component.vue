<template>
  <div class="container shadow mt-5 p-3">
    <div class="hello" ref="chartdiv"></div>
    <div class="hint">提示：在图表中选中区域可放大图表</div>
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
  name: "dailydeadrate",
  //to do:
  //change to a line chart
  async mounted() {
    let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart);
    chart.paddingRight = 20;

    const result = await axios
      .create({
        baseURL: url + "dailydeadrate",
        timeout: 5000,
        headers: {
          "content-type": "application/json",
          Accept: "*/*"
        }
      })
      .get("");
    let stringResult = result.data;
    for (let entry of stringResult) {
      entry.hubeiRate = parseFloat(entry.hubeiRate);
      entry.notHubeiRate = parseFloat(entry.notHubeiRate);
      entry.countryRate = parseFloat(entry.countryRate);
    }
    chart.data = stringResult;

    chart.colors.list = [
      am4core.color("#FF0000").brighten(-0.5),
      am4core.color("#FF9A00"),
      am4core.color("#22DDA2")
    ];

    chart.dateFormatter.inputDateFormat = "MM.dd";
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
    dateAxis.start = 0;
    dateAxis.keepSelection = true;
    // let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    // categoryAxis.dataFields.category = "date";
    dateAxis.title.text = "日期";
    // dateAxis.renderer.grid.template.location = 0;
    // dateAxis.renderer.minGridDistance = 20;
    dateAxis.renderer.cellStartLocation = 0.1;
    dateAxis.renderer.cellEndLocation = 0.9;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min = 0;
    valueAxis.title.text = "死亡率 单位：%";
    valueAxis.adapter.add("getTooltipText", () => {
      return "";
    });

    // Create series
    function createSeries(field, name, stacked) {
      let series = chart.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = field;
      series.dataFields.dateX = "date";
      series.name = name;
      series.tooltipText = "{name}: [bold]{valueY}[/]%";
      series.tooltip.pointerOrientation = "horizontal";
      series.stacked = stacked;
      series.columns.template.width = am4core.percent(95);
    }

    createSeries("hubeiRate", "湖北省", false);
    createSeries("countryRate", "全国", false);
    createSeries("notHubeiRate", "湖北省外", false);

    let title = chart.titles.create();
    title.text = "湖北省内外每日死亡率对比";
    title.fontSize = 25;
    title.marginBottom = 30;

    // Add legend
    chart.legend = new am4charts.Legend();
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.lineY.disabled = true;
    // chart.cursor.lineX.disabled = true;
    chart.cursor.fullWidthLineX = true;
    chart.cursor.xAxis = dateAxis;
    chart.cursor.lineX.strokeOpacity = 0;
    chart.cursor.lineX.fill = am4core.color("#000");
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