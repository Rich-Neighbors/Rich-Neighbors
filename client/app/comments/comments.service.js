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
    var data = _.extend(form,{ 'user_id': user});
    if (this.Auth.isLoggedIn() && user) {
      return this.http.post(`/api/campaigns/${campaign}/comments`, data);
    }
  }
  createReply (form, parent) {
    var user = this.auth.getCurrentUser()._id;
    var data = _.extend(form,{ 'user_id': user});
    if (this.Auth.isLoggedIn() && user) {
      return this.http.post(`/api/comments/${parent}/comments`, data);
    }
  }
  deleteComment (comment) {
    return this.http.delete(`/api/comments/${comment}`);
  }
  static factory ($http) {
    return new CommentService($http);
  }
}

CommentService.$inject = ['$http', 'Auth'];

angular.module('bApp')
  .factory('commentFactory', CommentService.factory);
