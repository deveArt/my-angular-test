describe('app', function () {

  beforeEach(module('app.common'));

  var $controller;
  var searchFilter;

  beforeEach(inject(function($filter) {
    searchFilter = $filter('searchFilter');
  }));

  describe('sum', function () {
		it('filter test', function () {
            console.log(searchFilter);

            expect(3).toBe(2);

		});	
	});

});