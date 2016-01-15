'use strict';

(function(){
  class CampaignProfileController {

    constructor(Auth, $stateParams, $http, apiCall, geolocationFactory, generalFactory, donationFactory, campaignFactory, commentFactory, contributionFactory, followingFactory) {
      this.auth = Auth;
      this.stateParams = $stateParams;
      this.http = $http;
      this.api = apiCall;
      //this.obj = apiCall.obj;
      this.geolocationFactory = geolocationFactory;
      this.generalFactory = generalFactory;
      this.donationFactory = donationFactory;
      this.campaignFactory = campaignFactory;
      this.commentFactory = commentFactory;
      this.followingFactory = followingFactory;
      this.contributionFactory = contributionFactory;
      this.isLoggedIn = Auth.isLoggedIn();
      this.getCurrentUser = Auth.getCurrentUser;
      this.name = this.getCurrentUser().name;
      this.profile_pic = this.getCurrentUser().profile_pic;
      this.following;
      this.donated = 0;
      this.getCampaignData();
    }
    calculateDonations(contributions) {
      var donations = _.filter(contributions, val => { return val.type === 'Donation'});
      return _.reduce(donations, (total, val) => {return total + val});
    }
    updateDonatedAmount() {
      this.campaignFactory.updateDonations(this.stateParams.id).success(data => {
          this.donated = this.calculateDonations(data);
      });
    }
    saveDonation(amount) {
      this.donationFactory.saveDonation(amount, this.stateParams.id, this.stateParams._userId)
        .then(() => this.updateDonatedAmount());
    }
    getCampaignData() {
      var _this = this;
      this.campaignFactory.getCampaign(this.stateParams.id)
        .success(data => {
          _this.campaign = data;
          _this.updateDonatedAmount();
          console.log(data);
          //_this.generalFactory.setCampaignId(data._id);
          var amounts = _.pluck(_.filter(data.contributors, val => {return val.type === 'Donation'}), 'amount');
          _this.donated = _this.calculateDonations(amounts);
          //var links = data._links.slice(1, 5);
          _this.api.linkApiCalls(data._links.slice(1, 5));
          _this.checkiffollowed();
        })
        .error(data => console.error('Error: ' + data));
    }
    addComment() {
      this.commentFactory.createComment(this.formData, this.campaign._id)
        .success(data => {
          this.api.linkApiCalls(this.campaign._links[1]);
          this.formData.text = '';
          this.form.$setPristine();
        })
        .error(error => console.log(`Error:  ${error}`));
    }
    addReply(parent) {
      this.commentFactory(this.replyData, parent)
        .success(function(data) {
          this.api.linkApiCalls(this.campaign._links[1]);
          // this.replyData.text = '';
          // this.replyData.parent = null;
          this.form.$setPristine();
        })
        .error(error => console.log(`Error:  ${error}`));
    }
    checkiffollowed() {
      var _this = this;
      this.followingFactory.getMyFollowings()
        .then(data => { console.log(_.filter(data, val => {return val.campaign_id === campaign })) })
        // .then(data => {
        //   if (data) { _this.following = true; console.log(data); }
        //   else { _this.following = false; }
        // })
        .error(error => console.error(`Error: ${error}`));
    }
    clicktofollow() {
      var _this = this;
      if (this.following === false) {
        this.followingFactory.follow(this.campaign._id)
          .success(data => { _this.followingid = data._id; _this.following = true;})
          .error(error => console.error(`Error: ${error}`));
      } else {
        this.followingFactory.unfollow(_this.followingid)
          .success(() => {_this.followingid = null; _this.following = false })
          .error(error => console.error(`Error: ${error}`));
      }
    }
    contributeSupply(quantity, id) {
      // $scope.supplySignUp.item_id = id;
      // $scope.supplySignUp.amount = quantity;
      var data = {'amount': quantity, 'item_id': id};
      this.contributionFactory.makeSupplyContribution(this.campaign._id, data)
        .success( data => {
          alert("Thanks for Donating!");
          this.contributionFactory.getContributions(this.campaign._id);
        })
        .error(error => console.log(`Error: ${error}`));
    }
    contributeVolunteer(id) {
      var data = { 'volunteer_id': id };
      this.contributionFactory.makeVolunteerContribution(this.campaign._id, data)
        .success(function(data) {
          alert("Thanks for Signing Up!");
          this.contributionFactory.getContributions(this.campaign._id);
        })
        .error(error => console.log(`Error: ${error}`));
    }
    filterSupply(data, id) {
      this.contributionFactory.filterContributionsByType('Supply', data, id);
    }
    filterVolunteer(data, id) {
      this.contributionFactory.filterContributionsByType('Supply', data, id);
    }
    range(count) {
      var quantity = [];
      for (var i = 1; i < count + 1; i++) {
        quantity.push(i);
      }
      return quantity;
    }
}


  angular.module('bApp.CampaignProfileController', [])
    .controller('CampaignProfileController', CampaignProfileController);

})();

// angular.module('bApp.CampaignProfileController', ['td.easySocialShare'])

// .controller('CampaignProfileController', ['$scope', 'Auth', '$stateParams', '$http', 'apiCall', 'geolocationFactory', 'generalFactory', 'donationFactory', function($scope, Auth, $stateParams, $http, apiCall, geolocationFactory, generalFactory, donationFactory) {
//     $scope.campaign = apiCall.campaign;

//     // $scope.updateDonatedAmount = donationFactory.updateDonatedAmount();
//     $scope.donated = 'blah';
//     $scope.apiCall = apiCall.call;
//     $scope.linkApiCalls = apiCall.linkApiCalls;
//     $scope.obj = apiCall.obj;
//     $scope.addressDetails = 'jamma';

//     $scope.updateDonatedAmount = function() {
//       // donationFactory.updateDonatedAmount()
//       return $http.get('/api/campaigns/' + $stateParams.id + '/contributors')
//         .success(function(contributions) {
//           var total = 0;
//           _.each(contributions, function(contribution) {
//             total += Number(contribution.amount);
//           });
//           $scope.donated = total;
//         });
//     };
//     $scope.saveDonation = function(amount) {
//       donationFactory.saveDonation(amount, $stateParams.id, $stateParams._userId)
//         .success(function(data) {
//           console.log(data);
//           $scope.updateDonatedAmount();
//         });
//     };

//     $scope.getCampaigns = function() {
//       $http.get('/api/campaigns/' + $stateParams.id)
//         .success(function(data) {
//           $scope.updateDonatedAmount();
//           $scope.campaign = data;
//           //$scope.comments = data.comments;
//           console.log(data);
//           generalFactory.setCampaignId(data._id);

//           var amounts = _.pluck(data.contributors, 'amount');

//           $scope.donated = _.reduce(amounts, function(total, n) {
//             return total + n;
//           });
//           console.log('donated:', _.reduce(amounts, function(total, n) {
//             return total + n;
//           }));
//           var links = data._links.slice(1, 5);
//           $scope.linkApiCalls(links);
//         })
//         .error(function(data) {
//           console.log('Error: ' + data);
//         });
//     }


//     $scope.getCampaigns();


//     // $http.get('/api/comments/' + $stateParams.id)
//     //   .success(function(data) {
//     //     $scope.comments = data
//     //     console.log(data)
//     //     console.log('comments', $scope.comments)
//     //   })
//     //   .error(function(data) {
//     //     console.log('Error: ' + data);
//     //   })






//     $scope.isLoggedIn = Auth.isLoggedIn;
//     $scope.formData = {};
//     $scope.replyData = {};
//     $scope.getCurrentUser = Auth.getCurrentUser;
//     $scope.name = $scope.getCurrentUser().name;
//     $scope.profile_pic = $scope.getCurrentUser().profile_pic;
//     $scope.formData.user_id = $stateParams._userId = $scope.getCurrentUser()._id;
//     $scope.formData.profile_pic = $scope.getCurrentUser().profile_pic;
//     $scope.formData.username = $scope.getCurrentUser().name;
//     $scope.formData.campaign_id = $stateParams.id;
//     $scope.formData.text = '';
//     $scope.replyData.user_id = $stateParams._userId = $scope.getCurrentUser()._id;
//     $scope.replyData.profile_pic = $scope.getCurrentUser().profile_pic;
//     $scope.replyData.username = $scope.getCurrentUser().name;
//     $scope.replyData.campaign_id = $stateParams.id;
//     $scope.replyData.text = '';
//     // Current comment.
//     $scope.comment = {};

//     // Array where comments will be.
//     //$scope.comments = [];

//     // Fires when form is submited.
//     $scope.addComment = function() {
//       $http.post('/api/comments', $scope.formData)
//         .success(function(data) {
//           var commentApi = {
//             'href': '/api/campaigns/' + $stateParams.id + '/comments',
//             'ref': 'comments'
//           }
//           $scope.linkApiCalls([commentApi]);
//           $scope.formData.text = '';
//           $scope.form.$setPristine();
//         })
//         .error(function(data) {
//           console.log($scope.getCurrentUser());
//           console.log('Error: ' + $scope.formData);
//         });
//     };

//     $scope.addReply = function(parent) {
//       $http.post('/api/comments/' + parent + '/comments', $scope.replyData)
//         .success(function(data) {
//           var commentApi = {
//             'href': '/api/campaigns/' + $stateParams.id + '/comments',
//             'ref': 'comments'
//           }
//           $scope.linkApiCalls([commentApi]);
//           console.log($scope.obj.comments);
//           $scope.replyData.text = '';
//           $scope.replyData.parent = null;
//           $scope.form.$setPristine();
//         })
//         .error(function(data) {
//           console.log($scope.getCurrentUser());
//           console.log('Error: ' + $scope.formData);
//         });
//     };

//     // Fires when the comment change the anonymous state.
//     $scope.anonymousChanged = function() {
//       if ($scope.comment.anonymous)
//         $scope.comment.author = "";
//     };

//     //********************follow campagins************************

//     $scope.followers = {};
//     $scope.followers.user_id = $scope.formData.user_id;
//     $scope.followers.campaign_id = $scope.formData.campaign_id;
//     $scope.follow = 'Follow';
//     $scope.check = 'plus'
//     $scope.followid = '';

//     $scope.checkiffollowed = function() {
//         $http.get('/api/campaigns/' + $scope.followers.campaign_id + '/followers')
//           .success(function(data) {
//             console.log('checkiffollowed', data)
//             _.forEach(data, function(item) {
//               if (item.user_id === $scope.followers.user_id) {
//                 console.log('yes!!!!')
//                 $scope.followid = item._id;
//                 $scope.follow = 'Followed'
//                 $scope.check = 'check';

//               }
//             })

//           })
//           .error(function(data) {

//             console.log('Error: ' + data);
//           });


//       }
//       //**************************sign up for supplies and volunteers**********************

//     $scope.range = function(count) {

//       var quantity = [];

//       for (var i = 1; i < count + 1; i++) {
//         quantity.push(i);
//       }

//       return quantity;
//     }

//     $scope.checkiffollowed();

//     $scope.clicktofollow = function() {

//       if ($scope.follow == 'Follow') {
//         $http.post('/api/followers', $scope.followers)
//           .success(function(data) {
//             $scope.follow = 'Followed';
//             $scope.check = 'check';

//             $scope.followid = data._id;
//             console.log(data);
//             console.log($scope.followid);
//           })
//           .error(function(data) {

//             console.log('Error: ' + data);
//           });
//       } else {
//         console.log('delete');

//         $http.delete('/api/followers/' + $scope.followid)
//           .success(function(data) {
//             $scope.follow = 'Follow';
//             $scope.check = 'plus';
//             console.log('deleted');
//             console.log(data);
//           })
//           .error(function(data) {
//             console.log('Error: ' + data);
//           });
//       }
//     };


//     //**************************sign up for supplies **********************
//     $scope.selectedItem = '1'

//     $scope.range = function(count) {

//       var quantity = [];

//       for (var i = 1; i < count + 1; i++) {
//         quantity.push(i)
//       }

//       return quantity;
//     }


//     $scope.supplySignUp = {};
//     // $scope.supplySignUp.user_id = $scope.formData.user_id;
//     // $scope.supplySignUp.campaign_id = $scope.formData.campaign_id;
//     // $scope.supplySignUp.type = "Supply";
//     $scope.supplySignUp.item_id = ''
//     $scope.supplySignUp.amount = ''

//     $scope.contributeSupply = function(quantity, id) {
//       console.log(quantity, id)
//       $scope.supplySignUp.item_id = id;
//       $scope.supplySignUp.amount = quantity;
//       $http.post('/api/contributors', $scope.supplySignUp)
//         .success(function(data) {

//           alert("Thanks for Donating!")

//           $scope.getCampaigns();

//         })
//         .error(function(data) {

//           console.log('Error: ' + data);
//         });

//     }


//     //**************************sign up for volunteers **********************
//     $scope.supplyVolunteer = {};
//     $scope.supplyVolunteer.user_id = $scope.formData.user_id;
//     $scope.supplyVolunteer.campaign_id = $scope.formData.campaign_id;
//     $scope.supplyVolunteer.type = "Volunteer";
//     $scope.supplyVolunteer.volunteer_id = ''
//     $scope.supplyVolunteer.amount = '1'

//     $scope.contributeVolunteer = function(id) {
//       console.log(id)
//       $scope.supplyVolunteer.volunteer_id = id;
//       $http.post('/api/contributors', $scope.supplyVolunteer)
//         .success(function(data) {
//           alert("Thanks for Signing Up!")
//           $scope.getCampaigns();

//         })
//         .error(function(data) {

//           console.log('Error: ' + data);
//         });

//     }

//     //**************************filtering out supply contributions **********************

//     $scope.filterSupply = function(x, id) {
//       var numbers = _.pluck(_.filter(x, {
//         'type': "Supply",
//         'item_id': {
//           '_id': id
//         }
//       }), 'amount')



//       var reducednumber = _.reduce(numbers, function(total, n) {
//         return total + n;
//       })

//       return reducednumber
//     }


//     //**************************filtering out supply contributions **********************
//     $scope.filterVolunteer = function(x, id) {

//       var numbers = _.pluck(_.filter(x, {
//         'type': "Volunteer",
//         'volunteer_id': {
//           '_id': id
//         }
//       }), 'amount')


//       var reducednumber = _.reduce(numbers, function(total, n) {
//         return total + n;
//       })

//       return reducednumber
//     }

//     //**************************social share **********************







//   }])
//   .factory('campaignFactory', function($stateParams) {
//     var campaignId = $stateParams.id;
//     return {
//       campaignId: campaignId
//     };
//   });
