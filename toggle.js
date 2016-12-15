function sumDigits (num) {
  var str = num.toString();
  var sum = 0;

  if (str.length === 1) {
    return num
  };

  for (var i=0; i<str.length; i++) {
    sum += parseInt(str[i]);
  };

  var sumString = sum.toString();
  
  if (sumString.length === 1) {
    return sum
  } else {
    sumDigits (sum)
  };
}
