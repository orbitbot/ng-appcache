describe('a browser without applicationCache', function() {
  'use strict';

  beforeEach(module('ng-appcache', function($provide) {
    $provide.value('$window', {});
  }));

  var appcache;
  var $rootScope;

  beforeEach(inject(function(_appcache_, _$rootScope_) {
    appcache = _appcache_;
    $rootScope = _$rootScope_;
  }));

  it('gets offered all API methods', function() {
    expect(appcache).to.have.property('abortUpdate');
    expect(appcache).to.have.property('checkUpdate');
    expect(appcache).to.have.property('swapCache');
    expect(appcache).to.have.property('addEventListener');
    expect(appcache).to.have.property('removeEventListener');
    expect(appcache).to.have.property('on');
    expect(appcache).to.have.property('off');
  });

  it('gets all promises rejected', function(done) {
    function checkFail(reason) {
      expect(reason).to.equal('unsupported');
    }

    appcache.checkUpdate().catch(checkFail)
    .then(appcache.swapCache().catch(checkFail))
    .then(function() {
      done();
    });

    $rootScope.$digest();
  });

  it('returns false when abortUpdate is called', function() {
    var result = appcache.abortUpdate();
    expect(result).to.equal(false);
  });

  it('does not throw errors for unsupported methods', function() {
    function errorHandler(error) {
      expect(error).to.equal('impossible');
    }
    appcache.addEventListener('error', errorHandler);
    appcache.removeEventListener('error', errorHandler);
    appcache.on('error', errorHandler);
    appcache.off('error', errorHandler);
  });

  it('should have an undefined applicationCache.status', function() {
    expect(appcache.status).to.be.undefined();
  });

  it('should have an undefined applicationCache.textStatus', function() {
    expect(appcache.textStatus).to.be.undefined();
  });
});