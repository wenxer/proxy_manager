'use strict';

angular.module('proxyManagerApp')
  .controller('ProxyCtrl', function ($scope, $location, $http, Modal, Proxy, Util, $interval, $timeout, Auth, User) {
    if (Auth.isLoggedIn() === false) {
      $location.path('/login');
    }

    $scope.refresh = function () {
      $scope.refreshStatus = true;
      if (!Auth.isAdmin()) {
        $scope.proxies = Proxy.me(function () {
          $timeout(function () {
            $scope.refreshStatus = false;
          }, 1000);
        });
      } else {
        $scope.proxies = Proxy.me(function () {
          $timeout(function () {
            $scope.refreshStatus = false;
          }, 1000);
        });
      }
    };

    var saveProxy = function (proxy) {
      proxy.owner = Auth.getCurrentUser()._id;
      proxy.summary = proxy.summary || Util.randomString(10);
      var newProxy = new Proxy(proxy);
      newProxy.$save();
      $scope.refresh();
    };

    $scope.newProxy = function () {
      Modal.new.proxy(saveProxy)();
    };

    $scope.showProxy = function (proxy) {
      Modal.show.proxy(proxy)();
    };

    $scope.refresh();

    $scope.startOrStopProxy = function (proxy) {
      proxy.loading = true; // start loading
      $timeout(function () {
        if (proxy.status === true) {
          stopProxy(proxy, function () {
            $scope.refresh();
          });
        } else {
          startProxy(proxy);
        }
        proxy.loading = false; // stop loading
      }, 0);
    }

    $scope.proxyStatus = function (proxy) {
      if (proxy.status === true) {
        return "Running";
      } else {
        return "Click to Run"
      }
    };

    $scope.statusButtonClass = function (proxy) {
      if (proxy.status === true) {
        return "btn btn-success ladda-button btn-sm";
      } else {
        return "btn btn-danger  ladda-button btn-sm";
      }
    };

    var startProxy = function (proxy) {
      proxy.$start().then(function () {
        $scope.refresh();
      });
    };

    var stopProxy = function (proxy) {
      proxy.$stop().then(function (proxy) {
        $scope.refresh();
      });
    };

    var deleteProxy = function (proxy) {
      proxy.$delete().then(function () {
        $scope.refresh();
      });
    }

    $scope.deleteProxyButton = function (proxy) {
      if (proxy.status) {
        Modal.confirm.warning("Runing proxy is not allowed to delete, stop first.")();
      } else {
        Modal.confirm.delete(deleteProxy)(proxy.summary, proxy);
      }
    };

    $scope.docButtonClass = function (proxy) {
      if (proxy.status) {
        return "btn btn-info btn-sm";
      } else {
        return "btn btn-default btn-sm";
      }
    };
    $scope.docbuttonDisabled = function (proxy) {
      if (proxy.status) {
        return false;
      } else {
        return true;
      }
    };
  });
