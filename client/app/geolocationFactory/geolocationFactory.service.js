'use strict';

class geolocationService {

  constructor($http) {
    this.http = $http;
  }
  getIpInfo() {
    return this.http.get('http://ipinfo.io/json').then(result => result.data);
  }
  getLatandLong() {
    return this.getIpInfo().then(result => result.loc.split(',').map(val => {return Number(val)}));
  }
  static factory($http){
    return new geolocationService($http);
  }
}

class generalService {
  constructor() {
    this.campaignId = '';
  }
  setCampaignId(id) {
    this.campaignId = id;
  }
  getCampaignId() {
    return this.campaignId;
  }
  static factory() {
    return new generalService();
  }
}

geolocationService.$inject = ['$http'];

angular.module('bApp')
  .factory('geolocationFactory', geolocationService.factory)
  .factory('generalFactory', generalService.factory );
  //   function () {
  //   var campaignId = '';
  //   var setCampaignId = function(id) {
  //     console.log('currentCampId = ', campaignId);
  //     campaignId = id;
  //     console.log('it has now been changed to = ', campaignId);
  //   };
  //   var getCampaignId = function() {
  //     console.log('from the get: ', campaignId);
  //     return campaignId;
  //   };
  //   return {
  //     getCampaignId: getCampaignId,
  //     setCampaignId: setCampaignId
  //   };
  // });
