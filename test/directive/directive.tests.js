describe('an appcache directive', function() {
  beforeEach(module('ng-appcache'));

  var $rootScope;
  var $compile;
  var $timeout;
  var element;

  beforeEach(inject(function(_$rootScope_, _$compile_, _$timeout_) {
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    $timeout = _$timeout_;
  }));

  it('is initially hidden', function() {
    element = angular.element('<appcache-noupdate></appcache-noupdate>');

    $compile(element)($rootScope);
    $rootScope.$digest();

    expect(element.hasClass('ng-hide')).to.equal(true);
  });

  it('is shown when a related appcache event fires', function(done) {
    element = angular.element('<appcache-noupdate></appcache-noupdate>');

    $compile(element)($rootScope);
    $rootScope.$digest();

    expect(element.hasClass('ng-hide')).to.equal(true);

    window.applicationCache.update();

    setTimeout(function() {
      expect(element.hasClass('ng-hide')).to.equal(false);
      done();
    }, 50);
  });

  it('will be hidden again if the dismiss-on-click attribute is specified', function(done) {
    element = angular.element('<appcache-noupdate dismiss-on-click></appcache-noupdate>');

    var compiled = $compile(element)($rootScope);
    $rootScope.$digest();

    expect(element.hasClass('ng-hide')).to.equal(true);

    window.applicationCache.update();

    setTimeout(function() {
      expect(element.hasClass('ng-hide')).to.equal(false);
      compiled.triggerHandler('click');
      expect(element.hasClass('ng-hide')).to.equal(true);
      done();
    }, 50);
  });

  it('will be hidden automatically if the dismiss-delay attribute is specified', function(done) {
    element = angular.element('<appcache-noupdate dismiss-delay="40"></appcache-noupdate>');

    var compiled = $compile(element)($rootScope);
    $rootScope.$digest();

    expect(element.hasClass('ng-hide')).to.equal(true);

    window.applicationCache.update();

    setTimeout(function() {
      expect(element.hasClass('ng-hide')).to.equal(false);
      $timeout.flush();
      expect(element.hasClass('ng-hide')).to.equal(true);
      done();
    }, 20);
  });
});