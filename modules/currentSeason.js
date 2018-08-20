var moment = require('moment');

module.exports = {
  returnSeason: function(matchtime) {
    if (moment.utc(matchtime).isBefore('2018.03.01')) {
      return '2017';
    } else if (moment.utc(matchtime).isBefore('2019.03.01')) {
      return '2018';
    } else if (moment.utc(matchtime).isBefore('2020.03.01')) {
      return '2019';
    } else if (moment.utc(matchtime).isBefore('2021.03.01')) {
      return '2020';
    } else if (moment.utc(matchtime).isBefore('2022.03.01')) {
      return '2021';
    } else {
      return '2022';
    }
  }
};
