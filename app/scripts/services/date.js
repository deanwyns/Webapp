'use strict';

angular.module('joetzApp')
  .factory('dateService', [function () {
        var dateService = {};

        /**
         * Vormt een JS-datum om in een string in MySQL-formaat
         * @param  {date} date Date-object
         * @return {string}      Datum in MySQL-formaat
         */
        var _dateToMySQLString = function(date) {
          //var seconds = Date.parse(str);
          //var date = new Date(seconds);
          if(date === undefined) {
            return undefined;
          }

          var year, month, day, hours, minutes;
          year = String(date.getFullYear());
          month = String(date.getMonth() + 1);
          if (month.length === 1) {
            month = '0' + month;
          }
          day = String(date.getDate());
          if (day.length === 1) {
            day = '0' + day;
          }
          hours = String(date.getHours());
          if (hours.length === 1) {
            hours = '0' + hours;
          }
          minutes = String(date.getMinutes());
          if (minutes.length === 1) {
            minutes = '0' + minutes;
          }

          return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
        };

        /**
         * Vormt een string om in een Date-object
         * @param  {string} str Datum-string
         * @return {date}     Date-object
         */
        var _mySQLStringToDate = function(str) {
          var seconds = Date.parse(str);
          return isNaN(seconds) ? null : new Date(seconds);
        };

        // Voeg de methoden toe aan het object
        dateService.dateToMySQLString = _dateToMySQLString;
        dateService.mySQLStringToDate = _mySQLStringToDate;

        // Return het object
        return dateService;
}]);