angular
  .module('battleBookies')
  .filter('mlFormat', mlFormat)
  .filter('payoutFilter', payoutFilter)
  .filter('percentage', ['$filter', pctFilter])

function mlFormat () {
  return function (ml) {
    if (ml < 0) {
      return ml
    } else {
      return "+" + ml
    }
  }
}

function payoutFilter () {
  return function (line) {
    var payout;
    if (line < 0) {
      payout = "$"+((10000 / -line).toFixed(2))
    } else {
      payout = "$"+(line)
    };
    return payout
  }
}

function pctFilter ($filter) {
  return function (input, decimals) {
    return $filter('number')(input*100, decimals) + '%';
  }
}
