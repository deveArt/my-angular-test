describe('search', function () {
    
    var searchFilter,
        searchController,
        scope,
        httpBackend,
        testData = [
            {
                Name: 'Test 1 name',
                Type: 'test type 1',
                'Designed by': 'some tester 1'
            },
            {
                Name: 'Test 2 name',
                Type: 'test type 2',
                'Designed by': 'some tester 2'
            },
            {
                Name: 'Test 3 name',
                Type: 'test type 3',
                'Designed by': 'some tester 3'
            }
        ];
    
    beforeEach(function() {
        module('app.common');
        module('app.search');
    });

    beforeEach(inject(function($filter, $rootScope, $componentController, $httpBackend) {
        searchFilter = $filter('searchFilter');
        scope = $rootScope.$new();
        searchController = $componentController('search', {$scope: scope});

        httpBackend = $httpBackend;
        httpBackend
            .when('GET', 'http://dcodeit.net/angularTest/data.json')
            .respond(200, testData);
    }));

    it('search component load the data', function (done) {
        console.log('load start');

        searchController.load().then(function (response) {
            testData = response.data;
            console.log(testData);
            done();
        }).catch(function (err) {
            throw new Error('load error');
        });

        httpBackend.flush();
    });

    it('filter test search word', function () {
        console.log(searchFilter);
        console.log(testData);

        var searchWord = 'test type 2';
        var res = searchFilter(testData, searchWord, searchFilter.fields);
        
        expect(res.length).toBe(1);
        expect(res[0].Type).toBe(searchWord);
    });

});