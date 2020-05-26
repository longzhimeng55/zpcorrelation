<template>
  <div class="cartDetail" v-loading="loading">
    <div class="title-list">
      <span
        :class="{'active-bottom':item.active}"
        v-for="item in titleList"
        :key="item.name"
        @click="taskchange(item.name)"
      >
        <router-link :to="{name:item.path}">{{item.name}}</router-link>
      </span>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: true,
      titleList: [
        { name: "概览", active: false, path: "overview" },
        { name: "任务", active: true, path: "task" },
        { name: "里程碑", active: false, path: "milepost" },
        { name: "文件", active: false, path: "file" },
        { name: "项目成员", active: false, path: "projectMembers" },
        { name: "操作日志", active: false, path: "actionLog" }
      ],
      customColor: "#7B7DE5",
      typesMsg: [
        { name: "Late", nums: 5, spans: 4 },
        { name: "Today", nums: 3, spans: 5 },
        { name: "Today", nums: 4, spans: 5 },
        { name: "Upcoming", nums: 8, spans: 6 }
      ]
    };
  },
  created() {
    setTimeout(() => {
      this.loading = false;
    }, 2000);
    this.taskchange(this.$route.meta.title);
  },
  methods: {
    taskchange(name) {
      this.titleList.map(item => {
        if (item.name == name) item.active = true;
        else item.active = false;
      });
    }
  }
};
</script>
<style scoped>
.cartDetail{
  height: 100%;
  width: 100%;
  /* width: fit-content; */
  /* width: auto; */
}
.cartDetail .title-list {
  display: flex;
  width: 100%;
  /* width: auto;
  min-width: 100%; */
  margin-right: 25px;
  height: 40px;
  line-height: 40px;
  background-color: #ffffff;
  margin-top: 15px;
  padding-left: 20px;
}
.cartDetail .title-list span {
  padding: 0 6px;
  margin: 0 10px;
  cursor: pointer;
}
.cartDetail .title-list span a {
  color: #3b404f;
}
.cartDetail .title-list .active-bottom {
  border-bottom: 2px solid #7b7de5;
}
</style>
