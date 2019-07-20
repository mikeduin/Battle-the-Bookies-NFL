angular
  .module('battleBookies')
  .factory('dateService', [dateService])

function dateService () {
    let date = {};

    date.fetchSystemYear = () => {
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
    };

    return date;
}
