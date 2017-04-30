angular
    .module('app.common')
    .filter('searchFilter', searchFilter);

function searchFilter() {
    return function (items, searchWord, curFields, insens, exact) {console.log(curFields);
        return items.filter(function (item) {

            let swEscaped = searchWord.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
            let regex = new RegExp(exact? '^'+swEscaped+'$': swEscaped, insens? 'i': '');

            if (!angular.equals({Name: false, Type: false, 'Designed by': false}, curFields)) {

                let matches = [];
                for(let field in curFields) {
                    if (curFields[field]) {
                        matches.push(regex.test(item[field]));
                    }
                }

                return matches.some(function (match) {
                    return match === true;
                });
            }

            return regex.test(item.Name) || regex.test(item.Type) || regex.test(item['Designed by']);
        });
    };
}
