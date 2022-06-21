<template>
  <div class="">
    <div class="swap w-fk bg-dark text-light rounded-15 mx-auto mt-5 px-3">
      <div class="py-3 px-3 d-flex justify-content-between">
        <span class="fw-bold">Swap</span>
        <b-icon icon="gear" class="h4 fw-bold p-0 m-0 cp"></b-icon>
      </div>
      <div class="p-2 pe-2 rounded-15 bg-blue_dark py-3">
        <div class="d-flex justify-content-between">
          <div class="input">
            <input
              type="number"
              name=""
              id=""
              :value="amountA"
              placeholder="0.0"
              class="w-100 p-2 rounded-15 fw-bold"
              @input="
                (e) => {
                  amountA = e.target.value;
                  Quote();
                }
              "
            />
          </div>
          <div class="d-flex align-items-center">
            <div
              class="fw-bold cp rounded-15 p-2"
              @click="showSelectA = !showSelectA"
              :class="!tokenA ? 'bg-primary' : ''"
            >
              <span class="fw-bold" v-if="tokenA"
                ><img
                  :src="tokens[indexA].img"
                  alt=""
                  class="me-1"
                  style="width: 25px"
                />
                {{ tokens[indexA].symbol }}
              </span>

              <span v-if="!tokenA">Select a token</span>
              <b-icon icon="chevron-down" class="ms-1"></b-icon>
            </div>
          </div>
        </div>
        <div class="text-end pt-3" v-if="CurrentAccount && balanceA >= 0">
          <span v-if="tokenA" class="blance text-secondary fw-bold"
            >Balance:{{ balanceA }}</span
          >
          <span
            class="cp border border-info p-1 pt-0 rounded-3 text-info"
            @click="
              () => {
                amountA = balanceA;
                Quote();
              }
            "
            >max</span
          >
        </div>
      </div>

      <!-- ..................................... -->
      <h1 class="text-center">
        <b-icon
          icon="arrow-down-short"
          @click="swetch()"
          class="h4 m-0 p-0 fw-bold p-0 m-0 cp border rounded"
        ></b-icon>
      </h1>
      <!-- ....................................... -->

      <div class="p-2 pe-2 rounded-15 bg-blue_dark py-3">
        <div class="d-flex justify-content-between">
          <div class="input fw-bold p-2">
            <span :class="amountB === '' ? 'text-secondary' : ''">{{
              amountB !== "" ? amountB : "0.0"
            }}</span>
          </div>
          <div class="d-flex align-items-center">
            <div
              class="fw-bold cp rounded-15 p-2"
              @click="showSelectB = !showSelectB"
              :class="!tokenB ? 'bg-primary' : ''"
            >
              <span class="fw-bold" v-if="tokenB"
                ><img
                  :src="tokens[indexB].img"
                  alt=""
                  class="me-1"
                  style="width: 25px"
                />
                {{ tokens[indexB].symbol }}
              </span>

              <span v-if="!tokenB">Select a token</span>
              <b-icon icon="chevron-down" class="ms-1"></b-icon>
            </div>
          </div>
        </div>
        <div class="text-end pt-3" v-if="CurrentAccount && balanceB >= 0">
          <span v-if="tokenB" class="blance text-secondary fw-bold"
            >Balance:{{ balanceB }}</span
          >
        </div>
      </div>
      <!-- ..................SelectAToken........................ -->

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
                if (tokenB == token.address) {
                  // (indexB = indexA), (tokenB = tokenA), (balanceB = balanceA);
                  swetch();
                }
                indexA = i;
                tokenA = token.address;
                showSelectA = false;
                balanceA = allBalances[token.symbol];
                Quote();
              }
            "
          >
            <span class="fw-bold"
              ><img :src="token.img" alt="" class="me-1" style="width: 30px" />
              {{ token.symbol }}</span
            >
            <span>{{ allBalances[token.symbol] }}</span>
          </div>
        </div>
      </div>

      <!-- ................................. -->

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
                if (tokenA == token.address) {
                  // (indexA = indexB), (tokenA = tokenB), (balanceA = balanceB);
                  swetch();
                }
                indexB = i;
                tokenB = token.address;
                balanceB = allBalances[token.symbol];
                showSelectB = false;
                Quote();
              }
            "
          >
            <span class="fw-bold"
              ><img :src="token.img" alt="" class="me-1" style="width: 30px" />
              {{ token.symbol }}</span
            >
            <span>{{ allBalances[token.symbol] }}</span>
          </div>
        </div>
      </div>
      <!-- .............................................. -->
      <div v-if="token0Price" class="bg-dark-50 rounded-10 mt-3 p-2 cp">
        <div
          v-if="showPrice0"
          @click="
            () => {
              showPrice0 = false;
              showPrice1 = true;
            }
          "
        >
          1<span class="h6">{{ tokens[indexA].symbol }}</span> =
          {{ token0Price }}
          <span class="h6">{{ tokens[indexB].symbol }}</span>
        </div>
        <div
          v-if="showPrice1"
          @click="
            () => {
              showPrice0 = true;
              showPrice1 = false;
            }
          "
        >
          1<span class="h6">{{ tokens[indexB].symbol }}</span> =
          {{ token1Price }}
          <span class="h6">{{ tokens[indexA].symbol }}</span>
        </div>
      </div>
      <!-- .......................................................... -->
      <div class="p-3 px-4">
        <div v-if="CurrentAccount">
          <div
            v-if="!tokenA || !tokenB"
            class="bg_secondary rounded-15 fw-bold w-100 p-2 text-center text-dark"
          >
            <span></span>
            Select a Token
          </div>

          <div
            v-if="tokenA && tokenB && amountA == 0 && amountB == 0"
            class="bg_secondary rounded-15 fw-bold w-100 p-2 text-center text-dark"
          >
            Enter an amount
          </div>
          <div
            v-if="tokenA && tokenB && amountA > 0 && amountB === 0"
            class="bg-danger rounded-15 fw-bold w-100 p-2 text-center text-dark"
          >
            The Amount is too low
          </div>
          <div
            v-if="
              tokenA &&
              tokenB &&
              amountA > 0 &&
              amountB > 0 &&
              amountA > balanceA
            "
            class="bg_secondary rounded-15 fw-bold w-100 p-2 text-center text-dark"
          >
            {{ `Insufficient ${tokens[indexA].symbol} balance` }}
          </div>
          <div
            class="d-flex"
            v-if="
              tokenA &&
              tokenB &&
              amountA > 0 &&
              amountB > 0 &&
              amountA <= balanceA
            "
          >
            <div
              v-if="!TokensApproveA && tokenA != 'ETHER'"
              class="btn rounded-15 fw-bold w-100 p-2 m-1 text-dark"
              :class="!lodingApproveA ? 'bg-qu ' : 'loader bg-secondary'"
              @click="
                () => {
                  if (!lodingApproveA) {
                    Approve();
                  }
                }
              "
            >
              <span v-if="lodingApproveA">
                Approve
                {{ tokens[indexA].symbol }}
              </span>
              <span v-if="!lodingApproveA">
                Allow the Uniswap Protocol to use your
                {{ tokens[indexA].symbol }} Swap
              </span>
            </div>
          </div>
          <div
            v-if="
              tokenA &&
              tokenB &&
              amountA > 0 &&
              amountB > 0 &&
              amountA <= balanceA &&
              TokensApproveA
            "
            class="btn rounded-15 fw-bold w-100 p-2"
            :class="!swapeng ? 'bg-qu' : 'bg-secondary'"
            @click="
              () => {
                if (!swapeng) {
                  Swap();
                }
              }
            "
          >
            Swap
          </div>
        </div>
        <div
          v-if="!CurrentAccount"
          class="btn bg-qu rounded-15 fw-bold w-100 p-2"
          @click="connectMetamask()"
        >
          Connect Wallet
        </div>
      </div>
      <div v-if="swapeng" class="addToken p-3">
        <div class="text-center box rounded-10">
          <div class="text-end pe-1 h1">
            <b-icon icon="x" @click="swapeng = false" class=""></b-icon>
          </div>
          <h1 class="icon">
            <b-icon icon="arrow-up-circle" class="h1"></b-icon>
          </h1>
          <div class="my-2">Transaction Submitted</div>
          <a href="" class="">View on Explorer</a> <br />
          <div
            class="btn btn-info fw-bold px-3 mt-2 rounded-15"
            @click="
              () => {
                AddTokenToWallet();
              }
            "
          >
            Add {{ tokens[indexB].symbol }} To Wallet
          </div>
          <div
            class="btn btn-primary my-3 rounded-10 col-10"
            @click="swapeng = false"
          >
            Close
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import kovan from "~/json/kovan.json";
import handelChain from "~/plugins/handelChain";
import AllBlances from "~/plugins/getAllBalances";
import LiquidityPosition from "~/components/LiquidityPosition.vue";
import SWAP_PANCTIONS from "~/plugins/quote";
import Swap_Tokens from "~/plugins/Swap_Tokens";
import Plugens from "~/plugins/index";
import AddToken from "~/plugins/addToken";
export default {
  components: { LiquidityPosition },
  data() {
    return {
      tokens: kovan,
      showSelectA: false,
      showSelectB: false,
      indexA: "",
      indexB: "",
      tokenA: "",
      tokenB: "",
      amountA: "",
      amountB: "",
      balanceA: "",
      balanceB: "",
      allBalances: {},
      chainId: 42,
      lodingApproveA: false,
      TokensApproveA: false,
      amountOutMin: "",
      token0Price: "",
      token1Price: "",
      showPrice0: true,
      showPrice1: false,
      swapeng: false,
    };
  },
  computed: {
    ...mapGetters(["CurrentAccount"]),
    ...mapGetters(["metamaskConectedS"]),
  },
  mounted() {
    this.getAllBalances();
  },
  methods: {
    ...mapActions(["checkWalletIsConnected"]),
    ...mapActions(["connectMetamask"]),
    // checkPair() {
    //   if (
    //     (this.tokenA == "ETHER" &&
    //       (this.tokenB == "0xd0A1E359811322d97991E03f863a0C30C2cF029C" ||
    //         this.tokenB == "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" ||
    //         this.tokenB == "0xc778417E063141139Fce010982780140Aa0cD5Ab")) ||
    //     (this.tokenB == "ETHER" &&
    //       (this.tokenA == "0xd0A1E359811322d97991E03f863a0C30C2cF029C" ||
    //         this.tokenA == "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" ||
    //         this.tokenA == "0xc778417E063141139Fce010982780140Aa0cD5Ab"))
    //   ) {
    //     return false;
    //   } else {
    //     return true;
    //   }
    // },

    async getAllBalances() {
      await this.checkWalletIsConnected();
      const _chainData = await handelChain.HandelChain();
      this.tokens = _chainData.tokens;
      this.chainId = _chainData.chainId;
      const resaltBalances = await AllBlances.GetAllBlances(
        this.tokens,
        this.CurrentAccount
      );
      this.allBalances = resaltBalances;
    },

    async Quote() {
      if (this.amountA && this.tokenA && this.tokenB) {
        await SWAP_PANCTIONS.quote(
          this.amountA,
          this.tokenA,
          this.tokenB,
          this.chainId
        ).then((result) => {
          this.amountB = result.amountAout;
          this.amountOutMin = result.MinimumReceived;
          this.token0Price = result.token0Price;
          this.token1Price = result.token1Price;
          if (
            this.tokenA === "ETHER" ||
            (this.tokenB === "ETHER" &&
              (this.tokens[this.indexA].symbol === "WETH" ||
                this.tokens[this.indexA].symbol === "WBNB"))
          ) {
            this.lodingApproveA = true;
            this.TokensApproveA = true;
          } else {
            this.lodingApproveA = false;
            this.TokensApproveA = false;
          }
        });
      }
    },
    swetch() {
      let iA = this.indexA;
      let iB = this.indexB;
      this.indexA = iB;
      this.indexB = iA;

      let tA = this.tokenA;
      let tB = this.tokenB;
      this.tokenA = tB;
      this.tokenB = tA;

      let bA = this.balanceA;
      let bB = this.balanceB;
      this.balanceA = bB;
      this.balanceB = bA;

      this.amountA = this.amountB;
      this.amountB = "";

      this.Quote();
    },
    async Approve() {
      const _decimals = this.tokens[this.indexA].decimals;
      try {
        let spender;
        if (this.chainId == 1 || this.chainId == 3 || this.chainId == 42) {
          spender = "0x7a250d5630b4cf539739df2c5dacb4c659f2488d";
        } else if (this.chainId == 56) {
          spender = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
        } else if (this.chainId == 97) {
          spender = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3";
        }

        this.lodingApproveA = true;
        await Plugens.approveTokens(
          this.tokenA,
          this.amountA,
          this.CurrentAccount,
          spender,
          _decimals
        ).then(() => {
          this.lodingApproveA = true;
          this.TokensApproveA = true;
        });
      } catch (error) {
        console.log(error);
        this.lodingApproveA = false;
        this.TokensApproveA = false;
      }
    },

    async swapToken() {
      const _decimals0 = this.tokens[this.indexA].decimals;
      const _decimals1 = this.tokens[this.indexB].decimals;

      if (this.tokenA === "ETHER") {
        this.swapeng = true;
        await Swap_Tokens.swapETHForTokens(
          this.amountA,
          this.amountOutMin,
          this.CurrentAccount,
          this.tokenB,
          _decimals1,
          this.chainId
        );
      } else if (this.tokenB === "ETHER") {
        this.swapeng = true;
        await Swap_Tokens.SwapExactTokensForETH(
          this.amountA,
          this.amountOutMin,
          this.CurrentAccount,
          this.tokenA,
          _decimals0,
          _decimals1,
          this.chainId
        );
      } else {
        const path = [this.tokenA, this.tokenB];

        this.swapeng = true;
        await Swap_Tokens.SwapExactTokensForTokens(
          this.amountA,
          this.amountOutMin,
          path,
          this.CurrentAccount,
          _decimals0,
          _decimals1,
          this.chainId
        );
      }
    },
    async Swap() {
      try {
        await this.swapToken().then(() => {
          this.lodingApproveA = false;
          this.TokensApproveA = false;
          this.amountOutMin = "";
          this.amountA = "";
          this.amountB = "";
        });
      } catch (error) {
        console.log(error);
        this.lodingApproveA = false;
        this.TokensApproveA = false;
        this.swapeng = false;
      }
    },
    async AddTokenToWallet() {
      await AddToken.addToken(
        this.tokenB,
        this.tokens[this.indexB].symbol,
        this.tokens[this.indexB].decimals,
        this.tokens[this.indexB].img
      );
    },
  },
};
</script>
