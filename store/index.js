import Web3 from "web3";

const state = {
  CurrentAccount: "",
  metamaskConectedS: false,
};

const getters = {
  CurrentAccount: (state) => state.CurrentAccount,
  metamaskConectedS: (state) => state.metamaskConectedS,
};
const actions = {
  async connectMetamask({ commit }) {
    const ethereum = window.ethereum;

    if (!ethereum) {
      window.open("https://metamask.io", "blank");
    } else {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      commit("setCurrentAccount", accounts[0]);
      commit("setMetamaskConected", true);

      try {
        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: `0x${Number(1).toString(16)}` }],
        });
      } catch (switchError) {
        console.log(switchError);
        if (switchError.code === 4902) {
          try {
            await ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: `0x${Number(1).toString(16)}`,
                  chainName: "Ethereum Mainnet",
                  nativeCurrency: {
                    name: "Ether",
                    symbol: "ETH",
                    decimals: 18,
                  },
                  rpcUrls: ["https://cloudflare-eth.com"],
                  blockExplorerUrls: ["https://etherscan.io"],
                },
              ],
            });

            // let web3 = new Web3(Web3.givenProvider || ethereum);
            // web3.eth.defaultAccount = accounts[0];
            // window.location.reload();
          } catch (error) {
            console.log(error);
          }
        }
      }
    }
  },

  async checkWalletIsConnected({ commit }) {
    const ethereum = window.ethereum;
    let web3 = new Web3(Web3.givenProvider || ethereum);
    let accounts = await web3.eth.getAccounts();
    if (accounts.length) {
      commit("setCurrentAccount", accounts[0]);
      commit("setMetamaskConected", true);
      web3.eth.defaultAccount = accounts[0];
    }
  },
};
const mutations = {
  setCurrentAccount: (state, addres) => (state.CurrentAccount = addres),
  setMetamaskConected: (state, bool) => (state.metamaskConectedS = bool),
};

export default {
  state,
  getters,
  actions,
  mutations,
};
