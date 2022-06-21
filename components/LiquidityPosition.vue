<template>
  <div class="yourLiquidity mx-auto">
    <nuxt-link
      to="/addLiquidity"
      class="btn bg-qu rounded-15 fw-bold p-2 my-3 w-100"
    >
      + Add Liquidity</nuxt-link
    >

    <div class="box rounded-15">
      <div class="p-3 px-4">
        <h4>Your Liquidity</h4>
        <span>Remove liquidity to receive tokens back</span>
      </div>
      <div class="bg-dark text-center p-3 px-4">
        <div v-if="!CurrentAccount">
          Connect to a wallet to view your liquidity
        </div>

        <div v-if="CurrentAccount">
          <div v-if="loding" class="loader">
            <span> Loding </span>
          </div>
          <div v-if="positions">
            <div
              v-for="(position, i) in positions"
              :key="`positin-${i}`"
              class="positions"
            >
              <PositionCard
                :position="position"
                :index="i"
                :CurrentAccount="CurrentAccount"
              />
            </div>
          </div>
          <div class="my-3">
            <div class="">Don't see a pool you joined?</div>
            <nuxt-link
              to="/importLiquidity"
              class="btn border border-info text-info rounded-10 mt-3 py-2 px-3"
            >
              Find other LP tokens
            </nuxt-link>
          </div>
        </div>
      </div>
      <div class="p-3 px-4"></div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import handelChain from "~/plugins/handelChain";

import kovan from "~/json/kovan.json";
import { ChainId } from "@uniswap/sdk";
import FetchPairs from "~/plugins/fetchPairs";
import PositionCard from "./positionCard.vue";

export default {
  data() {
    return {
      tokens: kovan,
      chainId: 1,
      positions: "",
      loding: false,
    };
  },
  computed: {
    ...mapGetters(["CurrentAccount"]),
  },
  mounted() {
    this.getUserPool();
  },
  methods: {
    ...mapActions(["checkWalletIsConnected"]),
    async handelChain() {
      const _chainData = await handelChain.HandelChain();
      this.tokens = _chainData.tokens;
      this.chainId = _chainData.chainId;
      ethereum.on("chainChanged", handleChainChanged);
      function handleChainChanged(_chainId) {
        window.location.reload();
      }
    },
    async getUserPool() {
      try {
        this.loding = true;
        await this.checkWalletIsConnected();
        await this.handelChain();

        await FetchPairs.fetchPairs(this.CurrentAccount, this.tokens,this.chainId).then(
          (resalt) => {
            this.positions = resalt;
            this.loding = false;
          }
        );
      } catch (error) {
        console.log(error);
        this.loding = false;
        this.positions = "";
      }
    },
  },
  components: { PositionCard },
};
</script>
