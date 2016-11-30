// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
facebook = angular.module('facebookLogin', ['ionic', 'ngStorage', 'ngCordova'])

facebook.run(function ($ionicPlatform) {
  $ionicPlatform.ready(function () {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

facebook.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'templates/login.html',
      controller: 'LoginController'
    })
    .state('profile', {
      url: '/profile',
      templateUrl: 'templates/profile.html',
      controller: 'ProfileController'
    })
    .state('logout', {
      url: '/logout',
      templateUrl: 'templates/logout.html',
      controller: 'LogoutController'
    });
  $urlRouterProvider.otherwise('/login');
});

facebook.controller("LoginController", function ($scope, $cordovaOauth, $localStorage, $location) {
  $scope.login = function () {
    $cordovaOauth.facebook(1599647400060942, ["email", "public_profile"]).then(function (result) {
      $localStorage.accessToken = result.access_token;
      $location.path("/profile");
    }, function (error) {
      alert("There was a problem signing in!");
      console.log(error);
    });
  };

});

facebook.controller("ProfileController", function ($scope, $http, $localStorage, $location) {

  $scope.init = function () {
    if ($localStorage.hasOwnProperty("accessToken") === true) {
      $http.get("https://graph.facebook.com/v2.8/me", {
        params: {
          access_token: $localStorage.accessToken,
          fields: "id, cover, name, first_name, last_name, age_range, link, gender, locale, picture, timezone, updated_time, verified, email",
          format: "json"
        }
      }).then(function (result) {
        $scope.profileData = result.data;
      }, function (error) {
        alert("There was a problem getting your profile.");
        console.log(error);
      });
    } else {
      alert("Not signed in");
      $location.path("/login");
    }
  };

  $scope.logout = function () {
    delete $localStorage.accessToken;
    $location.path("/login");
  };

});
