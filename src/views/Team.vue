<template>
  <div class="team">
    <el-container>
      <el-header>
        <heads></heads>
      </el-header>
      <el-container>
        <el-aside>
          <!-- <div class="allTeam">
            <i class="el-icon-s-data"></i>
          </div> -->
          <div class="teamStylesoutline">
            <div
              class="teamStyles"
              v-for="item in allTeams"
              :key="item.name"
              :class="{ active: item.active }"
              @click="projectCheck(item.name)"
            >
              <i class="icons" :class="item.icon"></i>
              {{ item.name }}
            </div>
          </div>
        </el-aside>
        <el-container>
          <el-main>
            <router-view></router-view>
          </el-main>
          <el-footer>Powered by RockYourTeam</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import Heads from "@/components/header/Header.vue";
import { constants } from "crypto";
export default {
  name: "team",
  data() {
    return {
      cartFlag: true,
      allTeams: [
        {
          name: "团队组织",
          path: "/team/teamorganization",
          icon: "el-icon-user el-icon-teamorganization",
          active: false
        },
        {
          name: "成员",
          path: "/team/member",
          icon: "el-icon-user el-icon-member",
          active: true
        },
        {
          name: "角色",
          path: "/team/role",
          icon: "el-icon-user el-icon-roles",
          active: false
        },
        {
          name: "系统通知",
          path: "/team/systemNoti",
          icon: "el-icon-user el-icon-msg",
          active: false
        },
        {
          name: "操作日志",
          path: "/team/operationLogs",
          icon: "el-icon-user el-icon-logs",
          active: false
        }
      ]
    };
  },
  methods: {
    projectCheck(name) {
      this.allTeams.map(item => {
        if (item.name == name) {
          item.active = true;
          this.$router.push({path:item.path, query: {
                  t: new Date().getTime()
                }});
        } else {
          item.active = false;
        }
      });
    },
    changeCartFlag() {
      this.cartFlag = !this.changeCartFlag;
    }
  },
  created() {
    console.log(this.$route.path);
    this.allTeams.map(item => {
      if (this.$route.path.indexOf(item.path) > -1) {
        item.active = true;
      } else {
        item.active = false;
      }
    });
    console.log(this.allTeams);
  },
  components: { Heads }
};
</script>
<style scoped>
.team,
.team /deep/ .el-container.is-vertical,
.team /deep/ .el-container {
  height: 100%;
}
.team /deep/ .el-header {
  height: 50px !important;
  padding: 0;
  background: #7b7de5;
}
.team /deep/ .el-aside {
  width: 17.7% !important;
  background: #484d5e;
}
.team /deep/ .el-footer {
  height: 40px !important;
  padding: 0;
  background: #e8e9ed;
  line-height: 40px;
  text-align: center;
  color: #878ea1;
  font-size: 14px;
  /* position: fixed;
  bottom: 0;
  width: 100%; */
}
.team .allTeam {
  height: 70px;
  padding: 18px 0 0 29px;
  box-sizing: border-box;
  color: #ffffff;
  font-size: 14px;
  background: #3b404f;
  cursor: pointer;
}
.team .allTeam .el-icon-s-data {
  margin-right: 12px;
  font-size: 18px;
  vertical-align: middle;
  margin-top: -3px;
}
.teamStylesoutline {
  margin-top: 20px;
}
.team .teamStyles {
  height: 40px;
  padding: 18px 0 0 25px;
  color: #a3aed0;
  font-size: 14px;
  border-left: 3px solid #484d5e;
  background: #484d5e;
  cursor: pointer;
}
.team .active {
  color: #ffffff;
  background: #51576d;
  border-left: 3px solid #7b7de5;
}
.team .teamStyles .icons {
  margin-right: 8px;
  font-size: 20px;
  vertical-align: middle;
  margin-top: -3px;
}
.team /deep/ .el-main {
  padding: 0 30px;
  box-sizing: border-box;
  background: #f0f1f4;
}
/*自定义图标样式*/

.teamStylesoutline .teamStyles /deep/ .icons.el-icon-user:before {
    content: "";
}

.teamStylesoutline .teamStyles /deep/ .icons.el-icon-user {
    width: 20px;
    height: 20px;
    margin-right: 8px;
    vertical-align: middle;
}

.teamStylesoutline .teamStyles /deep/ .icons.el-icon-user.el-icon-teamorganization {
    background: url(../../src/assets/images/team/teamorganization.png) no-repeat;
    background-size: 90% 90%;
}

.teamStylesoutline .teamStyles /deep/ .icons.el-icon-user.el-icon-member {
    background: url(../../src/assets/images/team/teammumber.png) no-repeat;
    background-size: 90% 90%;
}

.teamStylesoutline .teamStyles /deep/ .icons.el-icon-user.el-icon-roles {
    background: url(../../src/assets/images/team/teamroles.png) no-repeat;
    background-size: 90% 90%;
}

.teamStylesoutline .teamStyles /deep/ .icons.el-icon-user.el-icon-msg {
    background: url(../../src/assets/images/team/teammsg.png) no-repeat;
    background-size: 90% 90%;
}

.teamStylesoutline .teamStyles /deep/ .icons.el-icon-user.el-icon-logs {
    background: url(../../src/assets/images/team/teamlogs.png) no-repeat;
    background-size: 83% 83%;
}


/*选中的效果*/

.teamStylesoutline .teamStyles.active /deep/ .icons.el-icon-user.el-icon-teamorganization {
    background: url(../../src/assets/images/team/teamorganizationopen.png) no-repeat;
    background-size: 83% 83%;
}

.teamStylesoutline .teamStyles.active /deep/ .icons.el-icon-user.el-icon-member {
    background: url(../../src/assets/images/team/teammumberopen.png) no-repeat;
    background-size: 83% 83%;
}

.teamStylesoutline .teamStyles.active /deep/ .icons.el-icon-user.el-icon-roles {
    background: url(../../src/assets/images/team/teamrolesopen.png) no-repeat;
    background-size: 83% 83%;
}

.teamStylesoutline .teamStyles.active /deep/ .icons.el-icon-user.el-icon-msg {
    background: url(../../src/assets/images/team/teammsgopen.png) no-repeat;
    background-size: 83% 83%;
}

.teamStylesoutline .teamStyles.active /deep/ .icons.el-icon-user.el-icon-logs {
    background: url(../../src/assets/images/team/teamlogsopen.png) no-repeat;
    background-size: 83% 83%;
}
</style>