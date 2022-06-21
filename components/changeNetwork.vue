<template>

  <div class="bg-blue_dark text-light pr rounded-10">
    <div
      class="py-2 px-3 fw-bold bg-blue_dark d-flex justify-content-between rounded-10"
      @click="showNetworks = !showNetworks"
    >
      {{ chainName }}
      <b-icon icon="chevron-down" class="ms-1 pt-1"></b-icon>
    </div>

    <div class="bg-blue_dark  pat0l0 cp rounded-10" v-if="showNetworks">
      <div v-for="net in networks" :key="net.chainName">
        <div
          class="py-2 px-3 fw-bold p-1 border-top rounded-10"
          :class="net.chainName == chainName ? 'd-none' : ''"
          @click="
            () => {
              chengNetwork(net);
              showNetworks = false;
            }
          "
        >
          {{ net.chainName }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import networks from "~/json/networks.json";
import { mapActions, mapGetters } from "vuex";
const networksManage = networks;
export default {
  data() {
    return {
      networks,
      chainId: 42,
      chainName: "Kovan",
      showNetworks: false,
    };
  },
  computed: {
    ...mapGetters(["CurrentAccount"]),
  },
  mounted() {
    this.manegChainId();
    this.getchainID();
  },
  methods: {
    ...mapActions(["checkWalletIsConnected"]),
    ...mapActions(["connectMetamask"]),
    async getchainID() {
      await this.checkWalletIsConnected();
      const ethereum = window.ethereum;
      const chainId = await ethereum.request({ method: "eth_chainId" });
      this.chainId = chainId;
      networks.map((e) => {
        if (e.chainId == chainId) {
          this.chainName = e.chainName;
        }
      });
    },
    manegChainId() {
      networksManage.map((e) => {
        e.chainId = `0x${Number(e.chainId).toString(16)}`;
      });
    },

    async chengNetwork(networkData) {
      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: networkData.chainId }],
        });
      } catch (switchError) {
        console.log(switchError);
        if (switchError.code === 4902) {
          try {
            await ethereum.request({
              method: "wallet_addEthereumChain",
              params: [{ ...networkData }],
            });
          } catch (error) {
            console.log(error);
          }
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped></style>
