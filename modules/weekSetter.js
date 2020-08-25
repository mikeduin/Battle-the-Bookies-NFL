var moment = require('moment');

module.exports = {
  weekSetter: function (matchTime) {
    if (moment(matchTime).isBefore('2020-09-03')) {
      return "Preseason"
    } else if (moment(matchTime).isBetween('2020-09-03', '2020-09-16')) {
      return "Week 1"
    } else if (moment(matchTime).isBetween('2020-09-16', '2020-09-23')) {
      return "Week 2"
    } else if (moment(matchTime).isBetween('2020-09-23', '2020-09-30')) {
      return "Week 3"
    } else if (moment(matchTime).isBetween('2020-09-30', '2020-10-07')) {
      return "Week 4"
    } else if (moment(matchTime).isBetween('2020-10-07', '2020-10-14')) {
      return "Week 5"
    } else if (moment(matchTime).isBetween('2020-10-14', '2020-10-21')) {
      return "Week 6"
    } else if (moment(matchTime).isBetween('2020-10-21', '2020-10-28')) {
      return "Week 7"
    } else if (moment(matchTime).isBetween('2020-10-28', '2020-11-04')) {
      return "Week 8"
    } else if (moment(matchTime).isBetween('2020-11-04', '2020-11-11')) {
      return "Week 9"
    } else if (moment(matchTime).isBetween('2020-11-11', '2020-11-18')) {
      return "Week 10"
    } else if (moment(matchTime).isBetween('2020-11-18', '2020-11-25')) {
      return "Week 11"
    } else if (moment(matchTime).isBetween('2020-11-25', '2020-12-02')) {
      return "Week 12"
    } else if (moment(matchTime).isBetween('2020-12-02', '2020-12-09')) {
      return "Week 13"
    } else if (moment(matchTime).isBetween('2020-12-09', '2020-12-16')) {
      return "Week 14"
    } else if (moment(matchTime).isBetween('2020-12-16', '2020-12-23')) {
      return "Week 15"
    } else if (moment(matchTime).isBetween('2020-12-23', '2020-12-30')) {
      return "Week 16"
    } else if (moment(matchTime).isBetween('2020-12-30', '2021-01-06')) {
      return "Week 17"
    } else {
      return "Postseason"
    };
  }
}
