/* jshint -W040 */
(function () {
    "use strict";

    angular
        .module('achilles')
        .directive('treatmentColumn', treatmentColumn);

    treatmentColumn.$inject = ['$http', 'urls', '$timeout', '$compile', 'CurrentFocus', 'Locking', 'Treatment', 'TreatmentRow'];

    function treatmentColumn($http, urls, $timeout, $compile, CurrentFocus, Locking, Treatment, TreatmentRow) {
        var templates = {
            editable: '<div ng-class="columnClass" catalog-prompt>' +
                '<div class="form-group">' +
                '<div ng-model="content" ta-disabled="readonly()" text-angular ta-target-toolbars="toolbar-{{treatment.id}}-{{type.id}}"></div>' +
                '</div>' +
                '</div>',
            readonly: '<div ng-class="columnClass"><p ng-bind-html="readonlyContent" class="read-only-content"></p></div>'
        };

        var directive = {
            restrict: 'E',
            scope: {
                width: '@',
                column: '=',
                content: '=',
                readonly: '&',
                //parent: '=',
                row: '=',
                uniqueId: '@',
                treatment: '=',
                warning: '=',
                type: '=',
                entry: '='
            },
            require: ['^treatment', '^treatmentEntry'],
            controller: TreatmentColumnController,
            link: link
        };

        var promise;

        return directive;

        function getTemplate(editable) {
            return editable == 'true' ? templates.editable : templates.readonly;
        }

        function link(scope, element, attrs, ctrls) {
            var treatmentCtrl = ctrls[0];
            var entryCtrl = ctrls[1];
            scope.columnClass = 'col-xs-' + attrs.width;

            element.on('blur', '.ta-bind', blur);
            element.on('keydown', '.ta-bind', keydown);
            element.on('focus', '.ta-bind', focus);
            element.on('click', '.ta-bind', click);
            element.on('keyup', '.ta-bind', keyup);
            element.on('focusout', focusout);
            attrs.$observe("editable", setTemplate);

            // change the template if the 'editable' attribute changes
            setTemplate(attrs.editable);

            scope.$watch(CurrentFocus.getNewlyFocusedRow, function (val) {
                if (val && scope.row.id == val.id) {
                    //console.log('yes!', val);
                    // TODO: make editable if not already so
//                    if(attrs.editable!='true'){
//                        console.log('not true');
//                        attrs.editable = true;
//                        //setTemplate(true);
//                        //scope.$apply();
//                    }
                    var input = element.find('.ta-bind:not(.ta-readonly)');
                    input.eq(0).focus();
                    //console.log('focusing', input);
                    // todo: remove this and the functions it calls
                    var node = getAsteriskNode(input);

                    if (node) {
                        //console.log(node);
                        var range = document.createRange();
                        var index = node.nodeValue.indexOf('*');
                        range.setStart(node, index);
                        range.setEnd(node, index + 1);
                        var selection = window.getSelection();
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                }
            });

            function setTemplate(editable) {
                element.html(getTemplate(editable)).show();
                $compile(element.contents())(scope);
            }

            function blur(e) {
                if (angular.element(this).hasClass('ng-dirty') && !scope.row.locked) {
                    //$http.put(urls.treatmentEntryRow(), scope.row).then(function (response) {
                    //PUT/POST-workaround
                    TreatmentRow.save(scope.row, scope.entry);
                }

                $timeout(function () {
                    scope.entry.focused = false;
                },150);

                $timeout.cancel(promise);
            }

            function keydown(e) {
                // if the row is locked, prevent the action of every key except for some key combinations
                if (scope.row.locked &&
                    isModifyingInput(e)
                    ) {
                    e.preventDefault();
                } else
                // Ctrl + Shift + Backspace
                if (e.ctrlKey && e.shiftKey && e.which == 8) {
                    //see if there is a previous textarea element in the same entry. If there is, focus on it
                    var prevRow = element.parents('.row').prev().find('.ta-bind:not(:disabled)');
                    var nextRow = element.parents('.row').next().find('.ta-bind:not(:disabled)');
                    var prevEntry = element.parents('treatment-entry').prev().find('.ta-bind:not(:disabled)');
                    var nextEntry = element.parents('treatment-entry').next().find('.ta-bind:not(:disabled)');
                    $timeout(function () {
                        if (prevRow.length) {
                            prevRow.eq(0).focus();
                        } else if (prevEntry.length) {
                            prevEntry.eq(0).focus();
                        } else if (nextRow.length) {
                            nextRow.eq(0).focus();
                        } else {
                            nextEntry.eq(0).focus();
                        }
                    }, 150);
                    entryCtrl.removeRow(scope.row, scope.entry, scope.treatment.entries);
                // Escape
                } else if(e.keyCode == 27){
                    entryCtrl.cancelCatalog = true;
                }else
                // Ctrl + Enter
                if (e.ctrlKey && e.which == 13) {
                    // save the current row
                    TreatmentRow.save(scope.row, scope.entry);
                    // also, add a row of the same type as the currently focused one
                    Treatment.addEntry(scope.treatment.id, scope.entry.type, scope.treatment.entries);
                } else {
                    if (!scope.row.hasOwnLock && isModifyingInput(e)) {
                        Locking.lock(scope.row);
                    }
                }
            }

//            function keyup(e){
//                /*
//                 todo: objective: save the current selection position in the element for the asterisk search.
//                 does not seem possible at the moment
//                 */
////                var range = document.createRange();
////                var selection = window.getSelection();
////                var input = element.find('.ta-bind:not(.ta-readonly)');
////                var nodes = getAsteriskNodes(input);
//
//                //console.log(scope.content.replace(/<[^>]*>/gm, ''));
//            }

            // hide the catalog when losing focus
            function focusout(){
                $timeout(function(){
                    entryCtrl.showCatalog = false;
                }, 150);
            }

            function keyup(e){
                //console.log(scope.column);
                if(isModifyingInput(e)){
                    entryCtrl.lookupCatalogEntries(scope.content.replace(/<[^>]*>/gm, ''), scope.row, scope.column);
                }
            }

            function focus() {
                entryCtrl.showCatalog = true;
                entryCtrl.setCatalog(scope.row);

                CurrentFocus.setCurrentFocus(scope.column, scope.row, scope.entry);
                CurrentFocus.clearNewFocus();
                if (scope.warning && !scope.warning.displayed) {
                    toastr.warning(scope.warning.message);
                    scope.warning.displayed = true;
                }
                // todo: save focus position and try to apply it after the row is reloaded due to an updated row
                //var selection = $window.getSelection();
                //console.log(selection);
                promise = $timeout(function () {
                    Locking.check(scope.row);
                }, 450);

                $timeout(function () {
                    scope.entry.focused = true;
                }, 250);
            }

            function click(e) {
                //console.log(scope.readonly);
                if (scope.readonly() && scope.warning && !scope.warning.displayed) {
                    toastr.error(scope.warning.message);
                    scope.warning.displayed = true;
                }
            }

            function getAsteriskNode(jElement) {
                if (!jElement.length) {
                    return null;
                }
                var htmlElement = jElement[0];
                return recursiveGetAsteriskNode(htmlElement);
            }

            function getAsteriskNodes(jElement) {
                if (!jElement.length) {
                    return null;
                }
                var htmlElement = jElement[0];
                var nodes = [];
                recursiveGetAsteriskNodes(htmlElement, nodes);
                return nodes;
            }

            function recursiveGetAsteriskNode(node) {
                for (var i = 0; i < node.childNodes.length; i++) {
                    var currentNode = node.childNodes[i];
                    if (currentNode.nodeType == 3) {
                        if (currentNode.nodeValue.indexOf('*') >= 0) {
                            return currentNode;
                        }
                    } else {
                        var subResult = recursiveGetAsteriskNode(currentNode);
                        if (subResult) {
                            return subResult;
                        }
                    }
                }
                return null;
            }

            function recursiveGetAsteriskNodes(node, nodes){
                for(var i = 0; i < node.childNodes.length; i++){
                    var currentNode = node.childNodes[i];
                    if (currentNode.nodeType == 3) {
                        if (currentNode.nodeValue.indexOf('*') >= 0) {
                            nodes.push(currentNode);
                        }
                    } else {
                        var subResult = recursiveGetAsteriskNodes(currentNode, nodes);
                        if (subResult) {
                            nodes.push(subResult);
                        }
                    }
                }
                return;
            }

            // detect whether the pressed key modifies the input field
            function isModifyingInput(e) {
                return (
                    // tab key
                    e.which != 9 &&
                        // cursor keys
                        !(e.which >= 37 && e.which <= 40) &&
                        // Ctrl + A
                        !(e.ctrlKey && e.which == 65 ) &&
                        // Ctrl + C
                        !(e.ctrlKey && e.which == 67 )
                    );
            }

        }

    }

    TreatmentColumnController.$inject = ['$scope', '$sce'];
    function TreatmentColumnController($scope, $sce) {
        // we have to sanitize the content if we just want to display it with html tags
        $scope.readonlyContent = $sce.trustAsHtml($scope.content);
    }
})();