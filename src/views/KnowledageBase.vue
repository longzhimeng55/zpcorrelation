<template>
  <div class="knowledagebase">
    <el-container>
      <el-header>
        <heads></heads>
      </el-header>
      <el-container>
        <el-aside>knowledagebase</el-aside>
        <el-container>
          <el-main>
            <div style="height:20px;background:pink;"></div>
          </el-main>
          <el-footer>Powered by RockYourTeam</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import Heads from "@/components/header/Header.vue";
export default {
  name: "project",
  components: { Heads },
  created() {
  },
  methods: {
  }
};
</script>
<style scoped>
.knowledagebase,
.knowledagebase /deep/ .el-container.is-vertical {
  height: 100%;
}
.knowledagebase /deep/ .el-header {
  padding: 0;
  height: auto !important;
  background: #7b7de5;
}
.knowledagebase /deep/ .el-aside {
  width: 18% !important;
  background: pink;
}
.knowledagebase /deep/ .el-footer {
  padding: 0;
  background: #e8e9ed;
  line-height: 60px;
  text-align: center;
  color: #878ea1;
}
</style>
