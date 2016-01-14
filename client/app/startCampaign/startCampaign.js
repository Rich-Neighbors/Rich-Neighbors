'use strict';

angular.module('bApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('startCampaign', {
        url: '/startCampaign',
        templateUrl: 'app/startCampaign/startCampaign.html',
        controller: 'StartCampaignController',
        controllerAs: 'startCampaign',
        authenticate: true
      })
      .state('submitCampaignsSuccess', {
        url: '/submitCampaignsSuccess',
        templateUrl: 'app/submitCampaignsSuccess/submitCampaignsSuccess.html',
        controller: 'SubmitCampaignsSuccessCtrl',
        authenticate: true
      //  controller: 'StartCampaignController',
        //  controllerAs: 'SubmitCampaignsSuccessCtrl'
      })
  })
  .run(function($rootScope) {

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      //	 next.referrer = current.id;
      console.log('hi')
      $rootScope.$watch('campaigns')

     // console.log($rootScope);
      //console.log(event)
    })
  })


