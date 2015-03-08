(function() {
  'use strict';

  var directives = {};

  function generateDirective(eventName) {
    return ['$window', '$rootScope', '$timeout', function($window, $rootScope, $timeout) {
      return {
        restrict: 'EA',
        compile: function(element, attrs) {
          element.addClass('ng-hide');
          if ($window.applicationCache) {
            $window.applicationCache.addEventListener(eventName, function() {
              element.removeClass('ng-hide');
              var delay = $rootScope.$eval(attrs.dismissDelay);
              if (delay >= 0) {
                $timeout(function() {
                  element.addClass('ng-hide');
                }, delay, true);
              }
            });
            if (!angular.isUndefined(attrs.dismissOnClick))
              element.bind('click', function() {
                element.addClass('ng-hide');
              });
          }
        }
      };
    }];
  }

  ['cached', 'checking', 'downloading', 'error', 'noupdate', 'obsolete', 'updateready']
  .map(function(eventName) {
    directives[eventName] = generateDirective(eventName);
  });

  angular.module('ng-appcache', [])
  .factory('appcache', ['$window', '$rootScope', '$q', '$timeout', function($window, $rootScope, $q, $timeout) {

    var self = this;

    function unsupported() {
      return $q.reject('unsupported');
    }

    if ($window.applicationCache) {

      self.abortUpdate = function() {
        try {
          if ($window.applicationCache.abort() === undefined)
            return false;
          else
            return true;
        } catch(e) {
          // abort may be undefined in certain browsers, eg. PhantomJS
          if (!e.message.match(/^'undefined'/))
            throw e;
          return false;
        }
      };

      self.checkUpdate = function() {
        var deferred = $q.defer();

        function cleanup() {
          self.removeEventListener('updateready', resolve);
          self.removeEventListener('noupdate', reject);
        }
        function resolve() { $timeout(function() { deferred.resolve(); cleanup(); }, 0, true); }
        function reject()  { $timeout(function() { deferred.reject();  cleanup(); }, 0, true); }

        self.addEventListener('updateready', resolve);
        self.addEventListener('noupdate', reject);

        try {
          $window.applicationCache.update();
        } catch(e) {
          if (!(e.name === 'InvalidStateError' || e.name === 'INVALID_STATE_ERR'))
            throw e;
          deferred.reject(e.name);
        }
        return deferred.promise;
      };

      self.swapCache = function() {
        var deferred = $q.defer();
        try {
          $window.applicationCache.swapCache();
          deferred.resolve();
        } catch(e) {
          if (!(e.name === 'InvalidStateError' || e.name === 'INVALID_STATE_ERR'))
            throw e;
          deferred.reject(e.name);
        }
        return deferred.promise;
      };

      self.addEventListener = function(eventName, handler, useCapture) {
        useCapture = angular.isUndefined(useCapture) ? false : useCapture;
        $window.applicationCache.addEventListener(eventName, handler, useCapture);
      };

      self.removeEventListener = function(eventName, handler, useCapture) {
        useCapture = angular.isUndefined(useCapture) ? false : useCapture;
        $window.applicationCache.removeEventListener(eventName, handler, useCapture);
      };

      self.on  = self.addEventListener;
      self.off = self.removeEventListener;

      var statusTexts = {
        0: 'UNCACHED',
        1: 'IDLE',
        2: 'CHECKING',
        3: 'DOWNLOADING',
        4: 'UPDATEREADY',
        5: 'OBSOLETE'
      };
      self.status = $window.applicationCache.status;
      self.textStatus = statusTexts[$window.applicationCache.status];

      $rootScope.$watch(function() {
        return $window.applicationCache.status;
      }, function(change) {
        self.status = change;
        self.textStatus = statusTexts[change];
      });

      $window.applicationCache.addEventListener('error', function() { $rootScope.$digest(); }, false);
    } else {
      self.abortUpdate = function() { return false; };
      self.checkUpdate = unsupported;
      self.swapCache = unsupported;
      self.addEventListener = function() {};
      self.removeEventListener = function() {};
      self.on = function() {};
      self.off = function() {};
    }

    return self;
  }])
  .directive('appcacheCached',      directives.cached)
  .directive('appcacheChecking',    directives.checking)
  .directive('appcacheDownloading', directives.downloading)
  .directive('appcacheError',       directives.error)
  .directive('appcacheNoupdate',    directives.noupdate)
  .directive('appcacheObsolete',    directives.obsolete)
  .directive('appcacheUpdateready', directives.updateready);
})();