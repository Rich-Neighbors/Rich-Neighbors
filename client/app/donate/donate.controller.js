"use strict";

angular.module('bApp.donate', ['ngMaterial'])

  .controller('DonateCtrl', ['$scope', '$http', '$stateParams', '$state','$timeout', 'Auth', 'generalFactory', 'donationFactory', 'campaignFactory',  function(
  $scope,
  $http,
  $stateParams,
  $state,
  $timeout,
  Auth,
  generalFactory,
  donationFactory,
  campaignFactory) {
    $scope.message = 'Please use the form below to pay:';
    $scope.showDropinContainer = true;
    $scope.isError = false;
    $scope.isPaid = false;


    $scope.getCurrentUser = Auth.getCurrentUser;
    $scope.userID = $scope.getCurrentUser()._id;

    $scope.campaignId = generalFactory.getCampaignId();

    console.log('scope.capID::', $scope.campaignId);

    console.log('scope.userID::', $scope.userID);

    $scope.getToken = function() {
      $http({
        method: 'POST',
        url: 'api/payments/client_token'
      }).success(data => {
        console.log(data.client_token); // CUT THIS
        braintree.setup(data.client_token, 'dropin', {
          container: 'checkout',
          // Form is not submitted by default when paymentMethodNonceReceived is implemented
          paymentMethodNonceReceived(event, nonce) {
            $scope.message = 'Processing your payment...';
            $scope.showDropinContainer = false;
            $http({
              method: 'POST',
              url: 'api/payments/checkout',
              data: {
                amount: $scope.amount,
                payment_method_nonce: "fake-valid-nonce"
              }
            }).success(data => {
              if (data.success) {
                donationFactory.saveDonation(data.transaction.amount, $scope.campaignId, $scope.userID)
                .success(data => {
                  console.log(data);
                })
              }
              if (data.success) {
                $scope.message = 'Payment authorized, thanks! You will be redirected to the home page in 3 seconds.';
                $scope.showDropinContainer = false;
                $scope.isError = false;
                $scope.isPaid = true;


                $timeout(() => {
                  $state.go('main');
                }, 4000);


              } else {
                // implement your solution to handle payment failures
                $scope.message = `Payment failed: ${data.message} Please refresh the page and try again.`;
                $scope.isError = true;
              }
            }).error(error => {
              $scope.message = 'Error: cannot connect to server. Please make sure your server is running.';
              $scope.showDropinContainer = false;
              $scope.isError = true;
            });
          }
        });
      }).error(error => {
        $scope.message = 'Error: cannot connect to server. Please make sure your server is running.';
        $scope.showDropinContainer = false;
        $scope.isError = true;
      });
    };
    $scope.getToken();
  }])
.factory('donationFactory', ($http, $stateParams) => {

  const updateDonatedAmount = function() {
    let total = 0;
    console.log('hello from donation factory')
     return $http.get(`/api/campaigns/${$stateParams.id}/contributors`)
      .success(contributions => {
        _.each(contributions, contribution => {
          total += Number(contribution.amount);
        });
      console.log(total)
        return total;
      });

  };

  const saveDonation = function(donatedAmount, campaignId, userId) {
    const contributionURL = `/api/campaigns/${campaignId}/contributors`;
    console.log(contributionURL)
    const donationData = {
      amount: donatedAmount,
      campaign_id: campaignId,
      user_id: userId || $stateParams._userId,
      type: 'Donation'
    };
    return $http.post(contributionURL, donationData)
      .success(data => {
        console.log('donation saved for this user')
      })
      .error(data => {
        console.log('donation backend error ', data);
      });
  };

  return {
      updateDonatedAmount: updateDonatedAmount,
      saveDonation(donatedAmount, campaignId, userId) {
          return saveDonation(donatedAmount, campaignId, userId);
      }
  };
});