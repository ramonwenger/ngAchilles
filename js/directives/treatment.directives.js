(function () {
    "use strict";

    angular
        .module('achilles')
        .directive('treatment', treatment)
        .directive('treatmentEntry', treatmentEntry)
        .directive('treatmentRow', treatmentRow)
        .directive('treatmentColumn', treatmentColumn);
//        .directive('treatmentType', treatmentType);

    function treatment() {
        var directive = {
            scope: {
                treatment: '=',
                treatments: '=treatmentlist'
            },
            restrict: 'A',
            controller: controller,
            controllerAs: 'dc',
            templateUrl: '../js/templates/treatment.tpl.html',
            link: link
        };

        return directive;

        controller.$inject = ['$scope', '$http', '$modal', 'urls', 'EntryType',
            'TreatmentContext', 'Subject', 'Document', 'LaboratoryReport', 'Biometric', 'DisabilityCertificate'];
        function controller($scope, $http, $modal, urls, EntryType, TreatmentContext, Subject, Document, LaboratoryReport, Biometric, DisabilityCertificate) {
            var dc = this,
                treatmentId = $scope.treatment.id;

            dc.newEntry = {
                type: null
            }

            EntryType.all()
                .then(function (types) {
                    dc.types = types;
                });
            Subject.all()
                .then(function (subjects) {
                    dc.subjects = subjects;
                });

            dc.loadDocuments = loadDocuments;
            dc.loadLaboratoryReports = loadLaboratoryReports;
            dc.loadBiometrics = loadBiometrics;
            dc.loadDisability = loadDisability;

            dc.baseUrl = urls.baseUrl();


            dc.addTreatment = TreatmentContext.addTreatment;
            dc.copyTreatment = TreatmentContext.copyTreatment;
            dc.deleteTreatment = TreatmentContext.deleteTreatment;
            dc.changeStatus = TreatmentContext.changeStatus;
            dc.changeSubject = TreatmentContext.changeSubject;

//            $scope.addAttribute = function (treatment, position) {
//                console.log('called');
//                if (!treatment.entries) treatment.entries = [];
//                var entry = {
//                    treatmentId: treatment.id
//                };
//                if (position == 'first') {
//                    treatment.entries.unshift(entry);
//                } else {
//                    treatment.entries.push(entry);
//                }
//            };

            dc.removeEntry = function (entry) {
                var entries = $scope.treatment.entries;
                for (var i = 0; i < entries.length; i++) {
                    if (entry.type.id == entries[i].type.id) {
                        entries.splice(i, 1);
                        break;
                    }
                }
            }

            // add an entry to a treatment, and add it to the list of entries or replace
            // the existing one with the same type id
            dc.addEntry = function (treatmentId, type, entries) {
                //entry: {treatmentId: <id>, type: <type object>}
                $http.post(urls.treatmentEntry(), {
                    treatmentId: treatmentId,
                    type: type
                }).then(function (response) {
                    var entry = response.data,
                        replaced = false;
                    for (var i = 0; i < entries.length; i++) {
                        if (entry.type.id == entries[i].type.id) {
                            console.log('already in list');
                            entries[i] = entry;
                            replaced = true;
                            break;
                        }
                    }
                    if (!replaced) {
                        entries.push(entry);
                    }
                    dc.newEntry = {};
                });
            }

            dc.testModal = function () {
                var modalInstance = $modal.open({
                    templateUrl: '../js/templates/preset-modal.tpl.html',
                    controller: 'PresetModalController',
                    controllerAs: 'mc',
                    size: 'lg'

                });
            }

            function loadDocuments(open) {
                //only load the documents if the dropdown was opened, and the documents were not already loaded before
                if (open && !dc.documents) {
                    Document.list(treatmentId)
                        .then(function (documents) {
                            dc.documents = documents;
                        }, function (error) {
                            //TODO: remove after testing
                            console.error(error.statusText);
                            dc.documents = [
                                {id: 1, name: 'War & Peace'},
                                {id: 2, name: 'Skin Game'}
                            ];
                        });

                }
            }

            function loadLaboratoryReports(open) {
                //only load the lab reports if the dropdown was opened, and the lab reports were not already loaded before
                if (open && !dc.laboratoryReports) {
                    LaboratoryReport.list(treatmentId)
                        .then(function (laboratoryReports) {
                            dc.laboratoryReports = laboratoryReports;
                        }, function () {
                            //dc.laboratoryReports = [];
                        });

                }
            }

            function loadBiometrics(open) {
                //only load the biometrics if the dropdown was opened, and the biometrics were not already loaded before
                if (open && !dc.biometrics) {
                    Biometric.list(treatmentId)
                        .then(function (biometrics) {
                            dc.biometrics = biometrics;
                        }, function () {
                            //TODO: handle this case

                        });

                }
            }

            function loadDisability(open) {
                //only load the disability if the dropdown was opened, and the disability were not already loaded before
                if (open && !dc.disabilityCertificates) {
                    DisabilityCertificate.list(treatmentId)
                        .then(function (disabilityCertificates) {
                            dc.disabilityCertificates = disabilityCertificates;
                        }, function () {
                            //TODO: handle this case
                        });

                }
            }
        }

        function link(scope, element, attribute, ctrl) {
            element.on('keydown', function (e) {
                //console.log(e.which);
                //F9
                if (e.which == 120) {
                    element.find('.type-select input').select2('open');
                }
                if (e.which == 121) {
                    ctrl.testModal();
                }
            });
            //console.log(element.find('.type-select input').select2('open'));
            //element.find('.type-select input').select2('open');
        }
    }

    function treatmentEntry() {
        var directive = {
            scope: {
                entry: '='
            },
            restrict: 'E',
            templateUrl: '../js/templates/treatment-entry.tpl.html',
            require: '^treatment',
            controller: controller,
            link: link
        };

        return directive;

        controller.$inject = ['$scope', '$http', 'urls'];
        function controller($scope, $http, urls) {
            var dc = this;

            dc.makePristine = function () {
                $scope.entryform.$setPristine();
            }

            dc.removeRow = function (row) {
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
                        if (rows.length == 0) {
                            //There are now more rows left, delete the entry now
                            $scope.removeEntry($scope.entry)
                        }
                    });
            }
        }

        function link(scope, element, attrs, treatmentCtrl) {
            scope.removeEntry = treatmentCtrl.removeEntry;
        }
    }

    treatmentRow.$inject = ['$timeout'];
    function treatmentRow($timeout) {
        var directive = {
            link: link
        };

        return directive;

        function link(scope, element) {
            if (scope.row.new == true) {
                $timeout(function () {
                    var textarea = element.find('textarea').eq(0);
                    textarea.focus();
                }, 50);
            }
        }
    }

    treatmentColumn.$inject = ['$http', 'urls', '$timeout'];

    function treatmentColumn($http, urls, $timeout) {
        var directive = {
            restrict: 'E',
            scope: {
                width: '@',
                content: '=',
                readonly: '@',
                parent: '=',
                row: '=',
                uniqueId: '@'
            },
            require: ['^treatment', '^treatmentEntry'],
            templateUrl: '../js/templates/treatment-column.tpl.html',
//            template: '<div ng-class="columnClass"><div class="form-group"><input class="form-control" ng-model="content" ng-disabled="{{readonly}}"></div></div>',
            link: link
        };

        return directive;

        function link(scope, element, attrs, ctrls) {
            var treatmentCtrl = ctrls[0];
            var entryCtrl = ctrls[1];
            scope.columnClass = 'col-xs-' + attrs.width;

            var textarea = element.find('textarea');
            textarea.on('blur', function (e) {
                if (textarea.hasClass('ng-dirty')) {
                    console.log(scope.row);
                    //$http.put(urls.treatmentEntryRow(), scope.row).then(function (response) {
                    //PUT/POST-workaround
                    $http.post(urls.treatmentEntryRow('put'), scope.row).then(function (response) {
                        //response.data is a row
                        //now, find the row in the rows and replace it
                        var row = response.data,
                            rows = scope.parent.rows;
                        for (var i = 0; i < rows.length; i++) {
                            if (rows[i].id == row.id) {
                                rows[i] = row;
                                break;
                            }
                        }
                        ;
                        //treatmentCtrl.setEntry(response.data);
                    });
                }
            });

            textarea.on('keydown', function (e) {
                if (e.ctrlKey && e.shiftKey && e.which == 8) {
                    //see if there is a previous textarea element in the same entry. If there is, focus on it
                    $timeout(function () {
                        var prev = element.parent().prev().find('textarea');
                        console.log(prev.length);
                        if (prev.length) {
                            prev.eq(0).focus();
                        } else {
                            //if no previous element is found, look for the next one
                            element.parent().next().find('textarea').eq(0).focus()
                        }

                    }, 150);
                    entryCtrl.removeRow(scope.row);
                }
            });

//            var editor,
//                toolbar = element.find('.wysihtml-toolbar');
//
//
//            textarea.on('focus', function () {
//                if (!editor) {
//                    console.log(textarea.attr('id'));
//                    console.log(toolbar.attr('id'));
//                    var editor = new wysihtml5.Editor(textarea.attr('id'), {
//                        toolbar: toolbar.attr('id'),
//                        parserRules: wysihtml5ParserRules
//                    });
//                }
//            });
        }
    }

})();