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
require("echarts/lib/chart/line");
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
        let data = this.piechartData;
        let timedata=[],realdata=[],plandata=[];
        for(let i=0;i<data.length;i++){
            timedata=data[i].date;
            realdata=data[i].real;
            plandata=data[i].plan;
        }
        return {
          tooltip: {
            trigger: "item",
            confine: true,
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            //formatter: '{a} <br/>{b} : {c}'
          },
          color: ["#64DBB7", "#7B7DE5"],
          legend: {
            //   orient: "vertical",
            //   icon: "roundRect",
            //top: "middle",
            // type: "scroll",
            //orient: "vertical",
            orient: "horizontal",
            icon: "roundRect",
            // top: "middle",
            top:"0",
            right:"80",
            bottom: "0",
            itemWidth: 10,
            itemHeight: 10,
            itemGap: 10,
            //   left:"50%",
            //   right: "5%",
            textStyle: {
              fontSize: 12,
              fontFamily: "SimHei",
              //color: "#4c6ab8"
            },
            //data: []
            data: ["实际中的进度","理想中的进度"]
            //data: legenddata
          },
          xAxis: {
            type: "category",
            name: "时间",
            axisLine: {
              //坐标轴轴线相关设置。数学上的x轴
              show: true,
              lineStyle: {
                // width: 2,
                // color: "#64DBB7"
                // color: "rgba(0,196,255,0.24)"
              }
            },
            axisLabel: {
              //坐标轴刻度标签的相关设置
              textStyle: {
                // color: "#6a9cd5",
                margin: 15
              }
            },
            axisTick: { show: false },
            splitLine: { show: false },
            // data:["10-22", "10-23", "10-24", "10-25", "10-26", "10-27", "10-28"]
            data:timedata,
            // data: ["一", "二", "三", "四", "五", "六", "七", "八", "九"]
          },
          grid: {
            left: "5%",
            right: "10%",
            bottom: "10%",
            containLabel: true
          },
          yAxis: {
            type: "value",
            name: "进度",
            splitNumber: 7,
            splitLine: {
              lineStyle: {
                // 使用深浅的间隔色
                color:"#F1F1F6"
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
          },
          series: [
            {
              name: "理想中的进度",
              type: "line",
              showSymbol: true,
              symbol: "emptyCircle", //设定为实心点
              symbolSize: 12, //设定实心点的大小
              animation: false,
              itemStyle: {
                //圆圈样式
                borderWidth: 2.4,
                color: "#7B7DE5"
              },
              lineStyle: {
                //线条样式
                width: 2,
                color: "#7B7DE5"
              },
              data:plandata,
              // data: [9, 8, 7, 6, 5, 4, 3, 2, 1]
            },
            {
              name: "实际中的进度",
              type: "line",
              showSymbol: true,
              symbol: "emptyCircle", //设定为实心点
              symbolSize: 12, //设定实心点的大小
              animation: false,
              itemStyle: {
                //圆圈样式
                borderWidth: 2.4,
                color: "#64DBB7"
              },
              lineStyle: {
                //线条样式
                width: 2,
                color: "#64DBB7"
              },
              data:realdata,
              // data: [9, 9, 9, 9, 9, 9, 9, 9, 9]
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
        let data = this.piechartData;
        let timedata=[],realdata=[],plandata=[];
        for(let i=0;i<data.length;i++){
            timedata=data[i].date;
            realdata=data[i].real;
            plandata=data[i].plan;
        }
      //let legenddata = this.pielegenddata;
      // 基于准备好的dom，初始化echarts实例
      this.option.xAxis.data = timedata;
      this.option.series[0].data = plandata;
      this.option.series[1].data = realdata;
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