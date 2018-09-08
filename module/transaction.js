const assert = require('assert');
const ethers = require('ethers');
const Wallet = ethers.Wallet;

function equal(actual, expected, target) {
  if (!expected[target]) {
    return;
  }
  assert.equal(actual[target], expected[target], `not equal (${target})<br><br>
    - signed tx<br>
    ${expected[target]}<br>
    - raw tx<br>
    ${actual[target]}
  `);
}

module.exports = {
  decodeTx: function(hashtx) {
    try {
      const tx = Wallet.parseTransaction(hashtx);
      tx.gasPrice = tx.gasPrice.toHexString();
      tx.gasLimit = tx.gasLimit.toHexString();
      tx.value = tx.value.toHexString();
      return tx;
    } catch (e) {
      console.log(e);
      return "decoded error";
    }
  },

  checkTx: function(rawtx, _expected) {
    const actual = this.decodeTx(rawtx);
    if (typeof actual === 'string') {
      return "Signed Tranaction decode error";
    }
    console.log("actual", actual);
    let expected;
    try {
      expected = JSON.parse(_expected);
      console.log("expected", expected);
    } catch (e) {
      return "Raw Tranaction parse error";
    }
    try {
      equal(actual, expected, "chainId");
      equal(actual, expected, "nonce");
      equal(actual, expected, "gasPrice");
      equal(actual, expected, "gasLimit");
      equal(actual, expected, "to");
      equal(actual, expected, "value");
      equal(actual, expected, "data");
      equal(actual, expected, "v");
      equal(actual, expected, "r");
      equal(actual, expected, "s");
    } catch (e) {
      return e.message;
    }

    return "success";
  }
}
