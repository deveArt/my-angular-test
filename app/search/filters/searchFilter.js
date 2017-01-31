angular
    .module('app')
    .filter('searchFilter', searchFilter);

function searchFilter() {
    return function (items, searchWord, curField) {
        return items.filter(function (item) {

            var swEscaped = searchWord.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
            var regex = new RegExp(swEscaped, 'i');

            if (item[curField] !== undefined) {
                return regex.test(item[curField]);
            }

            return regex.test(item.Name) || regex.test(item.Type) || regex.test(item['Designed by']);

        });
    };
}
