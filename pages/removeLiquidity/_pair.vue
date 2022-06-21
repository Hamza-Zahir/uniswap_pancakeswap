<template>
  <div class="w-fk">
    <div class="bg-dark rounded-15 text-light p-3">
      <div class="box rounded-15">
        <div class="d-flex justify-content-between align-items-center">
          <nuxt-link to="/" class="text-light">
            <b-icon icon="arrow-left" class="h2 fw-bold p-0 m-0 cp"></b-icon>
          </nuxt-link>
          <h4 class="mx-5">Remove liquidity</h4>
          <b-icon icon="gear" class="h4 fw-bold p-0 m-0 cp"></b-icon>
        </div>
      </div>
      <div class="text-info rounded-15 p-3 bg-blue_dark mw-400 mt-3">
        Tip: Removing pool tokens converts your position back into underlying
        tokens at the current rate, proportional to your share of the pool.
        Accrued fees are included in the amounts you receive.
      </div>
      <div v-if="positionsRemmoved">
        <div class="bg-dark-50 rounded-15 p-3 mt-3">
          <h1>{{ percentage }}%</h1>
          <div class="d-flex justify-content-between mt-2">
            <div
              class="btn text-info bg-blue_dark rounded-10"
              @click="
                () => {
                  percentage = 25;
                  amountRemoved0 = big(positionsRemmoved.amount0)
                    .div(4)
                    .toFixed();
                  amountRemoved1 = big(positionsRemmoved.amount1)
                    .div(4)
                    .toFixed();
                  maxLiquidityRemoved = big(positionsRemmoved.totalPoolToken)
                    .div(4)
                    .minus(10 ** -19 * 6)
                    .toFixed(18);
                  approved = false;
                }
              "
            >
              25%
            </div>
            <div
              class="btn text-info bg-blue_dark rounded-10"
              @click="
                () => {
                  percentage = 50;
                  amountRemoved0 = big(positionsRemmoved.amount0)
                    .div(2)
                    .toFixed();
                  amountRemoved1 = big(positionsRemmoved.amount1)
                    .div(2)
                    .toFixed();
                  maxLiquidityRemoved = big(positionsRemmoved.totalPoolToken)
                    .div(2)
                    .minus(10 ** -19 * 6)
                    .toFixed(18);
                  approved = false;
                }
              "
            >
              50%
            </div>
            <div
              class="btn text-info bg-blue_dark rounded-10"
              @click="
                () => {
                  percentage = 75;
                  amountRemoved0 = big(positionsRemmoved.amount0)
                    .div(4)
                    .times(3)
                    .toFixed();

                  amountRemoved1 = big(positionsRemmoved.amount1)
                    .div(4)
                    .times(3)
                    .toFixed();
                  maxLiquidityRemoved = big(positionsRemmoved.totalPoolToken)
                    .div(4)
                    .times(3)
                    .minus(10 ** -19 * 6)
                    .toFixed(18);
                  approved = false;
                }
              "
            >
              75%
            </div>
            <div
              class="btn text-info bg-blue_dark rounded-10"
              @click="
                () => {
                  percentage = 100;
                  amountRemoved0 = positionsRemmoved.amount0;
                  amountRemoved1 = positionsRemmoved.amount1;
                  maxLiquidityRemoved = positionsRemmoved.totalPoolToken;
                  approved = false;
                }
              "
            >
              Max
            </div>
          </div>
        </div>
        <div class="bg-dark-50 rounded-15 p-3 mt-3">
          <div class="d-flex justify-content-between">
            <span> {{ amountRemoved0 ? amountRemoved0 : "-" }}</span>
            <span>{{ positionsRemmoved.token0.symbol }}.</span>
          </div>
          <div class="d-flex justify-content-between">
            <span>{{ amountRemoved1 ? amountRemoved1 : "-" }}</span>
            <span>{{ positionsRemmoved.token1.symbol }}</span>
          </div>
        </div>
        <div class="mt-3 d-flex justify-content-between align-items-center">
          <span>Price</span>
          <div class="">
            <div class="">
              1
              <span class="fw-bold">{{ positionsRemmoved.token0.symbol }}</span>
              =
              {{
                calc_div(positionsRemmoved.amount1, positionsRemmoved.amount0)
              }}

              <span class="fw-bold">{{ positionsRemmoved.token1.symbol }}</span>
            </div>
            <div class="">
              1
              <span class="fw-bold">{{ positionsRemmoved.token1.symbol }}</span>
              =
              {{
                calc_div(positionsRemmoved.amount0, positionsRemmoved.amount1)
              }}
              <span class="fw-bold">{{ positionsRemmoved.token0.symbol }}</span>
            </div>
          </div>
        </div>
        <div v-if="percentage > 0" class="mt-4 d-flex">
          <div
            class="btn text-light col rounded-10 mx-2"
            :class="
              !approved && !lodingApproved
                ? 'bg-primary'
                : !approved && lodingApproved
                ? 'loader bg_secondary'
                : 'bg_secondary'
            "
            @click="
              () => {
                if (!approved && !lodingApproved) {
                  approve(
                    positionsRemmoved.pairAdreess,
                    positionsRemmoved.chainId
                  );
                }
              }
            "
          >
            <span> Approve </span>
          </div>

          <div
            class="btn text-light col rounded-10 mx-2"
            :class="
              approved && !lodingRemove
                ? 'bg-primary'
                : approved && lodingRemove
                ? 'loader bg_secondary'
                : 'bg_secondary'
            "
            @click="
              () => {
                if (approved && !lodingRemove) {
                  removeLiquidity(
                    positionsRemmoved.token0,
                    positionsRemmoved.token1,
                    positionsRemmoved.chainId
                  );
                }
              }
            "
          >
            <span>Remove</span>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="positionsRemmoved"
      class="bg_secondary text-light p-3 px-4 m-2 my-4 rounded-15"
    >
      <h3>Your position</h3>

      <div class="d-flex justify-content-between pt-2">
        <span>
          {{ positionsRemmoved.token0.symbol }}/{{
            positionsRemmoved.token1.symbol
          }}</span
        >
        <span>{{ positionsRemmoved.totalPoolToken }}</span>
      </div>
      <div class="d-flex justify-content-between mt-1">
        <span>Your pool share:</span>
        <span
          >{{ FormatNumber.formatDicimals(positionsRemmoved.poolShare) }}%</span
        >
      </div>
      <div class="d-flex justify-content-between mt-1">
        <span>{{ positionsRemmoved.token0.symbol }}:</span>
        <span>{{ positionsRemmoved.amount0 }}</span>
      </div>
      <div class="d-flex justify-content-between mt-1">
        <span>{{ positionsRemmoved.token1.symbol }}:</span>
        <span>{{ positionsRemmoved.amount1 }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import REMOVE_LIQUIDITY from "~/plugins/removeLiquidity";
import Web3 from "web3";
// import Pair_abi from "~/json/uniswap/pairs_ABI.json";
import handelChain from "~/plugins/handelChain";
import { mapGetters, mapActions } from "vuex";
import big from "big.js";
import FormatNumber from "~/plugins/index";
export default {
  data() {
    return {
      approved: false,
      percentage: 0,
      amountRemoved0: "",
      amountRemoved1: "",
      maxLiquidityRemoved: "",
      lodingApproved: false,
      lodingRemove: false,
      big,
      FormatNumber,
    };
  },
  computed: {
    ...mapGetters(["positionsRemmoved"]),
    ...mapGetters(["CurrentAccount"]),
  },
  mounted() {},

  methods: {
    calc_div(num1, num2) {
      const resalt = big(big(num1).div(num2)).toFixed();

      return FormatNumber.formatDicimals(resalt);
    },

    async approve(_pairAdreess, _chainId) {
      try {
        const ethereum = window.ethereum;
        const web3 = new Web3(Web3.givenProvider || ethereum);
        let Pair_abi;
        let spender;
        if (_chainId == 1 || _chainId == 3 || _chainId == 42) {
          Pair_abi = require("~/json/uniswap/pairs_ABI.json");
          spender = "0x7a250d5630b4cf539739df2c5dacb4c659f2488d";
        } else if (_chainId == 56) {
          Pair_abi = require("~/json/pancakeswap/mainnet/pairs_ABI_pancakeswap.json");
          spender = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
        }else if (_chainId == 97) {
          Pair_abi = require("~/json/pancakeswap/testnet/pairs_ABI_pancakeswap.json");
          spender = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3";
        }

        const liquidity = web3.utils.toWei(this.maxLiquidityRemoved.toString());
        const PairContract = new web3.eth.Contract(Pair_abi, _pairAdreess);
        this.lodingApproved = true;
        await PairContract.methods
          .approve(spender, liquidity)
          .send({ from: this.CurrentAccount })
          .then(() => {
            this.approved = true;
            this.lodingApproved = false;
          });
      } catch (error) {
        console.log(error);
        this.approved = false;
        this.lodingApproved = false;
      }
    },
    async removeLiquidityMultiFunction(tokenA, tokenB, _chainId) {
      this.lodingRemove = true;
      const ethereum = window.ethereum;
      const web3 = new Web3(Web3.givenProvider || ethereum);
      const liquidity = web3.utils.toWei(this.maxLiquidityRemoved.toString());
      await REMOVE_LIQUIDITY.RemoveLiquidity(
        tokenA.address,
        tokenB.address,
        liquidity,
        this.CurrentAccount,
        _chainId
      );
    },
    async removeLiquidity(tokenA, tokenB, _chainId) {
      try {
        await this.removeLiquidityMultiFunction(tokenA, tokenB, _chainId).then(
          () => {
            this.lodingRemove = false;
            this.lodingApproved = false;
            this.approved = false;
            this.percentage = 0;
            this.amountRemoved0 = "";
            this.amountRemoved1 = "";
            this.maxLiquidityRemoved = "";
          }
        );
      } catch (error) {
        console.log();
      }
    },
  },
};
</script>
