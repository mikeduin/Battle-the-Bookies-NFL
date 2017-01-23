var person = function (age, weight) {
  this.age = age;
  this.weight = weight;
  this.getInfo = function() {
    console.log("I am " + this.age + " years ols and I weight " + this.weight + " pounds and I get paid " + this.salary);
  };
}

employee.getInfo = function() {
  console.log("I am " + this.age + " years ols and I weight " + this.weight + " pounds and I get paid " + this.salary);
};
