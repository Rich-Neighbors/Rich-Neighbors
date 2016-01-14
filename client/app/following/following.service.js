'use strict';

(function() {
  class followingFactory {
    constructor($http, Auth) {
      this.http = $http;
      this.auth = Auth;
    }

    getFollowers(campaign) {
      this.http.get(`/api/campaigns/${campaign}/followers`).success(result => result.data);
    }
    getFollowings() {
      this.http.get(`/api/my/followings`).success(result => result.data);
    }
    checkIfFollower(campaign) {
      return !!this.getFollowings().then(data => { return _.filter(data, val => { return val === campaign; }) });
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
    .service('followingFactory', followingFactory);
})();
