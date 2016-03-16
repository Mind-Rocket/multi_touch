// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

})

/* .directive('multitouch', function () {
    return function(scope, element, attr) {
        element.on('touchstart', function() {
            scope.$apply(function() {
                scope.$eval(attr.multitouch);
            });
        });
		
		element.on('touchend', function() {
            scope.$apply(function() {
                scope.$eval(attr.multitouch);
				console.log('touch ended');
            });
        });
    };
}); */


.factory('clickHandler', ['$interval', '$rootScope', '$location', '$document', function ($interval, $rootScope, $location, $document) {
// Service logic
// ...

$document = $document[0];



var
  touchStart,
  touchEnd;

touchStart = ('ontouchstart' in $document.documentElement) ? 'touchstart' : 'mousedown';
touchEnd = ('ontouchend' in $document.documentElement) ? 'touchend' : 'mouseup';
var clickState = {
  yT:         false,
  pT:         false,
  ready:      false,
  watching:   false,
  watcher:    false,
  startEvent: touchStart,
  endEvent:   touchEnd
};

// Public API here
return {
  setClickState: function (which, what) {
    clickState[which] = what;
	
	console.log(clickState);
  },

  getClickState: function (which) {
    return clickState[which]
  },

  getReadyState: function () {
    return ( (clickState.yT) && (clickState.pT) );
  },

  watchForReady: function () {
    var self = this;

    //prevent multiple redundant watchers

    if (clickState.watching) {
      return;
    }

    clickState.watching = $interval(function () {
      clickState.ready = self.getReadyState();
    }, 50);

    clickState.watcher = $rootScope.$watch(function () {
      return clickState.ready
    }, function redirect(newValue) {
      if (newValue) {
        self.stopWatching();
		alert('Success');
        //$location.path('/scan');
      }
    })
  },

  stopWatching: function () {
    if (clickState.watching) {
      $interval.cancel(clickState.watching);
      clickState.watcher();
      clickState.watching = false;
      clickState.watcher = false;

    }
  },

  getTouchEvents: function () {
    return {
      start: clickState.startEvent,
      end:   clickState.endEvent
    }
  }




  };
}])

.directive('simultaneousTouch', ['clickHandler', '$document','$interval', function (clickHandler, $document, $interval) {
  return {
    restrict: 'A',
    link:     function (scope, elem, attr) {
      var touchEvents = clickHandler.getTouchEvents();
	  console.log(touchEvents);
	  scope.downFor = 0;
	  scope.downFor2 = 0;
	  var promise, promise2;
	  elem.on(touchEvents.start, function () {
		//console.log('mousedown'+attr.simultaneousTouch);
		if (attr.simultaneousTouch == "yT"){
			promise = $interval(function(){
				scope.downFor += 100;
				//console.log('downFor: '+downFor);
			},100);
		}else if (attr.simultaneousTouch == "pT"){
			promise2 = $interval(function(){
				scope.downFor2 += 100;
				//console.log('downFor2: '+downFor2);
			},100);
		}
		
        //clickHandler.watchForReady();
        //clickHandler.setClickState(attr.simultaneousTouch, true);
      });
	  
	   elem.on(touchEvents.end, function () {
		
		
		if (attr.simultaneousTouch == "yT"){
			scope.downFor = 0;
			$interval.cancel(promise);
		}else if (attr.simultaneousTouch == "pT"){
			scope.downFor2 = 0;
			$interval.cancel(promise2);
		}
		
        //clickHandler.stopWatching();
        //clickHandler.setClickState(attr.simultaneousTouch, false);
      });
	  
	  elem.on('touchmove',function(){
		if (attr.simultaneousTouch == "yT"){
			scope.downFor = 0;
			$interval.cancel(promise);
		}else if (attr.simultaneousTouch == "pT"){
			scope.downFor2 = 0;
			$interval.cancel(promise2);
		}
	  });
	  
     /*  elem.on(touchEvents.start, function () {
		console.log('touch start');
        clickHandler.watchForReady();
        clickHandler.setClickState(attr.simultaneousTouch, true);
      });

      elem.on(touchEvents.end, function () {
        clickHandler.stopWatching();
        clickHandler.setClickState(attr.simultaneousTouch, false);
      }) */
    }
  }
}]);
