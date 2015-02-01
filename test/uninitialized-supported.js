describe('a browser with an uninitialized applicationCache', function() {
  beforeEach(module('ng-appcache'));

  var appcache;
  var $rootScope;
  var $q;

  beforeEach(inject(function(_appcache_, _$rootScope_, _$q_) {
    appcache = _appcache_;
    $rootScope = _$rootScope_;
    $q = _$q_;
  }));

  it('gets offered all API methods', function() {
    expect(appcache).to.have.property('abortUpdate');
    expect(appcache).to.have.property('checkUpdate');
    expect(appcache).to.have.property('addEventListener');
    expect(appcache).to.have.property('removeEventListener');
    expect(appcache).to.have.property('on');
    expect(appcache).to.have.property('off');
    expect(appcache).to.have.property('abortUpdate');
    expect(appcache).to.have.property('swapCache');
  });

  it('rejects promise methods', function(done) {
    function checkFail(reason) {
      expect(reason).to.match(/InvalidStateError|INVALID_STATE_ERR/);
    }

    // This is required to allow PhantomJS tests, since 
    // window.applicationCache.abort() is undefined
    function wrapAbort() {
      try {
        return appcache.abortUpdate().catch(checkFail);
      } catch (e) {
        expect(e.message).to.match(/^'undefined'/);
      }
    }

    $q.all([
      wrapAbort(),
      appcache.checkUpdate().catch(checkFail),
      appcache.swapCache().catch(checkFail)
    ])
    .then(function() {
      done();
    });

    $rootScope.$digest();
  });

});