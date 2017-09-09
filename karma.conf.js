module.exports = function(config) {
  config.set({
    //basePath: './test',
    files: [
        "node_modules/angular/angular.js",
        "node_modules/angular-ui-router/release/angular-ui-router.min.js",
        "node_modules/angular-cookies/angular-cookies.js",
        "node_modules/angular-messages/angular-messages.js",
        "node_modules/angular-mocks/angular-mocks.js",
        'app/*module.js',
        'app/**/*module.js',
        'app/*!(module).js',
        'app/**/*!(module).js',
        'test/**/*.js'
    ],
    failOnEmptyTestSuite: false,
    autoWatch: true,
    frameworks: ['jasmine'],
    browsers: ['Chrome'],
    plugins: [
      'karma-chrome-launcher',
//    'karma-firefox-launcher',
      'karma-jasmine'
    ],
    logLevel: config.LOG_INFO,
    browserConsoleLogOptions: {
        level: "",
        terminal: true
    },
    browserNoActivityTimeout: 10000
  });
};