function sumDigPow(a, b) {
  var cases = [];

  for (i=a; i<b+1; i++) {
     var numString = i.toString();

     if (numString.length === 1) {
       cases.push(parseInt(numString));
       console.log(cases)
     } else {
       var numSum = 0;

       for (j=0; j<numString.length; j++) {
         var numVar = parseInt(numString[j]);
         numSum += Math.pow(numVar, j+1)
       };

       if (numSum === parseInt(numString)) {
         cases.push(parseInt(numString))
       }
     }
  }

  console.log(cases);
  return cases

}
