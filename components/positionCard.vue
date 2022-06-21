<template>
  <div class="positin border rounded-10 my-2 p-2 bg-gred">
    <div class="d-flex justify-content-between">
      <div class="logo">
        <span><img src="" alt="" /></span>
        <span><img src="" alt="" /></span>
        <span class="fw-bold">{{
          `${position.token0.symbol}/ ${position.token1.symbol} `
        }}</span>
      </div>
      <span class="cp text-primary" @click="manage = !manage"
        >Manage
        <b-icon icon="chevron-down" class="fw-bold p-0 m-0 pt-1"></b-icon>
      </span>
    </div>
    <!-- .......................... -->

    <div v-if="manage" class="body mt-3">
      <div class="d-flex justify-content-between my-1">
        <span>Your Total Pool Tokens: </span>
        <span class="ms-2">{{
        FourmatNumber.formatDicimals(position.totalPoolToken)

        }}</span>
      </div>
      <div class="d-flex justify-content-between my-1">
        <span>pooled {{ position.token0.symbol }}:</span>
        <span class="ms-2">{{ position.amount0

         }}</span>
      </div>
      <div class="d-flex justify-content-between my-1">
        <span>pooled {{ position.token1.symbol }}:</span>
        <span class="ms-2">{{ position.amount1

         }}</span>
      </div>
      <div class="d-flex justify-content-between my-1">
        <span>Your pool share:</span>
        <span
          >{{
            (position.poolShare).toFixed(2) == "0.00" ? `&lt;0.01` : (position.poolShare).toFixed(2)
          }}%</span
        >
      </div>
      <a
        :href="`https://v2.info.uniswap.org/account/${CurrentAccount}`"
        target="blank"
        class="border border-primary py-1 my-3 text-senter fw-300 w-100 d-block rounded-10"
      >
        View accrued fees and analytics
        <b-icon icon="box-arrow-up-right" class="fw-bold pe-1 m-0"></b-icon>
      </a>
      <div class="btns d-flex">
        <div class="btn btn-primary col mx-1">Migrate</div>
        <div class="btn btn-primary col mx-1">Add</div>
        <div
          @click="
            () => {
              this.$store.commit('setPositionsRemmoved', position);
            }
          "
        >
          <nuxt-link
            :to="`/removeLiquidity/${index}&pair=${position.pairAdreess}`"
            class="btn btn-primary col mx-1"
            >Remove
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FourmatNumber from "~/plugins/index"
export default {

  props: {
    position: {
      required: true,
      type: Object,
    },
    index: {
      required: true,
      type: Number,
    },
    CurrentAccount: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      manage: false,
      FourmatNumber
    };
  },
};
</script>
