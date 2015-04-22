(function(){
    "use strict";

    angular
        .module('achilles')
        .directive('treatmentRow', treatmentRow);

    treatmentRow.$inject = ['$timeout'];
    function treatmentRow($timeout) {
        var directive = {
            link: link
        };

        return directive;

        function link(scope, element) {

            if (scope.row.new == true) {
                $timeout(function () {
                    var textarea = element.find('textarea:not(:disabled)').eq(0);
                    textarea.focus();
                }, 150);
            }
        }
    }
})();