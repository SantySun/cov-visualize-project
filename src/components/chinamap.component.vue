<template>
  <div class="navbar justify-content-center w3-container w3-card w3-white w3-margin-bottom">
    <div class="hello" ref="chartdiv"></div>
  </div>
</template>

<script>
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
// import jQuery from "jquery";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import axios from "axios";
import url from "./apiurl";
am4core.useTheme(am4themes_animated);

export default {
  name: "provinceMap",
  async mounted() {
    const province_name = {
      "CN-AH": "安徽",
      "CN-BJ": "北京",
      "CN-CQ": "重庆",
      "CN-FJ": "福建",
      "CN-GD": "广东",
      "CN-36": "江西",
      "CN-GX": "广西",
      "CN-ZJ": "浙江",
      "CN-HA": "河南",
      "CN-HB": "湖北",
      "CN-HE": "河北",
      "CN-HI": "海南",
      "CN-HK": "香港",
      "CN-HL": "黑龙江",
      "CN-JL": "吉林",
      "CN-JX": "江苏",
      "CN-TW": "台湾",
      "CN-GS": "甘肃",
      "CN-TJ": "天津",
      "CN-XZ": "西藏",
      "CN-YN": "云南",
      "CN-XJ": "新疆",
      "CN-QH": "青海",
      "CN-SD": "山东",
      "CN-SX": "山西",
      "CN-SC": "四川",
      "CN-SH": "上海",
      "CN-LN": "辽宁",
      "CN-NM": "内蒙古",
      "CN-MO": "澳门",
      "CN-SN": "陕西",
      "CN-HN": "湖南",
      "CN-NX": "宁夏",
      "CN-GZ": "贵州"
    };
    let currentMap = "chinaHigh";

    // Create map instance
    let chart = am4core.create(this.$refs.chartdiv, am4maps.MapChart);

    let title = chart.titles.create();
    title.text = "各省（直辖市、自治区、特别行政区）数据";
    title.fontSize = 15;
    title.marginBottom = 50;

    // Set map definition
    chart.geodataSource.url =
      "https://www.amcharts.com/lib/4/geodata/json/" + currentMap + ".json";
    chart.geodataSource.events.on("parseended", async function(ev) {
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
      const covData = [];
      for (let entry of result.data) {
        let new_entry = {
          province_name: entry.name,
          todayConfirm: entry.today.confirm,
          todayUpdated: entry.today.isUpdated,
          totalConfirm: entry.total.confirm,
          totalDead: entry.total.dead,
          totalHeal: entry.total.heal
        };
        covData.push(new_entry);
      }
      let data = [];
      for (var i = 0; i < ev.target.data.features.length; i++) {
        const pname = province_name[ev.target.data.features[i].id];
        // console.log(ev.target.data.features[i].id, pname);
        for (let entry of covData) {
          if (entry.province_name === pname) {
            data.push({
              id: ev.target.data.features[i].id,
              pname: pname,
              value: entry.totalConfirm,
              heal: entry.totalHeal,
              dead: entry.totalDead
            });
          }
        }
      }
      polygonSeries.data = data;
    });

    // Set projection
    chart.projection = new am4maps.projections.Mercator();
    // Create map polygon series
    let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());

    //Set min/max fill color for each area
    polygonSeries.heatRules.push({
      property: "fill",
      target: polygonSeries.mapPolygons.template,
      min: am4core.color("#FFFF00"),
      max: am4core.color("#FF0000").lighten(-0.5)
    });

    // Make map load polygon data (state shapes and names) from GeoJSON
    polygonSeries.useGeodata = true;

    // Set up heat legend
    let heatLegend = chart.createChild(am4maps.HeatLegend);
    heatLegend.series = polygonSeries;
    heatLegend.align = "right";
    heatLegend.width = am4core.percent(25);
    heatLegend.marginRight = am4core.percent(4);
    heatLegend.minValue = 0;
    heatLegend.maxValue = 80000;
    heatLegend.valign = "bottom";

    // Set up custom heat map legend labels using axis ranges
    let minRange = heatLegend.valueAxis.axisRanges.create();
    minRange.value = heatLegend.minValue;
    let maxRange = heatLegend.valueAxis.axisRanges.create();
    maxRange.value = heatLegend.maxValue;

    // Blank out internal heat legend value axis labels
    // heatLegend.valueAxis.renderer.labels.template.adapter.add("text", function(
    // //   labelText
    // ) {
    //   return "";
    // });

    // Configure series tooltip
    let polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = `[bold]{pname}:[/]
                                    总确诊: {value}
                                    已治愈: {heal}
                                    已死亡: {dead}`;
    polygonTemplate.nonScalingStroke = true;
    polygonTemplate.strokeWidth = 0.5;
    polygonTemplate.fill = am4core.color("#FFFF00");

    // Create hover state and set alternative fill color
    // let hs = polygonTemplate.states.create("hover");
    // hs.properties.fill = chart.colors.getIndex(1).brighten(-0.5);

    //new stuff
    let hs = polygonTemplate.states.create("hover");
    hs.properties.fill = am4core.color("#FFC100");

    polygonTemplate.adapter.add("fill", function(fill, target) {
      if (target.dataItem.value > 50000) {
        let pattern = new am4core.LinePattern();
        pattern.width = 1;
        pattern.height = 1;
        pattern.stroke = am4core.color("#FF0000").brighten(-0.5);
        pattern.strokeWidth = 2;
        pattern.rotation = 45;
        return pattern;
      } else if (target.dataItem.value > 10000) {
        let pattern = new am4core.LinePattern();
        pattern.width = 1;
        pattern.height = 1;
        pattern.stroke = am4core.color("#FF0000");
        pattern.strokeWidth = 2;
        pattern.rotation = 45;
        return pattern;
      } else if (target.dataItem.value > 1000) {
        let pattern = new am4core.LinePattern();
        pattern.width = 1;
        pattern.height = 1;
        pattern.stroke = am4core.color("#FF4D00");
        pattern.strokeWidth = 2;
        pattern.rotation = 45;
        return pattern;
      } else if (target.dataItem.value > 100) {
        let pattern = new am4core.LinePattern();
        pattern.width = 1;
        pattern.height = 1;
        pattern.stroke = am4core.color("#FF9A00");
        pattern.strokeWidth = 2;
        pattern.rotation = 45;
        return pattern;
      } else if (target.dataItem.value > 10) {
        let pattern = new am4core.LinePattern();
        pattern.width = 1;
        pattern.height = 1;
        pattern.stroke = am4core.color("#FFC100");
        pattern.strokeWidth = 2;
        pattern.rotation = 45;
        return pattern;
      }
      return fill;
    });

    polygonTemplate.adapter.add("stroke", function(fill, target) {
      if (target.dataItem.value > 10000) {
        return am4core.color("#FF0000");
      }
      return fill;
    });

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
  height: 500px;
}
.w3-container {
  width: 80%;
  margin: auto;
}
</style>