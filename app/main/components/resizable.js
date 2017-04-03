angular
    .module('app')
    .component('resizable', {
        controller: ResizableController
    });

  function ResizableController($element) {
      var $ctrl = this;

      $ctrl.$postLink = init;

      function init() {
          $element.on('mouseenter', function (e) {
              showControls();
          });

          $element.on('mouseleave', function (e) {
              removeControls();
          });
      }


      function showControls() {
          var overlayData = $element[0].getBoundingClientRect();
          var width = 50;
          var height = 50;
          var overlayElement = angular.element('<div class="resize-ctrl" id="resize-corner"></div>').css({
              'background-color': '#000',
              position: 'absolute',
              left: overlayData.width - width + 'px',
              top: overlayData.height - height + 'px',
              width: width + 'px',
              height: height + 'px'
          });

          $element.append(overlayElement);
      }

      function removeControls() {
          var resizeElements = document.getElementsByClassName('resize-ctrl');
          angular.element(resizeElements).remove();
      }
  }
