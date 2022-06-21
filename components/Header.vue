<template>
  <div class="header d-flex align-items-center ">
    <div class="w-fk bg-dark rounded-15 p-2 px-3 ">
      <nuxt-link to="/" class="rounded-15 p-1 px-3"> Pool</nuxt-link>
      <nuxt-link to="/swapTokens" class="rounded-15 p-1 px-3"> Swap</nuxt-link>
    </div>
    <div class="mx-auto">
      <div
        class="btn btn-primary rounded-10"
        v-if="!CurrentAccount"
        @click="connectMetamask"
      >
        connect Metamask
      </div>
    </div>
    <div class="w-fk" v-if="CurrentAccount">
    <ChangeNetwork />
</div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["CurrentAccount"]),
  },
  mounted() {
    this.checkWalletIsConnected();
  },
  methods: {
    ...mapActions(["checkWalletIsConnected"]),
    ...mapActions(["connectMetamask"]),
  },
};
</script>
