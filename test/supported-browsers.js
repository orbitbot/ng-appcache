describe('on a page with a manifest link', function() {
  'use strict';

  describe('a browser with applicationCache', function() {
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

    it('should display the appcache status', function() {
      expect(appcache.status).to.equal('IDLE');
    });


    it('should reject promises fired in the wrong state', function(done) {
      var count = 0;

      function checkFail(reason) {
        expect(reason).to.match(/InvalidStateError|INVALID_STATE_ERR/);
        count += 1;
      }

      $q.all([
        appcache.abortUpdate().then(function() { count += 1; }),
        appcache.swapCache().catch(checkFail)
      ])
      .then(function() {
        expect(count).to.equal(2);
        done();
      });
      $rootScope.$digest();
    });

    it('should reject checkUpdate promise', function(done) {
      appcache.checkUpdate()
      .catch(function() {
        done();
      });
    });

    describe('eventlisteners', function() {
      var noupdateCounter = 0;

      function checkListener(doneFn) {
        noupdateCounter += 1;
        doneFn();
      }

      afterEach(function() {
        expect(noupdateCounter).to.equal(1);
      });

      it('should fire listeners for appcache events', function(done) {
        appcache.on('noupdate', checkListener(done));
        window.applicationCache.update();
      });

      it('should allow removing event listeners', function(done) {
        appcache.off('noupdate', checkListener);
        appcache.on('noupdate', function() {
          setTimeout(done, 300);
        });
        window.applicationCache.update();
      });
    });
  });
});
