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
  },
  fetchSystemYear: function() {
    if (moment().isBefore('2019-07-15')) {
      return 2018
    } else if (moment().isBefore('2020-07-15')) {
      return 2019
    } else if (moment().isBefore('2021-07-15')) {
      return 2020
    } else if (moment().isBefore('2022-07-15')) {
      return 2021
    } else if (moment().isBefore('2023-07-15')) {
      return 2022
    } else if (moment().isBefore('2024-07-15')) {
      return 2023
    } else if (moment().isBefore('2025-07-15')) {
      return 2024
    } else {
      return 2025
    }
  }
};
