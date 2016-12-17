function createArr () {
  var arr = [];
  for (var i=1; i<101; i++) {
    arr.push(i)
  };
  return arr;
}

function missingNum (arr) {
  var defSum = 0;
  for (var i=1; i<101; i++) {
    defSum += i;
  };
  var arrSum = 0;
  for (var i=0; i<arr.length; i++) {
    arrSum += arr[i];
  };
  return defSum - arrSum;
}

function dupNum (arr) {
  var defSum = 0;
  var arrSum = 0;
  for (var i=0; i<arr.length; i++){
    arrSum += arr[i]
  };
  for (var i=0; i<arr.length-1; i++){
    defSum += i
  };
  return arrSum - defSum;
}

function numConfirm (arr, n) {
  if (arr.indexOf(n) === -1) {
    return false
  } else {
    return true
  }
}

function largeSmall (arr) {
  var large = arr[0];
  var small = arr[0];

  for (var i=0; i<arr.length; i++){
    if (arr[i]>large) {
      large = arr[i]
    };
    if (arr[i]<small){
      small = arr[i]
    };
  };

  return {large: large, small: small}
}

function dupFinder (arr) {
  var duplicates = [];
  for (var i=0; i<arr.length; i++) {
    if (duplicates.indexOf(arr[i])===-1) {
      var firstInd = arr.indexOf(arr[i]);
      var secInd = arr.lastIndexOf(arr[i]);
      if (firstInd !== secInd) {
        duplicates.push(arr[i])
      };
    };
  };
  return duplicates
}

function removeDups (arr) {
  var clean = [];
  for (var i=0; i<arr.length; i++) {
    if (clean.indexOf(arr[i]) === -1) {
      clean.push(arr[i])
    };
  };
  return clean
}

function findSingle (arr) {
  for (var i=0; i<arr.length; i++) {
    if (arr.lastIndexOf(arr[i]) !== i) {
      return arr[i]
    };
  };
}

[ 1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  40,
  41,
  42,
  43,
  44,
  45,
  46,
  47,
  48,
  49,
  50,
  51,
  52,
  53,
  54,
  55,
  56,
  57,
  58,
  59,
  60,
  61,
  62,
  63,
  64,
  65,
  66,
  67,
  68,
  69,
  70,
  71,
  72,
  73,
  74,
  75,
  76,
  77,
  78,
  79,
  80,
  81,
  82,
  83,
  85,
  86,
  87,
  88,
  89,
  90,
  91,
  92,
  93,
  94,
  95,
  96,
  97,
  98,
  99,
  100 ]
