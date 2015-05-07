/* jshint -W040 */
(function () {
    "use strict";

    angular
        .module('achilles')
        .directive('treatmentEntry', treatmentEntry);

    function treatmentEntry() {
        var directive = {
            scope: {
                entry: '=',
                editable: '@',
                treatment: '=',
                permissionToEdit: '&',
                warning: '='
            },
            restrict: 'E',
            templateUrl: '../js/templates/treatment-entry.tpl.html',
            require: '^treatment',
            controller: TreatmentEntryController,
            link: link
        };

        return directive;

        function link(scope, element, attrs, treatmentCtrl) {
            scope.removeEntry = treatmentCtrl.removeEntry;
        }
    }

    TreatmentEntryController.$inject = ['$scope', '$http', 'urls'];
    function TreatmentEntryController($scope, $http, urls) {
        var dc = this;

        dc.setEntryFocus = setEntryFocus;
        dc.makePristine = makePristine;
        dc.removeRow = removeRow;

        function setEntryFocus(focused) {
            $scope.entry.focused = focused;
        }

        function makePristine() {
            $scope.entryform.$setPristine();
        }

        function removeRow(row) {
            var rows = $scope.entry.rows;
            //$http.delete(urls.treatmentEntryRow() + row.id)
            //PUT/DELETE-workaround
            $http.post(urls.treatmentEntryRow('delete') + row.id)
                .then(function () {
                    for (var i = 0; i < rows.length; i++) {
                        if (rows[i].id == row.id) {
                            rows.splice(i, 1);
                            break;
                        }
                    }
                    if (rows.length === 0) {
                        //There are now more rows left, delete the entry now
                        $scope.removeEntry($scope.entry);
                    }
                });
        }
    }
})();