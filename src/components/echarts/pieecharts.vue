<template>
  <div>
    <div
      ref="main"
      :style="{ width: parentToChild.width, height: parentToChild.height }"
    ></div>
  </div>
</template>
<script>
//import echarts from 'echarts'
// 引入基本模板
let echarts = require("echarts/lib/echarts");
// 引入柱状图组件
require("echarts/lib/chart/pie");
// 引入提示框和title组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
export default {
  name: "Piecharts",
  // props: ["parentToChild","pielegenddata","piechartData"],
  data() {
    return {
      //echarts实例
      chart: ""
    };
  },
  props: {
    parentToChild: {
      type: Object
    },
    pielegenddata: {
      type: Array
    },
    piechartData: {
      type: Array
    },
    option: {
      type: Object,
      default() {
        let xaxisdatanew = this.piechartData;
        for (let key in xaxisdatanew) {
          if (xaxisdatanew[key].name == "延迟") {
            xaxisdatanew[key].name = "已延迟";
          } else if (xaxisdatanew[key].name == "今天") {
            xaxisdatanew[key].name = "今天";
          } else if (xaxisdatanew[key].name == "开始") {
            xaxisdatanew[key].name = "已开始";
          } else if (xaxisdatanew[key].name == "未知") {
            xaxisdatanew[key].name = "未开始";
          } else if (xaxisdatanew[key].name == "完成") {
            xaxisdatanew[key].name = "已完成";
          }
          //console.log(xaxisdata[key].name);
          // legenddata.push(xaxisdata[key].name);
        }
        let xaxisdata = xaxisdatanew;
        let legenddata = [];
        for (let key in xaxisdata) {
          if (xaxisdata[key].name == "已延迟") {
            legenddata.push("已延迟");
          } else if (xaxisdata[key].name == "今天") {
            legenddata.push("今天");
          } else if (xaxisdata[key].name == "已开始") {
            legenddata.push("已开始");
          } else if (xaxisdata[key].name == "未开始") {
            legenddata.push("未开始");
          } else if (xaxisdata[key].name == "已完成") {
            legenddata.push("已完成");
          }
          //console.log(xaxisdata[key].name);
          // legenddata.push(xaxisdata[key].name);
        }
        // console.log(legenddata);
        // let data = this.piechartData;
        return {
          tooltip: {
            trigger: "item",
            confine: true,
            formatter: "{b} : {d}% <br/> {c}"
          },
          color: [
            "#FB5F5A",
            "#FFAE38",
            "#7B7DE5",
            "#64DBB7",
            "#58A1FF",
            "#1475e0",
            "#ff325c"
          ],
          legend: {
            //   orient: "vertical",
            //icon: "roundRect",
            //   top: "middle",
            type: "scroll",
            orient: "vertical",
            //orient: "horizontal",
            //icon: "roundRect",
            // icon: "circle",
            icon: "rect",
            top: "middle",
            //top:"0",
            left: "40",
            bottom: "-20",
            itemWidth: 10,
            itemHeight: 10,
            itemGap: 15,
            //   left:"50%",
            //   right: "5%",
            textStyle: {
              fontSize: 12,
              fontFamily: "SimHei",
              color: "#3B404F"
            },
            //data: []
            //data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"]
            data: legenddata
          },
          series: [
            {
              name: "访问来源",
              type: "pie",
              minAngle: 3, //最小的扇区角度（0 ~ 360），用于防止某个值过小导致扇区太小影响交互
              avoidLabelOverlap: true,
              //radius: "70%",
              radius: ["40%", "60%"],
              center: ["65%", "50%"],
              // label: {
              //   align: "left",
              //   formatter: "{b} : {d}%"
              // },
              // radius: ["50%", "60%"],
              // center: ["50%", "42%"],
              label: {
                normal: {
                  show: false,
                  position: "center"
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: "14",
                    fontWeight: "bold"
                  }
                }
              },
              data: xaxisdata
              // data: [
              //   { value: 335, name: "直接访问" },
              //   { value: 310, name: "邮件营销" },
              //   { value: 234, name: "联盟广告" },
              //   { value: 135, name: "视频广告" },
              //   { value: 1548, name: "搜索引擎" }
              // ]
              // itemStyle: {
              //   emphasis: {
              //     shadowBlur: 10,
              //     shadowOffsetX: 0,
              //     shadowColor: "rgba(0, 0, 0, 0.5)"
              //   }
              // }
            }
          ]
        };
      }
    }
  },
  mounted() {
    this.init(); //让echarts窗口自适应
  },
  methods: {
    init() {
      //let data = this.piechartData;
      let xaxisdatanew = this.piechartData;
      for (let key in xaxisdatanew) {
        if (xaxisdatanew[key].name == "延迟") {
          xaxisdatanew[key].name = "已延迟";
        } else if (xaxisdatanew[key].name == "今天") {
          xaxisdatanew[key].name = "今天";
        } else if (xaxisdatanew[key].name == "开始") {
          xaxisdatanew[key].name = "已开始";
        } else if (xaxisdatanew[key].name == "未知") {
          xaxisdatanew[key].name = "未开始";
        } else if (xaxisdatanew[key].name == "完成") {
          xaxisdatanew[key].name = "已完成";
        }
        //console.log(xaxisdata[key].name);
        // legenddata.push(xaxisdata[key].name);
      }
      let xaxisdata = xaxisdatanew;
      // 基于准备好的dom，初始化echarts实例
      this.option.series[0].data = xaxisdata;
      let myChart = this.$echarts.init(this.$refs.main);
      myChart.setOption(this.option, true);
    }
  },
  watch: {
    //观察option的变化
    piechartData(val) {
      this.init();
    }
  }
};
</script>
<style></style>
