import Web3 from "web3";

const state = {
  CurrentAccount: "",
  metamaskConectedS: false,
  positions: [],
  positionsRemmoved: {}
};

const getters = {
  CurrentAccount: (state) => state.CurrentAccount,
  metamaskConectedS: (state) => state.metamaskConectedS,
  positions: (state) => state.positions,
  positionsRemmoved: (state) => state.positionsRemmoved,
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
          params: [{ chainId: `0x${Number(42).toString(16)}` }],
        }).then(()=>{
          window.location.reload();

          });
      } catch (switchError) {
        console.log(switchError);
        if (switchError.code === 4902) {
          try {
            await ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: `0x${Number(42).toString(16)}`,
                  chainName: "Kovan",
                  nativeCurrency: {
                    name: "Kovan Ether",
                    symbol: "KOV",
                    decimals: 18,
                  },
                  rpcUrls: [
                    "https://kovan.poa.network",
                    "http://kovan.poa.network:8545",
                    "https://kovan.infura.io/v3/${INFURA_API_KEY}",
                    "wss://kovan.infura.io/ws/v3/${INFURA_API_KEY}",
                    "ws://kovan.poa.network:8546",
                  ],
                  blockExplorerUrls: ["https://kovan.etherscan.io"],
                },
              ],
            }).then(()=>{
            window.location.reload();

            })

            // let web3 = new Web3(Web3.givenProvider || ethereum);
            // web3.eth.defaultAccount = accounts[0];
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
  setPositions: (state, araay) => (state.positions = araay),
  setPositionsRemmoved: (state, object) => (state.positionsRemmoved = object),

};

export default {
  state,
  getters,
  actions,
  mutations,
};
