<template>
  <div class="starproject">
    <router-view></router-view>
  </div>
</template>
<script>
import Cart from "@/components/Cart.vue";
import CartDetail from "@/components/CartDetail.vue";
export default {
  data() {
    return {

    };
  },
  components: { Cart, CartDetail },
  computed: {
  },
  methods: {
  }
};
</script>
<style scoped>
.starproject {
  height: 100%;
}
</style>
