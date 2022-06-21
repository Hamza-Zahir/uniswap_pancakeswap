<template>
  <div class="mb-5 pb-5">
    <div class="addLiquidity rounded-15 mx-auto mt-5">
      <div class="p-3 px-4 d-flex">
        <nuxt-link to="/" class="text-light">
          <b-icon icon="arrow-left" class="h2 fw-bold p-0 m-0 cp"></b-icon>
        </nuxt-link>
        <div class="ms-3">
          <h4>Add Liquidity</h4>

          <span>
            <br />

            <b-icon icon="question-circle" class="me-1"></b-icon>

            Add liquidity to receive LP tokens
          </span>
        </div>
      </div>
      <!-- ............................................. -->
      <div class="p-2 px-4">
        <div class="d-flex justify-content-between">
          <div class="fw-bold cp" @click="showSelectA = !showSelectA">
            <span class="fw-bold" v-if="tokenA"
              ><img
                :src="tokens[indexA].img"
                alt=""
                class="me-1"
                style="width: 25px"
              />
              {{ tokens[indexA].symbol }}</span
            >

            <span v-if="!tokenA">Select a currency</span>
            <b-icon icon="chevron-down" class="ms-1"></b-icon>
          </div>
          <div class="blance text-secondary fw-bold">
            <div class="" v-if="tokenA">
              Balance: <span>{{ balanceA }}</span>
            </div>
          </div>
        </div>

        <div class="input mt-3">
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
                manageAmount('A');
              }
            "
          />
          <div class="text-end pt-1" v-if="CurrentAccount && balanceA >= 0">
            <span
              class="cp border border-info p-1 pt-0 rounded-3 text-info"
              @click="
                () => {
                  amountA = balanceA;
                  manageAmount('A');
                }
              "
              >max</span
            >
          </div>
        </div>
        <!-- ...................................... -->
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
                  tokenA = token.address;
                  showSelectA = false;
                  balanceA = allBalances[token.symbol];
                  manageAmount('A');
                  if (tokenB == token.address) {
                    (indexB = ''), (tokenB = ''), (balanceB = '');
                  }
                }
              "
            >
              <span class="fw-bold"
                ><img
                  :src="token.img"
                  alt=""
                  class="me-1"
                  style="width: 30px"
                />
                {{ token.symbol }}</span
              >
              <span>{{ allBalances[token.symbol] }}</span>
            </div>
          </div>
        </div>

        <!-- ..................................... -->
      </div>
      <h2 class="text-center">+</h2>
      <div class="p-2 px-4">
        <div class="d-flex justify-content-between">
          <div class="fw-bold cp" @click="showSelectB = !showSelectB">
            <span class="fw-bold" v-if="tokenB"
              ><img
                :src="tokens[indexB].img"
                alt=""
                class="me-1"
                style="width: 25px"
              />
              {{ tokens[indexB].symbol }}</span
            >

            <span v-if="!tokenB">Select a currency</span>

            <b-icon icon="chevron-down" class="ms-1"></b-icon>
          </div>
          <div class="blance text-secondary fw-bold">
            <div class="" v-if="tokenB">
              Balance: <span>{{ balanceB }}</span>
            </div>
          </div>
        </div>

        <div class="input mt-3">
          <input
            type="number"
            name=""
            id=""
            :value="amountB"
            @input="
              (e) => {
                amountB = e.target.value;
                manageAmount('B');
              }
            "
            placeholder="0.0"
            class="w-100 p-2 rounded-15 fw-bold"
          />
          <div class="text-end pt-1" v-if="CurrentAccount && balanceB >= 0">
            <span
              class="cp border border-info p-1 pt-0 rounded-3 text-info"
              @click="
                () => {
                  amountB = balanceB;
                  manageAmount('B');
                }
              "
              >max</span
            >
          </div>
        </div>
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
                  tokenB = token.address;
                  balanceB = allBalances[token.symbol];
                  showSelectB = false;
                  manageAmount('B');

                  if (tokenA == token.address) {
                    (indexA = ''), (tokenA = ''), (balanceA = '');
                  }
                }
              "
            >
              <span class="fw-bold"
                ><img
                  :src="token.img"
                  alt=""
                  class="me-1"
                  style="width: 30px"
                />
                {{ token.symbol }}</span
              >
              <span>{{ allBalances[token.symbol] }}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- ........................................... -->
      <div class="p-3 px-4">
        <div v-if="price0" class="">
          <div class="bg-dark rounded-15 bg-dark border border-secondary">
            <div class="p-3">Prices and pool share</div>
            <div
              class="d-flex fs-14p py-3 m-0 w-100 border-top border-secondary rounded-15 text-center"
            >
              <div class="col-6 border-end border-secondary">
                <span class="">{{ price0 }}</span> <br />
                {{ tokens[indexB].symbol }} per {{ tokens[indexA].symbol }}
                <br />
              </div>
              <div class="col-6">
                <span class="">{{ price1 }}</span> <br />
                {{ tokens[indexA].symbol }} per {{ tokens[indexB].symbol }}
                <br />
              </div>
            </div>
          </div>
        </div>
        <div v-if="CurrentAccount" class="mt-2">
          <div
            v-if="!tokenA || !tokenB || !checkPair()"
            class="bg_secondary rounded-15 fw-bold w-100 p-2 text-center text-dark"
          >
            Invalid pair
          </div>

          <div
            v-if="
              tokenA && tokenB && checkPair() && (amountA == 0 || amountB == 0)
            "
            class="bg_secondary rounded-15 fw-bold w-100 p-2 text-center text-dark"
          >
            Enter an amount
          </div>
          <div
            v-if="
              tokenA &&
              tokenB &&
              amountA &&
              amountB &&
              (ExactAamountA <= 0 || ExactAamountB <= 0)
            "
            class="bg-danger rounded-15 fw-bold w-100 p-2 text-center text-dark"
          >
            The Amount is too low
          </div>
          <div
            v-if="
              tokenA &&
              tokenB &&
              ExactAamountA > 0 &&
              ExactAamountB > 0 &&
              (ExactAamountA > balanceA || ExactAamountB > balanceB)
            "
            class="bg_secondary rounded-15 fw-bold w-100 p-2 text-center text-dark"
          >
            {{
              ExactAamountB > balanceB
                ? `Insufficient ${tokens[indexB].symbol} balance`
                : ExactAamountA > balanceA
                ? `Insufficient ${tokens[indexA].symbol} balance`
                : ""
            }}
          </div>
          <div
            class="d-flex"
            v-if="
              tokenA &&
              tokenB &&
              ExactAamountA > 0 &&
              ExactAamountB > 0 &&
              ExactAamountA <= balanceA &&
              ExactAamountB <= balanceB &&
              (!TokensApproveA || !TokensApproveB)
            "
          >
            <div
              v-if="!TokensApproveA && tokenA !== 'ETHER'"
              class="btn rounded-15 fw-bold w-100 p-2 m-1 text-dark"
              @click="
                () => {
                  const _decimals = tokens[indexA].decimals;
                  Approve(tokenA, _decimals, ExactAamountA, 'TokensApproveA');
                }
              "
              :class="
                !TokensApproveA && !lodingApproveA ? 'bg-qu ' : 'bg-secondary'
              "
            >
              <span v-if="!lodingApproveA">
                Approve
                {{ tokens[indexA].symbol }}
              </span>
              <div v-if="lodingApproveA" class="loader">
                <span> Approving {{ tokens[indexA].symbol }}</span>
              </div>
            </div>
            <!-- tokens[indexB].symbol !== 'ETH' || -->
            <div
              v-if="tokenB !== 'ETHER' && !TokensApproveB"
              class="btn rounded-15 fw-bold w-100 p-2 m-1 text-dark"
              @click="
                () => {
                  const _decimals = tokens[indexB].decimals;
                  Approve(tokenB, _decimals, ExactAamountB, 'TokensApproveB');
                }
              "
              :class="
                !TokensApproveB && !lodingApproveB ? 'bg-qu ' : 'bg-secondary'
              "
            >
              <span v-if="!lodingApproveB">
                Approve
                {{ tokens[indexB].symbol }}
              </span>

              <div v-if="lodingApproveB" class="loader">
                <span> Approving {{ tokens[indexB].symbol }}</span>
              </div>
            </div>
          </div>
          <div
            v-if="
              tokenA &&
              tokenB &&
              ExactAamountA > 0 &&
              ExactAamountB > 0 &&
              ExactAamountA <= balanceA &&
              ExactAamountB <= balanceB &&
              TokensApproveA &&
              TokensApproveB
            "
            class="btn rounded-15 fw-bold w-100 p-2"
            :class="TokensApproveA && TokensApproveB ? 'bg-qu' : 'bg-secondary'"
            @click="
              () => {
                if (TokensApproveA && TokensApproveB) {
                  confirm();
                }
              }
            "
          >
            Confirm Supply
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
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import kovan from "~/json/kovan.json";
import Plugens from "~/plugins/index";
import handelChain from "~/plugins/handelChain";
import AllBlances from "~/plugins/getAllBalances";
import FetchAmaounts from "~/plugins/FetchAmounts";
import LiquidityPosition from "~/components/LiquidityPosition.vue";
import big from "big.js";
export default {
  components: { LiquidityPosition },
  data() {
    return {
      tokens: kovan,
      showSelectA: false,
      showSelectB: false,
      showPrice0: true,
      showPrice1: false,
      indexA: "",
      indexB: "",
      tokenA: "",
      tokenB: "",
      amountA: "",
      amountB: "",
      price0: "",
      price1: "",
      ExactAamountA: 0,
      ExactAamountB: 0,
      balanceA: "",
      balanceB: "",
      allBalances: {},
      chainId: 42,
      lodingApproveA: false,
      lodingApproveB: false,
      TokensApproveA: false,
      TokensApproveB: false,
      confirmaition: false,
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
    checkPair() {
      if (
        (this.tokenA == "ETHER" &&
          (this.tokens[this.indexB].symbol == "WBNB" ||
            this.tokens[this.indexB].symbol == "WETH")) ||
        (this.tokenB == "ETHER" &&
          (this.tokens[this.indexA].symbol == "WBNB" ||
            this.tokens[this.indexA].symbol == "WETH"))
      ) {
        return false;
      } else {
        return true;
      }
    },

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

    async manageAmount(input) {
      if (this.checkPair()) {
        if (
          this.tokenA &&
          this.tokenB &&
          (this.amountA > 0 || this.amountB > 0)
        ) {
          if (input === "A") {
            this.amountA >= 0 && this.amountA != ""
              ? await this.manageAmountB()
              : await this.manageAmountA();
          }
          if (input === "B") {
            this.amountB >= 0 && this.amountB !== ""
              ? await this.manageAmountA()
              : await this.manageAmountB();
          }
        }
      } else {
        this.amountA = "";
        this.amountB = "";
        this.ExactAamountA = "";
        this.ExactAamountB = "";
      }
    },
    async manageAmountB() {
      try {
        const amounts = await FetchAmaounts.getamounts(
          this.tokenA,
          this.tokenB,
          this.chainId
        );

        this.amountB = big(amounts.amount0).times(this.amountA).toFixed();
        this.price0 = amounts.amount0;
        this.price1 = amounts.amount1;
        this.ExactAamountA = Number(
          Number(this.amountA).toFixed(this.tokens[this.indexA].decimals)
        );
        this.ExactAamountB = Number(
          Number(this.amountB).toFixed(this.tokens[this.indexB].decimals)
        );
      } catch (error) {
        console.log(error);
        this.amountB = "";
      }
    },
    async manageAmountA() {
      try {
        this.TokensApproveA = false;
        this.TokensApproveB = false;
        const amounts = await FetchAmaounts.getamounts(
          this.tokenA,
          this.tokenB,
          this.chainId
        );
        this.amountA = big(amounts.amount1).times(this.amountB).toFixed(); //FourmatNumber.formatDicimals();
        this.price0 = amounts.amount0;
        this.price1 = amounts.amount1;
        this.ExactAamountA = Number(
          Number(this.amountA).toFixed(this.tokens[this.indexA].decimals)
        );
        this.ExactAamountB = Number(
          Number(this.amountB).toFixed(this.tokens[this.indexB].decimals)
        );
      } catch (error) {
        console.log(error);
        this.amountA = "";
      }
    },
    async Approve(Address, _decimals, amount, TokensApprove) {
      let spender;
      if (this.chainId == 1 || this.chainId == 3 || this.chainId == 42) {
        spender = "0x7a250d5630b4cf539739df2c5dacb4c659f2488d";
      } else if (this.chainId == 56) {
        spender = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
      } else if (this.chainId == 97) {
        spender = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3";
      }

      try {
        if (this.tokenA == "ETHER") {
          this.TokensApproveA = true;
          //  this.TokensApproveB = true;
        }
        if (this.tokenB == "ETHER") {
          this.TokensApproveB = true;
        }
        if (TokensApprove == "TokensApproveA") {
          this.lodingApproveA = true;
          // this.lodingApproveB = true;
        } else {
          this.lodingApproveB = true;
        }
        // console.log(Math.floor(Date.now() / 1000) + 60 * 2)
        await Plugens.approveTokens(
          Address,
          amount,
          this.CurrentAccount,
          spender,
          _decimals
        ).then(() => {
          if (TokensApprove == "TokensApproveA") {
            this.TokensApproveA = true;
            this.lodingApproveA = false;
          } else {
            this.TokensApproveB = true;
            this.lodingApproveB = false;
          }
        });
      } catch (error) {
        console.log(error);
        if (TokensApprove == "TokensApproveA") {
          this.TokensApproveA = false;
          this.lodingApproveA = false;
        } else {
          this.TokensApproveB = false;
          this.lodingApproveB = false;
        }
      }
    },
    async confirm() {
      this.confirmaition = true;
      const _decimals0 = this.tokens[this.indexA].decimals;
      const _decimals1 = this.tokens[this.indexB].decimals;
      await Plugens.confirmLiquidity(
        this.tokenA,
        this.tokenB,
        this.ExactAamountA,
        this.ExactAamountB,
        _decimals0,
        _decimals1,
        this.CurrentAccount,
        this.chainId
      ).then(() => {
        this.tokenA = "";
        this.tokenB = "";
        this.amountA = "";
        this.amountB = "";
        this.confirmaition = false;
        this.TokensApproveA = false;
        this.TokensApproveB = false;
      });
    },
  },
};
</script>
