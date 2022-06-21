import Web3 from "web3";
import FetchToken from "~/plugins/FetchTokens";
import big from "big.js";
import FourmatNumber from "./index";
export default {
  async fetchPairs(CurrentAccount, tokens, _chainId) {
    try {
      let liquiditysOfUser = [];
      let Factory;
      let Pair_abi;
      if (_chainId == 1 || _chainId == 3 || _chainId == 42) {
        Factory = require("../json/uniswap/uniswapFactory.json");
        Pair_abi = require("~/json/uniswap/pairs_ABI.json");
      } else if (_chainId == 56) {
        Factory = require("../json/pancakeswap/mainnet/pancakeswapFactory.json");
        Pair_abi = require("../json/pancakeswap/mainnet/pairs_ABI_pancakeswap.json");
      } else if (_chainId == 97) {
        Factory = require("../json/pancakeswap/testnet/pancakeswapFactory.json");
        Pair_abi = require("../json/pancakeswap/testnet/pairs_ABI_pancakeswap.json");
      }
      if (CurrentAccount) {
        const ethereum = window.ethereum;
        const web3 = new Web3(Web3.givenProvider || ethereum);
        const defaultAccount = web3.eth.defaultAccount;

        const FactoryContract = new web3.eth.Contract(
          Factory.abi,
          Factory.address
        );
        for (let i = 1; i < tokens.length - 1; i++) {
          for (let j = i + 1; j < tokens.length; j++) {
            const _pairAdreess = await FactoryContract.methods
              .getPair(tokens[i].address, tokens[j].address)
              .call();

            if (_pairAdreess != "0x0000000000000000000000000000000000000000") {
              const PairContract = new web3.eth.Contract(
                Pair_abi,
                _pairAdreess
              );

              const _balanc = await PairContract.methods
                .balanceOf(CurrentAccount)
                .call();

              if (_balanc > 0) {
                const _decimalsPoll = await PairContract.methods
                  .decimals()
                  .call();
                const _resevers = await PairContract.methods
                  .getReserves()
                  .call();
                let _reserve0 = _resevers._reserve0;
                let _reserve1 = _resevers._reserve1;
                let _totalSupply = await PairContract.methods
                  .totalSupply()
                  .call();
                const _balansOfUser = big(_balanc)
                  .div(10 ** _decimalsPoll)
                  .toFixed();
                const _halfSupplay = big(_totalSupply).div(2).toString();
                const _price0 = big(_halfSupplay).div(_reserve0).toString();
                const _price1 = big(_halfSupplay).div(_reserve1).toFixed();

                const _poolShare = big(_balanc / (_totalSupply / 100));

                const address0 = await PairContract.methods.token0().call();
                const address1 = await PairContract.methods.token1().call();
                const _token0 = await FetchToken.getToken(
                  address0,
                  web3,
                  defaultAccount
                );
                const _token1 = await FetchToken.getToken(
                  address1,
                  web3,
                  defaultAccount
                );
                const _amount0 = big(_balanc)
                  .div(2)
                  .div(_price0)
                  .div(10 ** _token0.decimals);

                const _amount1 = big(_balanc)
                  .div(2)
                  .div(_price1)
                  .div(10 ** _token1.decimals);

                liquiditysOfUser.push({
                  totalPoolToken: _balansOfUser,
                  token0: _token0,
                  token1: _token1,
                  pairAdreess: _pairAdreess,
                  amount0: FourmatNumber.formatDicimals(_amount0),
                  amount1: FourmatNumber.formatDicimals(_amount1),
                  poolShare: _poolShare,
                  chainId :_chainId
                });
              }
            }
          }
        }
        return liquiditysOfUser;
      }
    } catch (error) {
      console.log(error);
    }
  },
};
