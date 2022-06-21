import Web3 from "web3";
import ERC20ABI from "~/json/ERC20ABI.json";
import big from "big.js";
export default {
  async GetAllBlances(tokens, CurrentAccount) {
    let allBalances = {};
    if (CurrentAccount) {
      const ethereum = window.ethereum;
      const web3 = new Web3(Web3.givenProvider || ethereum);
      const defaultAccount = web3.eth.defaultAccount;
      tokens.map(async (e) => {
        if (e.address === "ETHER") {
          await web3.eth.getBalance(CurrentAccount).then((value) => {
            const key = e.symbol;
            allBalances[key] = big(value)
              .div(10 ** e.decimals)
              .toFixed();
          });
        } else {
          const contract = new web3.eth.Contract(ERC20ABI, e.address, {
            from: defaultAccount,
          });

          await contract?.methods
            .balanceOf(CurrentAccount)
            .call()
            .then((value) => {
              const key = e.symbol;
              allBalances[key] = big(value)
                .div(10 ** e.decimals)
                .toFixed();
            })
            .catch((error) => {
              console.log(error);
              const key = e.symbol;
              allBalances[key] = "";
            });
        }
      });
    }

    return allBalances;
  },
};
