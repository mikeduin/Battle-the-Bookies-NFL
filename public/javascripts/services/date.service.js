angular
  .module('battleBookies')
  .factory('dateService', [dateService])

function dateService () {
    let date = {};

    date.fetchSeasons = () => {
      if (moment().isBefore('2019-07-15')) {
        return [2017, 2018]
      } else if (moment().isBefore('2020-07-15')) {
        return [2017, 2018, 2019]
      } else if (moment().isBefore('2021-07-15')) {
        return [2017, 2018, 2019, 2020]
      } else if (moment().isBefore('2022-07-15')) {
        return [2017, 2018, 2019, 2020, 2021]
      } else if (moment().isBefore('2023-07-15')) {
        return [2017, 2018, 2019, 2020, 2021, 2022]
      } else if (moment().isBefore('2024-07-15')) {
        return [2017, 2018, 2019, 2020, 2021, 2022, 2023]
      } else if (moment().isBefore('2025-07-15')) {
        return [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024]
      } else {
        return [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]
      }
    };

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

    date.weekSetter = matchTime => {
      if (moment(matchTime).isBefore('2019-08-17')) {
        return "Preseason"
      } else if (moment(matchTime).isBetween('2020-08-18', '2020-09-15')) {
        return "Week 1"
      } else if (moment(matchTime).isBetween('2020-09-15', '2020-09-22')) {
        return "Week 2"
      } else if (moment(matchTime).isBetween('2020-09-22', '2020-09-29')) {
        return "Week 3"
      } else if (moment(matchTime).isBetween('2020-09-29', '2020-10-06')) {
        return "Week 4"
      } else if (moment(matchTime).isBetween('2020-10-06', '2020-10-13')) {
        return "Week 5"
      } else if (moment(matchTime).isBetween('2020-10-13', '2020-10-20')) {
        return "Week 6"
      } else if (moment(matchTime).isBetween('2020-10-20', '2020-10-27')) {
        return "Week 7"
      } else if (moment(matchTime).isBetween('2020-10-27', '2020-11-03')) {
        return "Week 8"
      } else if (moment(matchTime).isBetween('2020-11-03', '2020-11-10')) {
        return "Week 9"
      } else if (moment(matchTime).isBetween('2020-11-10', '2020-11-17')) {
        return "Week 10"
      } else if (moment(matchTime).isBetween('2020-11-17', '2020-11-24')) {
        return "Week 11"
      } else if (moment(matchTime).isBetween('2020-11-24', '2020-12-01')) {
        return "Week 12"
      } else if (moment(matchTime).isBetween('2020-12-01', '2020-12-08')) {
        return "Week 13"
      } else if (moment(matchTime).isBetween('2020-12-08', '2020-12-15')) {
        return "Week 14"
      } else if (moment(matchTime).isBetween('2020-12-15', '2020-12-22')) {
        return "Week 15"
      } else if (moment(matchTime).isBetween('2020-12-22', '2020-12-29')) {
        return "Week 16"
      } else if (moment(matchTime).isBetween('2020-12-29', '2021-01-05')) {
        return "Week 17"
      } else {
        return "Week 17"
      };
    }

    return date;
}
