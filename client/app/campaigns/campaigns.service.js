'use strict';

(function () {
  class CampaignService {
    constructor($http, Auth) {
      this.http = $http;
      this.auth = Auth;
    }
    getCampaigns(params) {
      return this.http({
          method: 'GET',
          url: '/api/campaigns',
          params: params
        })
        .success(result => result.data);
    }
    getCampaign(campaign) {
      return this.http.get(`/api/campaigns/${campaign}`).success(result => result.data);
    }
    createCampaign(form) {
      var user = this.auth.getCurrentUser()._id;
      var data = _.extend(form,{ 'user_id': user});
      if (this.Auth.isLoggedIn() && user) {
        return this.http.post('/api/campaigns', data);
      }
    }
    updateCampaign(campaign, data) {
      var user = this.auth.getCurrentUser()._id;
      if (this.Auth.isLoggedIn() && this.campaign.user_id === user) {
        return this.http.put(`/api/campaigns/${campaign}`, data);
      }
    }
    updateDonations(campaign) {
      return this.http.get(`/api/campaigns/${campaign}/contributors`).success(result => result.data);
    }
  }

  CampaignService.$inject = ['$http', 'Auth'];

  angular.module('bApp')
    .service('campaignFactory', CampaignService);
})();
