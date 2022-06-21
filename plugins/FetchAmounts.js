import { ethers } from "ethers";
export default {
  async getamounts(address0, address1, chainId) {
    let token0;
    let token1;
    let Module;

    if (chainId == 1 || chainId == 3 || chainId == 42) {
      Module = require("@uniswap/sdk");
    } else if (chainId == 56 || chainId == 97) {
      Module = require("@pancakeswap/sdk");
    }

    const { Fetcher, WETH, Route } = Module;
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    if (address0 === "ETHER") {
      token0 = WETH[chainId];
    } else {
      token0 = await Fetcher.fetchTokenData(chainId, address0, provider);
    }
    if (address1 === "ETHER") {
      token1 = WETH[chainId];
    } else {
      token1 = await Fetcher.fetchTokenData(chainId, address1, provider);
    }

    const pair = await Fetcher.fetchPairData(token0, token1, provider);

    const route = new Route([pair], token0);

    const amount0 = route.midPrice.toSignificant(6);
    const amount1 = route.midPrice.invert().toSignificant(6);

    return { amount0, amount1 };
  },
};
