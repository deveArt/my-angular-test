module.exports = function(config) {
  config.set({

    basePath: './app',

    files: [
      'components/**/*.js',
      'view*/**/*.js'
    ],

    autoWatch: true,

    frameworks: ['jasmine'],

    browsers: ['Chrome'],

    plugins: [
      'karma-chrome-launcher',
//      'karma-firefox-launcher',
      'karma-jasmine'
    ],


  });
};