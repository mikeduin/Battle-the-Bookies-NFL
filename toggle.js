function garland (string) {
  var degree = 0;
  for (var i=0; i<string.length; i++) {
    if (string.substring(0, i+1) === string.substring(string.length-(i+1), string.length)) {
      degree === i
    }
  };
  return degree;
}
