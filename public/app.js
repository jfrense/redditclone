var app = angular.module('gameapp',[]);

app.controller('mainController', function($scope,$http) {
    $scope.games = [];
    $scope.maxplayers = 0;
    $scope.minplayers = 0;
    $scope.playingtime = 0;
  $http.get('/api/games')
    .success(function(data){
      $scope.games = data;
      console.log(data);

    })
    .error(function(data) {
      console.log('Error' + data);
    });


var tracker = [];
var apicall = [];
function setupWatcher(model){

  $scope.$watch(model,function(){


    if(!$scope[model]) return;

      if(tracker.indexOf(model) == -1)
        tracker.push(model);
      else{
      if(tracker.indexOf(model) != 0)
       apicall[tracker.indexOf(model)] = '&' + model + '=' + $scope[model];
       else apicall[tracker.indexOf(model)] = model + '=' + $scope[model];
       }
       var apiString = apicall.join("");

    //$http.get('/api/games?'+ model + '=' + $scope[model])
    $http.get('/api/games?'+ apiString)
      .success(function(data){
        $scope.games = data;

      })
      .error(function(data){
        console.log('Error' + data);
      });

  });
}

angular.forEach(['maxplayers','minplayers','playingtime'],setupWatcher);


    $scope.RandomNum = function(){
    return Math.floor(Math.random()*($scope.games.length - 0)+0);
  }





});
