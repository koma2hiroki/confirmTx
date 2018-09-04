const utils = require('web3-utils');
const Bn = require('bn.js');
const RLP = require('rlp');
const assert = require('assert');

function toHex(_) {
  if (_.indexOf('0x') === 0) {
    _ = _.slice(2);
  }
  return '0x' + (new Bn(_)).toString(16);
}

function equal(actual, expected, target) {
  if (!expected[target]) {
    return;
  }
  let et = expected[target];
  if (et.indexOf('0x0') === 0) {
    et = '0x' + et.slice(3);
  }
  if (et === '0x') {
    et = '0x0';
  }
  // console.log(actual[target], et, et.length);
  assert.equal(actual[target], et, `not equal (${target})<br><br>
    - signed tx<br>
    ${expected[target]}<br>
    - raw tx<br>
    ${actual[target]}
  `);
}

module.exports = {
  decodeTx: function(rawtx) {
    try {
      const decodedTx = RLP.decode(rawtx);

      const [raw_nonce,
        raw_gasPrice,
        raw_gasLimit,
        raw_to,
        raw_value,
        raw_data,
        raw_v,
        raw_r,
        raw_s] = decodedTx;

      return {
        nonce: toHex(raw_nonce),
        gasPrice: toHex(raw_gasPrice),
        gasLimit: toHex(raw_gasLimit),
        to: utils.toChecksumAddress(raw_to.toString('hex')),
        value: toHex(raw_value),
        data: toHex(raw_data),
        v: toHex(raw_v),
        r: toHex(raw_r),
        s: toHex(raw_s)
      }
    } catch (e) {
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
