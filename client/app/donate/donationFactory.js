// 'use strict';
// (function() {
//   class donationFactory {
//     constructor($http, $stateParams) {
//       this.http = $http;
//       this.stateParams = $stateParams;
//     }

//     updateDonatedAmount() {
//       var total = 0;
//       console.log('hello from donation factory')
//        $http.get('/api/campaigns/' + this.stateParams.id + '/contributors')
//         .success(contributions => {
//           _each(contribution => total += contribution);
//         });
//         return total;
//     }
//     saveDonation(donatedAmount, campaignId, userId) {
//     var contributionURL = '/api/campaigns/' + campaignId + '/contributors';
//       console.log(contributionURL)
//       var donationData = {
//         amount: donatedAmount,
//         campaign_id: campaignId,
//         user_id: userId || $stateParams._userId,
//         type: 'Donation'
//       };
//       return $http.post(contributionURL, donationData)
//         .success(data => console.log('donation saved for this user'))
//         .error(data => console.log('donation backend error ', data));
//     }
//   }
//   angular.module('bApp')
//     .service('donationFactory', donationFactory);
// })();
