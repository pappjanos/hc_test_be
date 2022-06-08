
const amountTocoins = (amount, coins) => {
  if (amount === 0) {
    return [];
  }
  else {
    if (amount >= coins[0]) {
      left = (amount - coins[0]);
      return [coins[0]].concat(amountTocoins(left, coins));
    }
    else {
      coins.shift();
      return amountTocoins(amount, coins);
    }
  }
} 
module.exports = amountTocoins;