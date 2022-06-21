import Web3 from "web3";
import big from "big.js";
import WETH_ABI from "~/json/WETH_ABI.json";
export default {
  async SwapExactTokensForTokens(
    amountIn,
    amountOutMin,
    path,
    CurrentAccount,
    _decimals0,
    _decimals1,
    _chainId
  ) {
    try {
      const ethereum = window.ethereum;
      const web3 = new Web3(Web3.givenProvider || ethereum);
      const _amountIn = big(amountIn)
        .times(10 ** _decimals0)
        .toString();
      const _amountOutMin = big(amountOutMin)
        .times(10 ** _decimals1)
        .toString();

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
      await Router02Contract.methods
        .swapExactTokensForTokens(
          _amountIn,
          _amountOutMin,
          path,
          CurrentAccount,
          Math.floor(Date.now() / 1000) + 60 * 1
        )
        .send({
          from: CurrentAccount,
        }); //gasLimit: utils.hexlify(1000000),
    } catch (error) {
      console.log(error);
    }
  },
  // .......................................................
  async swapETHForTokens(
    amountIn,
    amountOutMin,
    CurrentAccount,
    address1,
    _decimals1,
    _chainId
  ) {
    try {
      const ethereum = window.ethereum;
      const web3 = new Web3(Web3.givenProvider || ethereum);

      const _amountIn = web3.utils.toWei(amountIn.toString());
      const _amountOutMin = big(amountOutMin)
        .times(10 ** _decimals1)
        .toString();

      let Router_Contract;
      let Module;
      if (_chainId == 1 || _chainId == 3 || _chainId == 42) {
        Router_Contract = require("~/json/UniswapRouter02Contract.json");
        Module = require("@uniswap/sdk");
      } else if (_chainId == 56) {
        Router_Contract = require("~/json/pancakeswap/mainnet/pancackswapRouter02Contract.json");
        Module = require("@pancakeswap/sdk");
      } else if (_chainId == 97) {
        Router_Contract = require("~/json/pancakeswap/testnet/pancackswapRouter02Contract.json");
        Module = require("@pancakeswap/sdk");
      }
      const Router02Contract = new web3.eth.Contract(
        Router_Contract.abi,
        Router_Contract.address
      );
      const { WETH } = Module;
      if (WETH[_chainId].address !== address1) {
        const _path = [WETH[_chainId].address, address1];
        await Router02Contract.methods
          .swapExactETHForTokens(
            _amountOutMin,
            _path,
            CurrentAccount,
            Math.floor(Date.now() / 1000) + 60 * 2
          )
          .send({
            from: CurrentAccount,
            value: _amountIn,
          });
      } else {
        const tokenContract = new web3.eth.Contract(WETH_ABI, address1, {
          from: CurrentAccount,
        });
        await tokenContract.methods.deposit().send({
          from: CurrentAccount,
          value: _amountIn,
        });
      }
    } catch (error) {
      console.log(error);
    }
  },

  // .........................
  async SwapExactTokensForETH(
    amountIn,
    amountOutMin,
    CurrentAccount,
    address0,
    _decimals0,
    _decimals1,
    _chainId
  ) {
    try {
      const ethereum = window.ethereum;
      const web3 = new Web3(Web3.givenProvider || ethereum);
      let Router_Contract;
      let Module;
      if (_chainId == 1 || _chainId == 3 || _chainId == 42) {
        Router_Contract = require("~/json/UniswapRouter02Contract.json");
        Module = require("@uniswap/sdk");
      } else if (_chainId == 56) {
        Router_Contract = require("~/json/pancakeswap/mainnet/pancackswapRouter02Contract.json");
        Module = require("@pancakeswap/sdk");
      } else if (_chainId == 97) {
        Router_Contract = require("~/json/pancakeswap/testnet/pancackswapRouter02Contract.json");
        Module = require("@pancakeswap/sdk");
      }
      const Router02Contract = new web3.eth.Contract(
        Router_Contract.abi,
        Router_Contract.address
      );
      const { WETH } = Module;
      const _amountIn = big(amountIn)
        .times(10 ** _decimals0)
        .toString();
      const _amountOutMin = big(amountOutMin)
        .times(10 ** _decimals1)
        .toString();
      if (WETH[_chainId].address !== address0) {
        const _path = [address0, WETH[_chainId].address];
        await Router02Contract.methods
          .swapExactTokensForETH(
            _amountIn,
            _amountOutMin,
            _path,
            CurrentAccount,
            Math.floor(Date.now() / 1000) + 60 * 1
          )
          .send({
            from: CurrentAccount,
          });
      } else {
        const tokenContract = new web3.eth.Contract(WETH_ABI, address0, {
          from: CurrentAccount,
        });
        await tokenContract.methods.withdraw(_amountIn).send({
          from: CurrentAccount,
        }); //gasLimit: utils.hexlify(120000),
      }
    } catch (error) {
      console.log(error);
    }
  },
};
