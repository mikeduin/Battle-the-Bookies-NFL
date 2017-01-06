var friends = {
  'Mark': true,
  'Amy': true,
  'Carl': false,
  'Ray': true,
  'Laura': false
};

var sortedAges = [22, 24, 27, 29, 31];

function thisOld (num, array) {
  var midpoint = Math.floor(array.length/2);
  console.log('midpoint is ', midpoint);

  if (num === array[midpoint]) {return true};

  if (num < array[midpoint]) {
    var sliced = array.slice(0, midpoint);
    console.log('sliced is ', sliced);
    thisOld(num, sliced);
  };

  if (num > array[midpoint]) {
    var sliced = array.slice(midpoint, array.length);
    console.log('sliced is ', sliced);
    thisOld(num, sliced);
  };
}
