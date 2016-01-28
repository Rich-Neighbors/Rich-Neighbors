'use strict';

angular.module('bApp', [
    'bApp.auth',
    'bApp.admin',
    'bApp.donate',
    'bApp.geolocation',
    'bApp.MainController',
    'bApp.CampaignProfileController',
    'bApp.SubmitCampaignsSuccessCtrl',
    'bApp.constants',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ui.router',
    'braintree-angular',
    'validation.match',
    'ngFileUpload',
    'bApp.StartCampaignController'
  ])
  .config(function($urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');
    $locationProvider.html5Mode(true);
  });
  // .run(function ($rootScope, $location, $state, Auth) {
  //     $rootScope.$on('$stateChangeStart',
  //       function(event, toState, toParams, fromState, fromParams){
  //         console.log('auth', Auth.isAuth());
  //         if(toState && toState.authenticate && !Auth.isAuth()) {
  //           $location.path('/');
  //         }
  //         else if(toState.name === 'signin' && Auth.isAuth()) {
  //           $location.path('/landing');
  //           $state.go('landing');
  //         }
  //     });
// .run(function ($rootScope, $location, Auth) {
//   // checks if user is logged in with any route change
//   $rootScope.$on('$routeChangeStart', function (evt, next, current) {
//     if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
//       $location.path('/signin');
//     }
//   });
//})
