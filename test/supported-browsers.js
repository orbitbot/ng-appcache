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

    it('should display the appcache status');


  });
});
