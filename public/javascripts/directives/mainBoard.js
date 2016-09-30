app.directive('mainBoard', function() {
  return {
    restrict: 'E',
    scope: {
      boardPostList: '=',
      boardName: '='
    },
    templateUrl: 'javascripts/directives/mainBoard.html',
    replace: true
  };
});