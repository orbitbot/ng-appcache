describe('on a page without a manifest link', function() {
  'use strict';

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
      expect(appcache).to.have.property('swapCache');
      expect(appcache).to.have.property('addEventListener');
      expect(appcache).to.have.property('removeEventListener');
      expect(appcache).to.have.property('on');
      expect(appcache).to.have.property('off');
    });

    it('rejects promise methods', function(done) {
      var count = 0;

      function checkFail(reason) {
        expect(reason).to.match(/InvalidStateError|INVALID_STATE_ERR/);
        count += 1;
      }

      $q.all([
        appcache.abortUpdate().then(function() { count += 1; }),
        appcache.checkUpdate().catch(checkFail),
        appcache.swapCache().catch(checkFail)
      ])
      .then(function() {
        expect(count).to.equal(3);
        done();
      });

      $rootScope.$digest();
    });

    it('should display applicationCache.status as UNCACHED', function() {
      expect(appcache.status).to.equal('UNCACHED');
    });

  });
});
