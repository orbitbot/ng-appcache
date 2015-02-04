# ng-appcache
[![Build Status](https://travis-ci.org/orbitbot/ng-appcache.svg?branch=master)](https://travis-ci.org/orbitbot/ng-appcache)

```ng-appcache``` is an [AngularJS](https://angularjs.org/) module for working with the application cache. The module offers both a service for appcache interaction and utility directives for all states. ```ng-appcache``` fails silently if a browser does not have [appcache support](http://caniuse.com/#feat=offline-apps), so it is safe to use, and the implementation is fully testable by mocking the ```$window``` service.

```ng-appcache``` tries to offer full cross-browser support, so please file an issue if you run into problems.


<br />
## Installation

  1. Look in the ```dist``` subfolder, or if you have [bower](http://bower.io/) installed (if you don't, you probably want to but just haven't heard about it yet), run  
```bash
$ bower install ng-appcache
```
  
  2. Include the downloaded file in your base html file:  
``` html
<script src="path/to/appcache.js"></script>
<!-- or -->
<script src="path/to/appcache.min.js"></script>
```

  3. And finally include the module as a dependency for your angular app:  
``` js
angular.module('myApp', ['ng-appcache']);
```  

<br />
## Service API

<br />
## Directives

<br />
## Application cache resources

The appcache can be [a douchebag](http://alistapart.com/article/application-cache-is-a-douchebag), so have a look at some of the following helpful articles if you're not familiar with the details
 
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

... which will set up a development environment with PhantomJS for automated testing and a server for manual testing on other browsers. After this, the following ```gulp``` tasks are available:

  - ```gulp build```: copy and minify source file into the ```dist``` folder
  - ```gulp test```: run all tests once against the ```dist``` folder contents
  - ```gulp develop```: automatically run ```build``` task and jshint reporting when source file is saved, run tests when test files are saved or the ```dist``` folder content changes

Because of how the appcache works, you will need to clear the browser cache whenever changing filenames or including new files in the ```index-with-appcache.html``` file.

  - all browsers: To clear the cache, temporarily move or rename the ```test.appcache``` file in the ```test``` folder and run ```gulp test``` once. When PhantomJS requests the manifest file, it will get a 404 response and delete the cache.
  - for clearing the cache  through browser menus, see the guide [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Using_the_application_cache#Storage_location_and_clearing_the_offline_cache).

PhantomJS does not currently offer any alternatives to the approach of moving the manifest file, so changes are a bit cumbersome.

<br />
## License

Everything is covered by the MIT license, so wear it, share it, tear it and throw it away.