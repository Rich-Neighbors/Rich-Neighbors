"use strict";

(() => {
  class CampaignProfileController {

    constructor(
      Auth,
      $stateParams,
      $http,
      apiCall,
      geolocationFactory,
      generalFactory,
      donationFactory,
      campaignFactory,
      commentFactory,
      contributionFactory,
      followingFactory) {
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
      this.commentData = {};
      this.followingid;
      this.following = false; // default to false, we check below in checkiffollowed
      this.donated = 0;
      this.campaign = {};
      this.getCampaignData();
    }
    calculateDonations(contributions) {
      const donations = _.filter(contributions, (val) => val.type === 'Donation')
        .map(a =>  a.amount).reduce((a, b) => a + b);
      console.log('donationsSooly', donations);
      return donations;
    }
    updateDonatedAmount() {
      const _this = this;
      this.campaignFactory.updateDonations(_this.stateParams.id).then(data => {
          _this.donated = _this.calculateDonations(data.data);
      });
    }
    saveDonation(amount) {
      this.donationFactory.saveDonation(amount, this.stateParams.id, this.stateParams._userId)
        .then(() => this.updateDonatedAmount());
    }
    getCampaignData() {
      const _this = this;
      this.campaignFactory.getCampaign(this.stateParams.id)
        .then(data => {
          _this.campaign = data.data;
  
          _this.api.linkApiCalls(_this.campaign._links.slice(1, 5));
          console.log(data);
          //_this.generalFactory.setCampaignId(data._id);
          //var amounts = _.pluck(_.filter(data.contributors, val => {return val.type === 'Donation'}), 'amount');
          //_this.donated = _this.calculateDonations(amounts);
          //var links = data._links.slice(1, 5);
          _this.checkiffollowed();
        })
        .then(data => {
          _this.updateDonatedAmount();
        })
        .catch(data => console.error(`Error: ${data}`));
    }
    addComment() {
      const _this = this;
      this.commentFactory.createComment(this.commentData, this.campaign._id)
        .success(data => {
      console.log(data);
          //this.api.linkApiCalls(this.campaign._links[1]);
          this.commentData.text = '';
          this.commentData.$setPristine();
        })
        .error(error => console.log(error.data));
    }
    addReply(parent) {
      this.commentFactory(this.replyData, parent)
        .success(data => {
          this.api.linkApiCalls(this.campaign._links[1]);
          // this.replyData.text = '';
          // this.replyData.parent = null;
          this.form.$setPristine();
        })
        .error(error => console.log(`Error:  ${error}`));
    }
    checkiffollowed() {
      const _this = this;
      this.followingFactory.getMyFollowings()
        .then(result => { 
          const _followedCampaigns = _.map(result.data, a => a.campaign_id._id);
          if(_.contains(_followedCampaigns, _this.campaign._id)) {
            _this.following = true;
          }
          return _.filter(contributions, (val) => val.type === 'Donation')
        // .then(data => {
        //   if (data) { 
        //     console.log('dataHOOEREEEE ', data)
        //     _this.following = true; _this.followingid = data[0]._id }
        //   else { _this.following = false; _this.followingid = null;}
        // })
        .catch(error => { console.log(`Error: ${error}`);});
    }
    clicktofollow() {
      const _this = this;
      console.log(_this.followingid);
      if (this.following === false) {
        this.followingFactory.follow(_this.campaign._id)
          .success(data => { 
          console.log('clicktofollow  ', data);
            _this.followingid = data._id; _this.following = true;})
          .error(error => console.log(`Error: ${error}`));
      } else {
        this.followingFactory.unfollow(_this.followingid)
          .success(() => {_this.followingid = null; _this.following = false;})
          .error(error => console.log(`Error: ${error}`));
      }
    }
    contributeSupply(quantity, id) {
      // $scope.supplySignUp.item_id = id;
      // $scope.supplySignUp.amount = quantity;
      const data = {'amount': quantity, 'item_id': id};
      this.contributionFactory.makeSupplyContribution(this.campaign._id, data)
        .success( data => {
          alert("Thanks for Donating!");
          this.contributionFactory.getContributions(this.campaign._id);
        })
        .error(error => console.log(`Error: ${error}`));
    }
    contributeVolunteer(id) {
      const data = { 'volunteer_id': id };
      this.contributionFactory.makeVolunteerContribution(this.campaign._id, data)
        .success(data => {
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
      const quantity = [];
      for (let i = 1; i < count + 1; i++) {
        quantity.push(i);
      }
      return quantity;
    }
}


  angular.module('bApp.CampaignProfileController', [])
    .controller('CampaignProfileController', CampaignProfileController);

})();