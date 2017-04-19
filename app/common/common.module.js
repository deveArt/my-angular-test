angular
    .module('app.common', [
        'ui.router',
        'app.router',
        'ngCookies',
        'ngMessages'
    ])
    .run(commonInit);

commonInit.$inject = ['globalVars'];
function commonInit(globalVars) {
    globalVars.setVar('color', 'success');
}
