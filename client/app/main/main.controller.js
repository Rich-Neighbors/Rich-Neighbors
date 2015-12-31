'use strict';

angular.module('bApp.MainController', ['ui.router'])
  .controller('MainController', ['$scope', '$http', 'geolocationFactory', function ($scope, $http, geolocationFactory) {

    $scope.campaigns = {};

    // https://maps.googleapis.com/maps/api/distancematrix/json?origins=02148&destinations=91801
    $scope.location = geolocationFactory.getLatandLong();

    $scope.getCurrentLoc = function() {
    var url = 'http://ipinfo.io/json';
      return $http.get(url)
      .success(function(data) {
        var result = data.city + ' ' + data.region + ', ' + data.postal;
        $scope.currentLoc = result;
        $scope.loc = data.loc.split(',').map(function(loc) {
          console.log(loc);
          return Number(loc);
        });
      });

    };
    $scope.currentLoc = 'Me';
    $scope.outputBar = {bar : "main"};
    $scope.offsetLevel = 0;

    $scope.getCurrentLoc()
      .then(function () {
        $http({
          method: 'GET',
          url: '/api/campaigns',
          params: { longitude: $scope.loc[0] , latitude: $scope.loc[1] , limit: 40, distance: 5000}
        })
        .success(function(data) {
          $scope.campaigns = data;
          console.log(data);
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
      });

    $scope.addMoreResults = function () {
      var offset = $scope.offsetLevel * 9;
      $http({
        method: 'GET',
        url: '/api/campaigns',
        params: { longitude: $scope.loc[1] , latitude: $scope.loc[0] , limit: 40, distance: 5000, offset: offset}
      })
      .success(function(data) {
        $scope.campaigns = _.extend($scope.campaigns, data);
        console.log(data);
      })
      .error(function(data) {
        console.log('Error: ' + data);
      });
    }



    $scope.calDonatedAmount = function(x) {
      var amounts = _.pluck(x, 'amount');
        // console.log(amounts)

      return _.reduce(amounts, function(total, n) {
        return total + n;
      });
    };

    $scope.limitChar = function(x, y) {
      var sp = x.split('');
      return sp.slice(0, y).join('');
    };

    // $scope.showCampaignProfile = function(x) {
    //   $location.path('#/campaignProfile/' + x._id);
    // };


    $scope.showData = function() {

      //show more functionality
      var pagesShown = 1;
      var pageSize = 9;

      $scope.paginationLimit = function() {
        return pageSize * pagesShown;
      };
      $scope.hasMoreItemsToShow = function() {
        return pagesShown < ($scope.campaigns.length / pageSize);
      };
      $scope.showMoreItems = function() {
        $scope.offset += 1;
        $scope.addMoreResults();
        pagesShown = pagesShown + 1;
      };


    };



  }])
  .directive('heroCard', function () {
    return {
      templateUrl: 'app/main/herocard.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  })
  .directive('campaignCard', function () {
    return {
      templateUrl: 'app/main/temp.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  })
  .directive('howCard', function () {
    return {
      templateUrl: 'app/main/howitworks.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  })
  .directive('androidDemo', function () {
    return {
      templateUrl: 'app/main/androiddemo.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  })
// .filter('zipCodeFilter', function(){
//   return function(input){
//     var out = [];
//     angular.forEach(input, function(campaign){
//       var zip = campaign.address.zip;
//       if(zip[0] === $scope.zipcode[0]){
//         out.push(campaign);
//       }
//     });
//     return out;
//   };
// });






// (function() {

// class MainController {



//   constructor($http) {
//     this.$http = $http;
//     this.awesomeThings = [];

//     $http.get('/api/things').then(response => {
//       this.awesomeThings = response.data;
//     });
//   }

//   addThing() {
//     if (this.newThing) {
//       this.$http.post('/api/things', { name: this.newThing });
//       this.newThing = '';
//     }
//   }

//   deleteThing(thing) {
//     this.$http.delete('/api/things/' + thing._id);
//   }
// }

// angular.module('bApp')
//   .controller('MainController', MainController);

// })();
