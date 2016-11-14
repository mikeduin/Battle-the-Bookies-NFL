function double(array) {
  result = [];
  for (var i=0; i<array.length; i++) {
    result.push(array[i]*2)
  }
  return result
}

function add(array){
  result = 0;
  for (var i=0; i<array.length; i++){
    result += array[i]
  };
  return result
}

document.getElementById('btn').on('click', function(e){
  
})
