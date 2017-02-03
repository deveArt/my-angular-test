angular
    .module('app')
    .filter('searchFilter', searchFilter);

function searchFilter() {
    return function (items, searchWord, curField, insens) {
        return items.filter(function (item) {
console.log(insens);
            var swEscaped = searchWord.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
            var regex = new RegExp(swEscaped, insens? 'i': '');

            if (item[curField] !== undefined) {
                return regex.test(item[curField]);
            }

            function (insens) {
                return item.stone_name.toLowerCase() == $scope.propertyName.toLowerCase();
            }
            return regex.test(item.Name) || regex.test(item.Type) || regex.test(item['Designed by']);

        });
    };
}
