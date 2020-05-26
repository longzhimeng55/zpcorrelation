<template>
  <div>
    <div ref="main" :style="{width:parentToChild.width,height: parentToChild.height}"></div>
  </div>
</template>
<script>
//import echarts from 'echarts'
// 引入基本模板
let echarts = require("echarts/lib/echarts");
// 引入柱状图组件
require("echarts/lib/chart/bar");
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
      //Object类型的prop值一定要用函数return出来，不然会报错。原理和data是一样的，
      //使用闭包保证一个vue实例拥有自己的一份props
      default() {
        // let xaxisdata = this.pielegenddata;
        console.log(this.piechartData);
        let data = this.piechartData;
        let legenddata = [],
          timedata = [],
          seriesdata = [];
        let tempobj = {
          // emphasis: {
          //   barBorderRadius: 7
          // },
          normal: {
            // color: new echarts.graphic.LinearGradient(
            //   0,
            //   0,
            //   0,
            //   1,
            //   [
            //     {
            //       offset: 0,
            //       //color:'rgba(109,112,226,0)'
            //       color: "#6D70E2" // 0% 处的颜色
            //     },
            //     {
            //       offset: 1,
            //       color: "#9899E3"
            //       //color: 'rgba(152,153,227,0) ' // 100% 处的颜色
            //     }
            //   ],
            //   false
            // ),
            barBorderRadius: [13, 13, 0, 0],
            shadowColor: "rgba(0,255,225,1)"
          }
        };
        for (let i = 0; i < data.length; i++) {
          timedata = data[i].date;
          for(let key in data[i]){
          if (key=="finish") {
            legenddata.push("完成");
            let temp = {};
            temp.name = "完成";
            temp.type = "bar";
            temp.barWidth=20;// 柱图宽度
            temp.barMaxWidth=20, // 最大宽度
            temp.itemStyle = tempobj;
            temp.data = data[i].finish;
            seriesdata.push(temp);
            // seriesdata.
          } 
          // else if (key=="later") {
          //   legenddata.push("延迟");
          //   let temp = {};
          //   temp.name = "延迟";
          //   temp.type = "bar";
          //   temp.itemStyle = tempobj;
          //   temp.data = data[i].later;
          //   seriesdata.push(temp);
          // } 
          // else if (key=="today") {
          //   legenddata.push("今天");
          //   let temp = {};
          //   temp.name = "今天";
          //   temp.type = "bar";
          //   temp.itemStyle = tempobj;
          //   temp.data = data[i].today;
          //   seriesdata.push(temp);
          // } 
          else if (key=="remain") {
            legenddata.push("未完成");
            let temp = {};
            temp.name = "未完成";
            temp.type = "bar";
            temp.barWidth=20;// 柱图宽度
            temp.barMaxWidth=20, // 最大宽度
            temp.itemStyle = tempobj;
            temp.data = data[i].remain;
            seriesdata.push(temp);
          } 
          // else if (key=="total") {
          //   legenddata.push("总计");
          //   let temp = {};
          //   temp.name = "总计";
          //   temp.type = "bar";
          //   temp.itemStyle = tempobj;
          //   temp.data = data[i].total;
          //   seriesdata.push(temp);
          // }
          console.log(seriesdata);
          }
          // series.pdata[i].plan);
        }
        return {
          tooltip: {
            trigger: "item",
            confine: true,
            trigger: "axis",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
            }
            // formatter: "{b} : {d}% <br/> {c}"
          },
          color: ["#BABBFB", "#7B7DE5"],
          legend: {
            //   orient: "vertical",
            //   icon: "roundRect",
            //   top: "middle",
            //type: "scroll",
            //orient: "vertical",
            orient: "horizontal",
            icon: "roundRect",
            // top: "middle",
            // top:"0",
            top:"0",
            right:"80",
            //bottom: "0",
            itemWidth: 10,
            itemHeight: 10,
            itemGap: 10,
            //   left:"50%",
            //   right: "5%",
            textStyle: {
              fontSize: 12,
              fontFamily: "SimHei"
              //color: "#4c6ab8"
            },
            data: legenddata
            // data: ["直接访问", "邮件营销", "联盟广告", "视频广告"]
            //data: legenddata
          },
          xAxis: [
            {
              type: "category",
              axisLine: {
                //坐标轴轴线相关设置。数学上的x轴
                show: true,
                lineStyle: {
                  //color: "rgba(0,196,255,0.24)"
                }
              },
              axisLabel: {
                //坐标轴刻度标签的相关设置
                textStyle: {
                  //color: "#6a9cd5",
                  margin: 15
                }
              },
              axisTick: { show: false },
              data: timedata
              // data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
            }
          ],
          grid: {
            left: "5%",
            right: "10%",
            bottom: "10%",
            containLabel: true
          },
          yAxis: [
            {
              type: "value",
              splitNumber: 7,
              splitLine: {
                lineStyle: {
                  // 使用深浅的间隔色
                  color: "#F1F1F6"
                  //color: "rgba(0,196,255,0.24)"
                }
              },
              axisLine: {
                lineStyle: {
                  //color: "rgba(0,196,255,0.24)",
                  width: 0 //这里是为了突出显示加上的
                }
              },
              axisLabel: {
                textStyle: {
                  //color: "#056cda", //坐标值得具体的颜色
                  width: 1 //这里是为了突出显示加上的
                }
              },
              axisTick: { show: false }
            }
          ],
          series:seriesdata
          // series: [
          //   {
          //     name: "直接访问",
          //     type: "bar",
          //     itemStyle: {
          //       // emphasis: {
          //       //   barBorderRadius: 7
          //       // },
          //       normal: {
          //         color: new echarts.graphic.LinearGradient(
          //           0,
          //           0,
          //           0,
          //           1,
          //           [
          //             {
          //               offset: 0,
          //               //color:'rgba(109,112,226,0)'
          //               color: "#6D70E2" // 0% 处的颜色
          //             },
          //             {
          //               offset: 1,
          //               color: "#9899E3"
          //               //color: 'rgba(152,153,227,0) ' // 100% 处的颜色
          //             }
          //           ],
          //           false
          //         ),
          //         barBorderRadius: [13, 13, 0, 0],
          //         shadowColor: "rgba(0,255,225,1)"
          //         // shadowBlur: 4,
          //         // barBorderRadius: 7,
          //         // color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          //         //   { offset: 0, color: "#3977E6" },
          //         //   { offset: 1, color: "#37BBF8" }
          //         // ])
          //       }
          //     },
          //     data: [320, 332, 301, 334, 390, 330, 320]
          //   },
          //   {
          //     name: "邮件营销",
          //     type: "bar",
          //     itemStyle: {
          //       // emphasis: {
          //       //   barBorderRadius: 7
          //       // },
          //       normal: {
          //         color: new echarts.graphic.LinearGradient(
          //           0,
          //           0,
          //           0,
          //           1,
          //           [
          //             {
          //               offset: 0,
          //               //color:'rgba(109,112,226,0)'
          //               color: "#6D70E2" // 0% 处的颜色
          //             },
          //             {
          //               offset: 1,
          //               color: "#9899E3"
          //               //color: 'rgba(152,153,227,0) ' // 100% 处的颜色
          //             }
          //           ],
          //           false
          //         ),
          //         barBorderRadius: [13, 13, 0, 0],
          //         shadowColor: "rgba(0,255,225,1)"
          //         // shadowBlur: 4,
          //         // barBorderRadius: 7,
          //         // color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          //         //   { offset: 0, color: "#3977E6" },
          //         //   { offset: 1, color: "#37BBF8" }
          //         // ])
          //       }
          //     },
          //     data: [120, 132, 101, 134, 90, 230, 210]
          //   },
          //   {
          //     name: "联盟广告",
          //     type: "bar",
          //     itemStyle: {
          //       // emphasis: {
          //       //   barBorderRadius: 7
          //       // },
          //       normal: {
          //         color: new echarts.graphic.LinearGradient(
          //           0,
          //           0,
          //           0,
          //           1,
          //           [
          //             {
          //               offset: 0,
          //               //color:'rgba(109,112,226,0)'
          //               color: "#6D70E2" // 0% 处的颜色
          //             },
          //             {
          //               offset: 1,
          //               color: "#9899E3"
          //               //color: 'rgba(152,153,227,0) ' // 100% 处的颜色
          //             }
          //           ],
          //           false
          //         ),
          //         barBorderRadius: [13, 13, 0, 0],
          //         shadowColor: "rgba(0,255,225,1)"
          //         // shadowBlur: 4,
          //         // barBorderRadius: 7,
          //         // color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          //         //   { offset: 0, color: "#3977E6" },
          //         //   { offset: 1, color: "#37BBF8" }
          //         // ])
          //       }
          //     },
          //     data: [220, 182, 191, 234, 290, 330, 310]
          //   },
          //   {
          //     name: "视频广告",
          //     type: "bar",
          //     itemStyle: {
          //       // emphasis: {
          //       //   barBorderRadius: 7
          //       // },
          //       normal: {
          //         color: new echarts.graphic.LinearGradient(
          //           0,
          //           0,
          //           0,
          //           1,
          //           [
          //             {
          //               offset: 0,
          //               //color:'rgba(109,112,226,0)'
          //               color: "#6D70E2" // 0% 处的颜色
          //             },
          //             {
          //               offset: 1,
          //               color: "#9899E3"
          //               //color: 'rgba(152,153,227,0) ' // 100% 处的颜色
          //             }
          //           ],
          //           false
          //         ),
          //         barBorderRadius: [13, 13, 0, 0],
          //         shadowColor: "rgba(0,255,225,1)"
          //         // shadowBlur: 4,
          //         // barBorderRadius: 7,
          //         // color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          //         //   { offset: 0, color: "#3977E6" },
          //         //   { offset: 1, color: "#37BBF8" }
          //         // ])
          //       }
          //     },
          //     data: [150, 232, 201, 154, 190, 330, 410]
          //   }
          // ]
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
      //let legenddata = this.pielegenddata;
      // 基于准备好的dom，初始化echarts实例
      //this.option.series[0].data = data;
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
<style>
</style>