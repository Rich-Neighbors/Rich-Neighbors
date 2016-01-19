'use strict';

(function(){
  class CommentService {

    constructor ($http, Auth) {
      this.http = $http;
      this.auth = Auth;
    }

    getComments (campaign) {
      return this.http.get(`/api/campaigns/${campaign}/comments`).success(result => result.data);
    }
    createComment (form, campaign) {
      var user = this.auth.getCurrentUser()._id;
      if (this.auth.isLoggedIn() && user) {
        var data = _.extend(form);
        console.dir(form);
        return this.http.post(`/api/campaigns/${campaign}/comments`, form);
      }
    }
    createReply (form, parent) {
      var user = this.auth.getCurrentUser()._id;
      if (this.auth.isLoggedIn() && user) {
        var data = _.extend(form,{ 'user_id': user});
        return this.http.post(`/api/comments/${parent}/comments`, data);
      }
    }
    deleteComment (comment) {
      return this.http.delete(`/api/comments/${comment}`);
    }
  }

  CommentService.$inject = ['$http', 'Auth'];

  angular.module('bApp')
    .service('commentFactory', CommentService);

})();
