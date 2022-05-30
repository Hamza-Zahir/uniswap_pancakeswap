<template>
  <div class="pt-5">
    <div v-if="yourLiquidity">
      <div class="yourLiquidity rounded-15 mx-auto mt-5">
        <div class="p-3 px-4">
          <h4>Your Liquidity</h4>
          <span>Remove liquidity to receive tokens back</span>
        </div>
        <div class="bg-dark text-center p-3 px-4">
          No liquidity found. <br /><br />
          Don't see a pool you joined?<br />
        </div>
        <div class="p-3 px-4">
          <div
            class="btn bg-qu rounded-15 fw-bold w-100 p-2"
            @click="
              () => {
                addLiquidity = true;
                yourLiquidity = false;
              }
            "
          >
            + Add Liquidity
          </div>
        </div>
      </div>
    </div>

    <!-- ............................. add liquidity box ................................. -->
    <div v-if="addLiquidity">
      <div class="addLiquidity rounded-15 mx-auto mt-5">
        <div class="p-3 px-4 d-flex">
          <span
            @click="
              () => {
                addLiquidity = false;
                yourLiquidity = true;
              }
            "
          >
            <b-icon icon="arrow-left" class="h2 fw-bold p-0 m-0 cp"></b-icon>
          </span>
          <div class="ms-3">
            <h4>Add Liquidity</h4>

            <span>
              <b-icon icon="question-circle" class="me-1"></b-icon>

              Add liquidity to receive LP tokens</span
            >
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
              class="w-100 p-2 rounded-15 fw-bold text-end"
              @input="
                (e) => {
                  amountA = e.target.value;
                  manageAmountB(tokenA, tokenB, amountA);
                }
              "
            />
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
                    balanceA = allBalances[i];

                    manageAmountB(tokenA, tokenB, amountA);

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
                <span>{{ allBalances[i] }}</span>
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
                  manageAmountA(tokenA, tokenB, amountB);
                }
              "
              placeholder="0.0"
              class="w-100 p-2 rounded-15 fw-bold text-end"
            />
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
                    balanceB = allBalances[i];
                    showSelectB = false;

                    manageAmountA(tokenA, tokenB, amountB);

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
                <span>{{ allBalances[i] }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- ........................................... -->
        <div class="p-3 px-4">
          <div v-if="CurrentAccount">
            <div
              v-if="!tokenA || !tokenB"
              class="bg_secondary rounded-15 fw-bold w-100 p-2 text-center text-dark"
            >
              Invalid pair
            </div>

            <div
              v-if="tokenA && tokenB && (amountA == 0 || amountB == 0)"
              class="bg_secondary rounded-15 fw-bold w-100 p-2 text-center text-dark"
            >
              Enter an amount
            </div>

            <div
              v-if="
                tokenA &&
                tokenB &&
                amountA > 0 &&
                amountB > 0 &&
                (amountA > balanceA || amountB > balanceB)
              "
              class="bg_secondary rounded-15 fw-bold w-100 p-2 text-center text-dark"
            >
              {{
                amountB > balanceB
                  ? `Insufficient ${tokens[indexB].symbol} balance`
                  : amountA > balanceA
                  ? `Insufficient ${tokens[indexA].symbol} balance`
                  : ""
              }}
            </div>
            <div
              v-if="
                tokenA &&
                tokenB &&
                amountA > 0 &&
                amountB > 0 &&
                amountA <= balanceA &&
                amountB <= balanceB
              "
              class="btn bg-qu rounded-15 fw-bold w-100 p-2"
              @click="&quot;&quot;;"
            >
              Confirm
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
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import tokens from "~/json/mainnet1.json";
import Web3 from "web3";
import ERC20ABI from "~/json/ERC20ABI.json";
import {
  ChainId,
  Fetcher,
  WETH,
  Route,
  Trade,
  TokenAmount,
  TradeType,
} from "@uniswap/sdk";
export default {
  data() {
    return {
      tokens,
      addLiquidity: false,
      yourLiquidity: true,
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
      allBalances: [],
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

    async getAllBalances() {
      await this.checkWalletIsConnected();
      if (this.metamaskConectedS) {
        const ethereum = window.ethereum;
        const web3 = new Web3(Web3.givenProvider || ethereum);
        const defaultAccount = web3.eth.defaultAccount;
        tokens.map(async (e) => {
          const contract = new web3.eth.Contract(ERC20ABI, e.address, {
            from: defaultAccount,
          });

          await contract?.methods
            .balanceOf(this.CurrentAccount)
            .call()
            .then((value) => {
              this.allBalances.push(value / 10 ** e.decimals);
            })
            .catch((error) => {
              console.log(error);
            });
        });
      }
    },

    async FetchTokenData(address0, address1) {

      const chainId = ChainId.MAINNET;


      const token0 = await Fetcher.fetchTokenData(chainId, address0);
      const token1 = await Fetcher.fetchTokenData(chainId, address1);

      const pair = await Fetcher.fetchPairData(token0, token1);

      const route = new Route([pair], token0);
      const amount0 = route.midPrice.toSignificant(6);
      const amount1 = route.midPrice.invert().toSignificant(6);

      console.log(amount0);
      console.log(amount1);

      return { amount0, amount1 };
    },

    async manageAmountB(token0, token1, value) {
      if (token0 && token1 && value) {
        try {
          const amount = await this.FetchTokenData(token0, token1);
          this.amountB = amount.amount0 * value;
        } catch (error) {
          console.log(error);
          this.amountB = 0;
        }
      }
    },
    async manageAmountA(token0, token1, value) {
      if (token0 && token1 && value) {
        try {
          const amount = await this.FetchTokenData(token0, token1);
          this.amountA = amount.amount1 * value;
        } catch (error) {
          console.log(error);
          this.amountA = 0;
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped></style>
