<template>
  <div class="w-fk text-light importLP rounded-15">
    <div class="bg-dark rounded-15 text-light p-3">
      <div class="box rounded-15">
        <div class="d-flex justify-content-between align-items-center">
          <nuxt-link to="/" class="text-light">
            <b-icon icon="arrow-left" class="h2 fw-bold p-0 m-0 cp"></b-icon>
          </nuxt-link>
          <h4 class="mx-5">Import V2 Pool</h4>
          <span></span>
        </div>
      </div>
      <div class="text-info rounded-15 p-3 bg-blue_dark mw-400 mt-3">
        Tip: Use this tool to find v2 pools that don't automatically appear in
        the interface.
      </div>

      <!-- ....................................... -->
      <div
        class="fw-bold cp border border-secondary rounded-15 mt-3 p-3 d-flex justify-content-between align-items-center"
        @click="showSelectA = !showSelectA"
      >
        <span class="fw-bold" v-if="address0"
          ><img
            :src="tokens[indexA].img"
            alt=""
            class="me-1"
            style="width: 25px"
          />
          {{ tokens[indexA].symbol }}</span
        >

        <span v-if="!address0">Select a token</span>
        <b-icon icon="chevron-down" class="ms-1"></b-icon>
      </div>
      <div class="SelectAToken rounded-15 bg-dark" v-if="showSelectA">
        <h4 class="p-3 m-0 d-flex justify-content-between border-bottom">
          <span>Select a Token</span>
          <span class="text-info" @click="showSelectA = false">
            <b-icon icon="x" class="ms-1 h2 m-0"></b-icon>
          </span>
        </h4>
        <div class="list-tokens">
          <div
            v-for="(token, i) in tokens"
            :key="token.symbol"
            class="d-flex justify-content-between p-3 cp"
            @click="
              () => {
                indexA = i;
                address0 = token.address;
                showSelectA = false;
                if (address1 == token.address) {
                  (indexB = ''), (address1 = '');
                }
                importLp();
              }
            "
          >
            <span class="fw-bold"
              ><img :src="token.img" alt="" class="me-1" style="width: 30px" />
              {{ token.symbol }}
            </span>
          </div>
        </div>
      </div>
      <!-- ............................................................... -->
      <h1 class="text-center my-2">+</h1>
      <!-- ....................................... -->
      <div
        class="fw-bold cp border border-secondary rounded-15 mt-3 p-3 d-flex justify-content-between align-items-center"
        @click="showSelectB = !showSelectB"
      >
        <span class="fw-bold" v-if="address1"
          ><img
            :src="tokens[indexB].img"
            alt=""
            class="me-1"
            style="width: 25px"
          />
          {{ tokens[indexB].symbol }}</span
        >

        <span v-if="!address1">Select a token</span>
        <b-icon icon="chevron-down" class="ms-1"></b-icon>
      </div>
      <!-- ................................................ -->
      <div class="SelectAToken rounded-15 bg-dark" v-if="showSelectB">
        <h4 class="p-3 m-0 d-flex justify-content-between border-bottom">
          <span>Select a Token</span>
          <span class="text-info" @click="showSelectB = false">
            <b-icon icon="x" class="ms-1 h2 m-0"></b-icon>
          </span>
        </h4>
        <div class="list-tokens">
          <div
            v-for="(token, i) in tokens"
            :key="token.symbol"
            class="d-flex justify-content-between p-3 cp"
            @click="
              () => {
                indexB = i;
                address1 = token.address;
                showSelectB = false;
                if (address0 == token.address) {
                  (indexA = ''), (address0 = '');
                }

                importLp();
              }
            "
          >
            <span class="fw-bold"
              ><img :src="token.img" alt="" class="me-1" style="width: 30px" />
              {{ token.symbol }}
            </span>
          </div>
        </div>
      </div>

      <div
        v-if="!address0 || !address1"
        class="bg-dark-50 mt-3 rounded-10 p-3 py-4 text-center"
      >
        Select a token to find your v2 liquidity.
      </div>
      <div
        v-if="address0 && address1 && !position && !loding"
        class="bg-dark-50 mt-3 rounded-10 p-3 py-4 text-center"
      >
        You don't have liquidity in this pool yet. <br />

        <nuxt-link to="/addLiquidity" class="fw-bold mt-3 d-block">
          Add Liquidity.
        </nuxt-link>
      </div>
      <div
        v-if="address0 && address1 && loding"
        class="loader bg-dark-50 mt-3 rounded-10 p-3 py-4 text-center"
      >
        <span> Loding </span>
      </div>
      <div
        v-if="position"
        class="bg-dark-50 mt-3 rounded-10 p-3 py-4 text-center"
      >
        <PositionCard
          :position="position"
          index="0"
          :CurrentAccount="CurrentAccount"
        />
      </div>
    </div>
  </div>
</template>
<script>
import kovan from "~/json/kovan.json";
import { mapActions, mapGetters } from "vuex";
import GetPool from "~/plugins/importPool";
import handelChain from "~/plugins/handelChain";
import PositionCard from "~/components/positionCard.vue";

export default {
  data() {
    return {
      tokens: kovan,
      chainId: 42,
      loding: false,
      showSelectA: false,
      showSelectB: false,
      address0: "",
      address1: "",
      indexA: "",
      indexB: "",
      position: "",
    };
  },
  computed: {
    ...mapGetters(["CurrentAccount"]),
  },
  mounted() {
    this.getnetworkData();
  },
  methods: {
    ...mapActions(["checkWalletIsConnected"]),
    async getnetworkData() {
      await this.checkWalletIsConnected();
      const _chainData = await handelChain.HandelChain();
      this.tokens = _chainData.tokens;
      this.chainId = _chainData.chainId;
    },
    async importLp() {
      try {
        this.position = "";
        if (this.address0 && this.address1 && this.address0 !== this.address1) {
          this.loding = true;
          await GetPool.fetchPool(
            this.CurrentAccount,
            this.address0,
            this.address1,
            this.chainId
          ).then((resalt) => {
            this.position = resalt;
            this.loding = false;
          });
        }
      } catch (error) {
        console.log(error);
        this.position = "";
        this.loding = false;
      }
    },
  },
  components: { PositionCard },
};
</script>
