function parenChecker (str) {
  var left = 0;
  var right = 0;
  var verdict;
  for (var i=0; i<str.length; i++) {
    if (str[i] === '(') {
      left += 1
    };
    if (str[i] === ')') {
      right += 1
    };
    if (right > left) {
      return false
    };
  };
  if (left === right) {
    return true
  } else {
    return false
  };
}
