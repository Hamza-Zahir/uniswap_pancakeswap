import Web3 from "web3";
import FourmatNumber from "./index";
import { ethers } from "ethers";
import big from "big.js";
export default {
  async quote(_amountA, address0, address1, _chainId) {
    try {
      let token0;
      let token1;
      let Module;
      let Router_Contract;
      if (_chainId == 1 || _chainId == 3 || _chainId == 42) {
        Module = require("@uniswap/sdk");
        Router_Contract = require("~/json/UniswapRouter02Contract.json");
      } else if (_chainId == 56) {
        Module = require("@pancakeswap/sdk");
        Router_Contract = require("~/json/pancakeswap/mainnet/pancackswapRouter02Contract.json");
      }else if (_chainId == 97) {
        Module = require("@pancakeswap/sdk");
        Router_Contract = require("~/json/pancakeswap/testnet/pancackswapRouter02Contract.json");
      }
      const ethereum = window.ethereum;
      const web3 = new Web3(Web3.givenProvider || ethereum);
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const Router02Contract = new web3.eth.Contract(
        Router_Contract.abi,
        Router_Contract.address
      );
      const { WETH, Fetcher } = Module;
      if (address0 == "ETHER") {
        token0 = WETH[_chainId];
      } else {
        token0 = await Fetcher.fetchTokenData(_chainId, address0, provider);
      }
      if (address1 == "ETHER") {
        token1 = WETH[_chainId];
      } else {
        token1 = await Fetcher.fetchTokenData(_chainId, address1, provider);
      }

      const _amountIn = big(_amountA)
        .times(10 ** token0.decimals)
        .toFixed();

      let amountAout = 0;
      let MinimumReceived = "";
      let token0Price = "";
      let token1Price = "";
      let _AmountOut = 0;

      if (token0.address == token1.address) {
        _AmountOut = _amountIn;
      } else {
        const AmountsOut = await Router02Contract.methods
          .getAmountsOut(_amountIn, [token0.address, token1.address])
          .call();
        _AmountOut = AmountsOut[1];
      }

      if (_AmountOut > 0) {
        amountAout = big(_AmountOut)
          .div(10 ** token1.decimals)
          .toFixed();
        if (_chainId == 1 || _chainId == 56) {
          MinimumReceived = big(amountAout)
            .minus(big(amountAout).div(100).times(25))
            .toFixed(token1.decimals);
        } else {
          MinimumReceived = big(amountAout)
            .minus(big(amountAout).div(100).times(0.5))
            .toFixed(token1.decimals);
        }

        token0Price = FourmatNumber.formatDicimals(
          big(amountAout).div(_amountA).toFixed()
        )
        token1Price = FourmatNumber.formatDicimals(
          big(1).div(token0Price).toFixed()
        );
      }
      return { amountAout, MinimumReceived, token0Price, token1Price };
    } catch (error) {
      console.log(error);
    }
  },
};
