
(function() {
  class ContributionFactory {
    constructor($http, Auth) {
      this.http = $http;
      this.auth = Auth;
    }
    getContributions(campaign) {
      this.http.get(`/api/campaigns/${campaign}/contributors`).success(result => result.data);
    }
    getMyContributions() {
      this.http.get(`/api/my/contributions`).success(result => result.data);
    }
    makeMoneyContribution(campaign, payment) {
      var _this = this;
      var data = _.extend(payment, {'user_id': _this.auth.getCurrentUser()._id, 'campaign_id': campaign, 'type': 'donation'});
      this.http.post(`/api/contributors`, data);
    }
    makeSupplyContribution(campaign, supply) {
      var _this = this;
      var data = _.extend(supply, {'user_id': _this.auth.getCurrentUser()._id, 'campaign_id': campaign, 'type': 'supplies'});
      this.http.post(`/api/contributors`, data);
    }
    makeVolunteerContribution(campaign, volunteer) {
      var _this = this;
      var data = _.extend(volunteer, {'user_id': _this.auth.getCurrentUser()._id, 'campaign_id': campaign, 'type': 'volunteer'});
      this.http.post(`/api/contributors`, data);
    }
    checkIfFollower(campaign) {
      var user = this.auth.getCurrentUser()._id;
      return this.getFollowings().then(data => { return _.filter(data, val => {return val === campaign; }) });
    }
    follow() {
      var _this = this;
      var data = { 'user_id': _this.auth.getCurrentUser()._id, 'campaign_id': _this.campaign._id };
      this.http.post('/api/followers', data).success(() => { _this.follow = true; });
    }
    unfollow(followid) {
      this.http.delete(`/api/followers/${followid}`);
    }
  }
  angular.module('bApp')
    .service('contributionFactory', ContributionFactory);
})();
