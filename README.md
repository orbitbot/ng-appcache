# ng-appcache
[![Build Status](https://travis-ci.org/orbitbot/ng-appcache.svg?branch=master)](https://travis-ci.org/orbitbot/ng-appcache)

```ng-appcache``` is an [AngularJS](https://angularjs.org/) module for working with the application cache. The module offers both a service for appcache interaction and utility directives for all states. ```ng-appcache``` fails silently if a browser does not have [appcache support](http://caniuse.com/#feat=offline-apps), so it is safe to use, and the implementation is fully testable by mocking the ```$window``` service.

```ng-appcache``` aims to work wherever the appcache is available, so please file an issue if you run into problems.


<br />
## Installation

  1) Look in the ```dist``` subfolder, or if you have [bower](http://bower.io/) installed (if you don't, you probably want to) just run
```bash
$ bower install ng-appcache
```
  2) Include the downloaded file in your base html file
``` html
<script src="path/to/appcache.js"></script>
<!-- or -->
<script src="path/to/appcache.min.js"></script>
```
  3) And finally include the module as a dependency for your angular app:
``` js
angular.module('myApp', ['ng-appcache']);
```  

<br />
## Service API

Include ```appcache``` as a dependency for your angular component, eg.

```js
angular.controller('MyCtrl', function(appcache) {

  appcache.checkUpdate().then(function() {
    alert('There\'s an update available!');
  });
  // ...
});
```  

The service offers the following API:

##### appcache.abortUpdate()
Abort an ongoing appcache download. If an appcache update is ongoing and is successfully canceled, the function will return ```true```, in all other cases this function will return ```false``` and have no other effect. 

##### appcache.checkUpdate()
Manually check if a new application cache is available, and automatically download it if so. This function returns a ```$q``` promise, which will be resolved when the update is ready to be applied, or will be rejected if no update is available.

**N.B.** browsers usually automatically check for updates when pages are (re-)loaded, so calling this function immediately on pageload is probably unnecessary.

##### appcache.swapCache()
If an appcache update is already downloaded, after a call to this method any requests for cached content will return new versions instead of the ones available from the cache. This function returns a ```$q``` promise that will be rejected if no cache is available, or resolved otherwise (success).

**N.B.** the internet suggests that it is probably safer to do a full pageload when you have an appcache update downloaded, so that there are no mixed resource versions in use.

##### appcache.addEventListener(eventName, handler, useCapture)
Register a function _handler_ which will be executed when _eventName_ fires. See [this reference](http://www.quirksmode.org/js/events_order.html) for an explanation of the _useCapture_ parameter.

_eventName_ can be one of ```'cached', 'checking', 'downloading', 'error', 'noupdate', 'obsolete', 'progress'``` or ```'updateready'```.

##### appcache.removeEventListener(eventName, handler, useCapture)
Remove function _handler_ previously registered to be executed when _eventName_ fires. _handler_ must refer to a named function or a stored variable containing a function, otherwise this call will have no effect.

##### appcache.on(...)
Syntactic sugar for .addEventListener, accepts the same parameters.

##### appcache.off(...)
Syntactic sugar for .removeEventListener, accepts the same parameters.

##### appcache.textStatus
A string representation of the current appcache state. ```appcache.textStatus``` will be one of ```'UNCACHED', 'IDLE', 'CHECKING', 'DOWNLOADING', 'UPDATEREADY'``` or ```'OBSOLETE'```.

##### appcache.status
A numerical representation of the current appcache state which matches the constants provided by ```window.applicationCache.status``` and is expressed textually by ```appcache.textStatus```.

<br />
### Unsupported browsers
In the case of a browser that does not support appcache, calls to  

    appcache.abortUpdate()

will return ```false```

    appcache.checkUpdate()
    appcache.swapCache()

will return a rejected promise, 
    
    appcache.addEventListener()
    appcache.removeEventListener()
    appcache.on()
    appcache.off()

will have no effect, and
    
    appcache.status and
    appcache.textStatus

will be ```undefined```.

<br />
## Directives

With ```ng-appcache``` installed, you can use the following directives:

``` html
<appcache-cached>
<appcache-checking>
<appcache-downloading>
<appcache-error>
<appcache-noupdate>
<appcache-obsolete>
<appcache-updateready>
```

All directives can also be specified as attributes, eg ```<div appcache-noupdate>```. Any content inside the directives will initially hidden (using the ```ng-hide``` class), and become visible if the corresponding appcache event fires. 

By adding the ```dismiss-on-click``` or ```dismiss-delay``` (or both) attributes to any directive, the directive content can be hidden again. ```dismiss-on-click``` will hide content on a mouseclick, and ```dismiss-delay``` takes a millisecond parameter which specifies the delay before the content will be hidden again.

**Example:**  
``` html
<appcache-error dismiss-on-click dismiss-delay="2500"></appcache-error>
```
The example directive will initially be hidden, and become visible if an appcache error event occurs. 2,5 seconds later the content will be hidden, or before that if a user clicks the directive.

<br />
## Application cache resources

The appcache can be [a douchebag](http://alistapart.com/article/application-cache-is-a-douchebag), so have a look at some of the following helpful articles if you're not already familiar with the details:
 
  - http://www.html5rocks.com/en/tutorials/appcache/beginner/
  - https://developer.mozilla.org/en-US/docs/Web/HTML/Using_the_application_cache
  - http://diveintohtml5.info/offline.html
  - http://alistapart.com/article/application-cache-is-a-douchebag
  - http://caniuse.com/#feat=offline-apps

<br />
## Developing

```ng-appcache``` has been developed using [Gulp](http://gulpjs.com/), with a minimal CI setup. To get started, run

```bash
$ npm install
```

... which will set up a development environment with PhantomJS for automated testing and a server for manual testing on other browsers. After this, the following gulp tasks are available:

  - ```gulp build```: copy and minify source file into the ```dist``` folder
  - ```gulp test```: run all tests once against the ```dist``` folder contents
  - ```gulp develop```: automatically run ```build``` task and jshint reporting when source file is saved, run tests when test files are saved or the ```dist``` folder content changes

<br />
Because of how the appcache works, you will need to clear the browser cache whenever changing filenames or including new files in the ```index-with-appcache.html``` file.

  - to clear the cache, temporarily move or rename the ```test/test.appcache``` file and run ```gulp test``` once. When PhantomJS requests the manifest file, it will get a 404 response and delete the cache.
  - alternatively, see the guide [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Using_the_application_cache#Storage_location_and_clearing_the_offline_cache) for instructions on how to clear the cache on desktop browsers.

PhantomJS does not currently offer any alternatives to the first approach (moving the manifest file), so changes are a bit cumbersome.

<br />
## License

Everything is covered by the MIT license, so wear it, share it, tear it and throw it away.
