'use strict';

(function() {
  class ContributionService {
    constructor($http, Auth) {
      this.http = $http;
      this.auth = Auth;
    }
    getContributions(campaign) {
      return this.http.get(`/api/campaigns/${campaign}/contributors`).success(result => result.data);
    }
    getMyContributions() {
      return this.http.get(`/api/my/contributions`).success(result => result.data);
    }
    makeMoneyContribution(campaign, payment) {
      var _this = this;
      if (this.auth.isLoggedIn()) {
        var data = _.extend(payment, {'user_id': _this.auth.getCurrentUser()._id, 'campaign_id': campaign, 'type': 'Donation'});
        return this.http.post(`/api/contributors`, data);
      }
    }
    makeSupplyContribution(campaign, supply) {
      var _this = this;
      if (this.auth.isLoggedIn()) {
        var data = _.extend(supply, {'user_id': _this.auth.getCurrentUser()._id, 'campaign_id': campaign, 'type': 'Supply'});
        return this.http.post(`/api/contributors`, data);
      }
    }
    makeVolunteerContribution(campaign, volunteer) {
      var _this = this;
      if (this.auth.isLoggedIn()) {
        var data = _.extend(volunteer, {'user_id': _this.auth.getCurrentUser()._id, 'campaign_id': campaign, 'type': 'Volunteer'});
        return this.http.post(`/api/contributors`, data);
      }
    }
    removeContribution(contribution){
      return this.http.delete(`/api/contributors/${contribution}`);
    }
    filterContributionsByType(type, data, id) {
      var numbers = _.pluck(_.filter(data, {
        'type': type,
        'item_id': {
          '_id': id
        }
      }), 'amount');
      return function () {
        return _.reduce(numbers, (total, n) => {
          return total + n;
        });
      };
    }
  }
  angular.module('bApp')
    .service('contributionFactory', ContributionService);
})();
