import big from "big.js";
import { utils } from "ethers";
import Web3 from "web3";
import ERC20ABI from "~/json/ERC20ABI.json";
// import UniswapRouter02Contract from "~/json/UniswapRouter02Contract.json";

export default {
  formatDicimals(num) {
    const bigNum = new big(num);
    let _numFormat;
    if (bigNum.e >= 0) {
      _numFormat = big(bigNum.toPrecision())
        .minus(10 ** -7 * 5)
        .toFixed(6);
    }
    if (bigNum.e < 0) {
      _numFormat = big(bigNum.toPrecision())
        .minus(10 ** (bigNum.e - 6) * 6)
        .toFixed(-bigNum.e + 5);
    }

    return _numFormat > 0 ? _numFormat : 0;
  },

  async approveTokens(
    tokenAddress,
    amountADesired,
    CurrentAccount,
    spender,
    _decimals
  ) {
    try {
      const ethereum = window.ethereum;
      const web3 = new Web3(Web3.givenProvider || ethereum);
      const amountApproved = big(amountADesired)
        .times(10 ** _decimals)
        .toFixed();

      const tokebContract = new web3.eth.Contract(ERC20ABI, tokenAddress, {
        from: CurrentAccount,
      });

      await tokebContract.methods
        .approve(spender, amountApproved)
        .send({ from: CurrentAccount, gasLimit: utils.hexlify(120000) });
    } catch (error) {
      console.log(error);
    }
  },
  async confirmLiquidity(
    tokenA,
    tokenB,
    amountA,
    amountB,
    _decimals0,
    _decimals1,
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

      const amA = big(amountA)
        .times(10 ** _decimals0)
        .toString();
      const amB = big(amountB)
        .times(10 ** _decimals1)
        .toString();

      if (tokenA !== "ETHER" && tokenB !== "ETHER") {
        await Router02Contract.methods
          .addLiquidity(
            tokenA,
            tokenB,
            amA,
            amB,
            1,
            1,
            CurrentAccount,
            Math.floor(Date.now() / 1000) + 60 * 1
          )
          .send({ from: CurrentAccount });
      } else if (tokenA == "ETHER") {
        await Router02Contract.methods
          .addLiquidityETH(
            tokenB,
            amB,
            0,
            0,
            CurrentAccount,
            Math.floor(Date.now() / 1000) + 60 * 1
          )
          .send({ from: CurrentAccount, value: amA });
      } else if (tokenB == "ETHER") {
        await Router02Contract.methods
          .addLiquidityETH(
            tokenA,
            amA,
            0,
            0,
            CurrentAccount,
            Math.floor(Date.now() / 1000) + 60 * 1
          )
          .send({ from: CurrentAccount, value: amB });
      }
    } catch (error) {
      console.log(error);
    }
  },
};
