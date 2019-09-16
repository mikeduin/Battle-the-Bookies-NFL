var moment = require('moment');

module.exports = {
  weekSetter: function (matchTime) {
    if (moment(matchTime).isBefore('2019-08-30')) {
      return "Preseason"
    } else if (moment(matchTime).isBetween('2019-09-01', '2019-09-11')) {
      return "Week 1"
    } else if (moment(matchTime).isBetween('2019-09-11', '2019-09-18')) {
      return "Week 2"
    } else if (moment(matchTime).isBetween('2019-09-18', '2019-09-25')) {
      return "Week 3"
    } else if (moment(matchTime).isBetween('2019-09-25', '2019-10-02')) {
      return "Week 4"
    } else if (moment(matchTime).isBetween('2019-10-02', '2019-10-09')) {
      return "Week 5"
    } else if (moment(matchTime).isBetween('2019-10-09', '2019-10-16')) {
      return "Week 6"
    } else if (moment(matchTime).isBetween('2019-10-16', '2019-10-23')) {
      return "Week 7"
    } else if (moment(matchTime).isBetween('2019-10-23', '2019-10-30')) {
      return "Week 8"
    } else if (moment(matchTime).isBetween('2019-10-30', '2019-11-06')) {
      return "Week 9"
    } else if (moment(matchTime).isBetween('2019-11-06', '2019-11-13')) {
      return "Week 10"
    } else if (moment(matchTime).isBetween('2019-11-13', '2019-11-20')) {
      return "Week 11"
    } else if (moment(matchTime).isBetween('2019-11-20', '2019-11-27')) {
      return "Week 12"
    } else if (moment(matchTime).isBetween('2019-11-27', '2019-12-04')) {
      return "Week 13"
    } else if (moment(matchTime).isBetween('2019-12-04', '2019-12-11')) {
      return "Week 14"
    } else if (moment(matchTime).isBetween('2019-12-11', '2019-12-18')) {
      return "Week 15"
    } else if (moment(matchTime).isBetween('2019-12-18', '2019-12-25')) {
      return "Week 16"
    } else if (moment(matchTime).isBetween('2019-12-25', '2020-01-03')) {
      return "Week 17"
    } else {
      return "Postseason"
    };
  }
}
