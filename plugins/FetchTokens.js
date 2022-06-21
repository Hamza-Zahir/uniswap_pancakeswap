import ERC20ABI from "~/json/ERC20ABI.json";

export default {
  async getToken(address, web3, defaultAccount) {

    const TokenContract = new web3.eth.Contract(ERC20ABI, address, {
      from: defaultAccount,
    });

    const symbol = await TokenContract.methods
    .symbol()
    .call();
    const decimals = await TokenContract.methods
    .decimals()
    .call();
    return {symbol, decimals,address}
  },
};
