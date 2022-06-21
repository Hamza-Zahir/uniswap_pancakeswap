import { utils } from "ethers";
import Web3 from "web3";
// import UniswapRouter02Contract from "~/json/UniswapRouter02Contract.json";

export default {
  async RemoveLiquidity(
    addressA,
    addressB,
    liquidity,
    CurrentAccount,
    _chainId
  ) {
    try {
      const ethereum = window.ethereum;
      const web3 = new Web3(Web3.givenProvider || ethereum);

      let Router_Contract;

      if (_chainId == 1 || _chainId == 3 || _chainId == 42) {
        Router_Contract = require("~/json/UniswapRouter02Contract.json");
      } else if (_chainId == 56) {
        Router_Contract = require("~/json/pancakeswap/mainnet/pancackswapRouter02Contract.json");
      }else if (_chainId == 97) {
        Router_Contract = require("~/json/pancakeswap/testnet/pancackswapRouter02Contract.json");
      }

      const Router02Contract = new web3.eth.Contract(
        Router_Contract.abi,
        Router_Contract.address
      );
console.log(liquidity)
      await Router02Contract.methods
        .removeLiquidity(
          addressA,
          addressB,
          liquidity,
          0,
          0,
          CurrentAccount,
          Math.floor(Date.now() / 1000) + 60 * 2
        )
        .send({ from: CurrentAccount }); // gasLimit: utils.hexlify(186746)
    } catch (error) {
      console.log(error);
    }
  },
  async RemoveLiquidityETH(tokenAddress, liquidity, CurrentAccount, _chainId) {
    const ethereum = window.ethereum;
    const web3 = new Web3(Web3.givenProvider || ethereum);
    let Router_Contract;

    if (_chainId == 1 || _chainId == 3 || _chainId == 42) {
      Router_Contract = require("~/json/UniswapRouter02Contract.json");
    } else if (_chainId == 56) {
      Router_Contract = require("~/json/pancakeswap/mainnet/pancackswapRouter02Contract.json");
    } else if (_chainId == 97) {
      Router_Contract = require("~/json/pancakeswap/testnet/pancackswapRouter02Contract.json");
    }

    const Router02Contract = new web3.eth.Contract(
      Router_Contract.abi,
      Router_Contract.address
    );
    try {
      await Router02Contract.methods
        .removeLiquidityETH(
          tokenAddress,
          liquidity,
          0,
          0,
          CurrentAccount,
          Math.floor(Date.now() / 1000) + 60 * 1
        )

        .send({ from: CurrentAccount, gasLimit: utils.hexlify(186746) });
    } catch (error) {
      console.log(error);
    }
  },
};
