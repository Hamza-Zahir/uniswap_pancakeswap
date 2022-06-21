import mainnet1 from "~/json/mainnet1.json";
import Ropsten from "~/json/Ropsten.json";
import kovan from "~/json/kovan.json";
import mainnet56 from "~/json/pancakeswap/mainnet/mainnet56.json";
import testnet97 from "~/json/pancakeswap/testnet/testnet97.json";

const networks = {
  1: mainnet1,
  3: Ropsten,
  42: kovan,
  56: mainnet56,
  97: testnet97,
};
export default {
  async HandelChain() {
    let tokens;
    let chainId;
    const ethereum = window.ethereum;
    await ethereum.request({ method: "eth_chainId" }).then((resalt) => {
      chainId = Number(resalt);
      tokens = networks[chainId];
    });
    ethereum.on("chainChanged", handleChainChanged);
    function handleChainChanged(_chainId) {
      window.location.reload();
    }
    return { tokens, chainId };
  },
};
