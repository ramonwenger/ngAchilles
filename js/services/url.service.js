(function () {
    "use strict";

    angular
        .module('achilles')
        .factory('urls', urls);

    function urls() {
        var protocol = "http://";
        //var baseUrl = "localhost";
        var baseUrl = achillesConfig.baseUrl;
        var port = achillesConfig.port;
        var routes = {
            biometricList: 'treatment/:treatment/biometriclist',
            biometricReport: 'biometricreport/process/:process',
            caseList: 'treatment/:treatment/caselist',
            catalogEntries: 'catalog/treatmententryrow/:row/col/:column/term/:term',
            catalogRow: 'catalog/treatmententryrow/:row',
            copyTreatment: 'treatment/copy',
            createPreset: 'preset/create',
            deletePreset: 'delete/preset',
            disabilityList: 'treatment/:treatment/disabilitylist',
            documentList: 'treatment/:treatment/documentlist',
            laboratoryList: 'treatment/:treatment/laboratorylist',
            laboratoryReport: 'laboratoryreport/process/:process',
            removeCase: 'treatment/:treatment/case/:case',
            renamePreset: 'preset/rename',
            treatment: 'treatment',
            treatmententry: 'treatmententry',
            treatmententryrow: 'treatmententryrow',
            treatmententrytype: 'treatmententrytype',
            treatmentpreset: 'put/treatmentpreset',
            treatmentlist: 'patient/:patient/treatmentlist',
            treatmentReport: 'treatmentreport/process/:process',
            treatmentsubject: 'treatmentsubject',
            gdtList: 'gdt/list',
            executeGDT: 'gdt/:device/patient/:patient',
            executeGDTTest: 'gdt/:device/patient/:patient/code/:test',
            lock: 'treatmententryrow/lock/:row/process/:process',
            user: 'user/process/:process',
            textblock: 'textblock/process/:process',
            presetList: 'treatmentpreset'
        };

        var service = {
            baseUrl: baseUrlComponent,
            biometricList: biometricList,
            biometricReport: biometricReport,
            caseList: caseList,
            catalogEntries: catalogEntries,
            catalogRow: catalogRow,
            copyTreatment: copyTreatment,
            createPreset: createPreset,
            deletePreset: deletePreset,
            disabilityList: disabilityList,
            documentList: documentList,
            laboratoryList: laboratoryList,
            laboratoryReport: laboratoryReport,
            removeCase: removeCase,
            renamePreset: renamePreset,
            treatmentEntryTypeList: treatmentEntryTypeList,
            treatmentEntry: treatmentEntry,
            treatmentEntryRow: treatmentEntryRow,
            treatmentPreset: treatmentPreset,
            treatmentList: treatmentList,
            treatmentSubject: treatmentSubject,
            treatment: treatment,
            treatmentReport: treatmentReport,
            gdtList: gdtList,
            executeGDT: executeGDT,
            lock: lock,
            user: user,
            textblock: textblock,
            presetList: presetList
        };

        return service;

        function baseUrlComponent() {
            return protocol + baseUrl + ':' + port + '/';
        }

        function caseList(treatmentId) {
            return baseUrlComponent() + routes.caseList.replace(/:([a-z]\w*)/gi, treatmentId) + '/';
        }

        function catalogEntries(term, row, column){
            return baseUrlComponent() + routes.catalogEntries
                .replace(/:term/, term)
                .replace(/:row/, row.id)
                .replace(/:column/, column.id) + (term > '' ? '/' : '');
        }

        function catalogRow(row){
            return baseUrlComponent() + routes.catalogRow
                .replace(/:row/, row.id) + '/';
        }

        function createPreset(){
            return baseUrlComponent() + routes.createPreset + '/';
        }

        function deletePreset(){
            return baseUrlComponent() + routes.deletePreset + '/';
        }

        function lock(row, process, verb){
            var verbComponent = '';
            if (verb) {
                verbComponent = verb + '/';
            }
            return baseUrlComponent() + verbComponent + routes.lock
                .replace(/:row/, row.id)
                .replace(/:process/, process) + '/';
        }

        function executeGDT(device, patient, test){
            return baseUrlComponent() + (test ? routes.executeGDTTest : routes.executeGDT)
                .replace(/:device/, device.id)
                .replace(/:patient/, patient)
                .replace(/:test/, test ? test.code : '') + '/';
        }

        function presetList(){
            return baseUrlComponent() + routes.presetList + '/';
        }

        function renamePreset(){
            return baseUrlComponent() + routes.renamePreset + '/';
        }

        function textblock(process){
            return baseUrlComponent() + routes.textblock.replace(/:process/, process) + '/';
        }

        function treatmentList(patientId) {
            //return 'http://localhost/ngachilles/json/demo.treatment.json';
            return baseUrlComponent() + routes.treatmentlist.replace(/:([a-z]\w*)/gi, patientId) + '/';
        }

        function treatmentEntryTypeList() {
            //return 'http://localhost/ngachilles/json/demo.treatmententrytype.json';
            return baseUrlComponent() + routes.treatmententrytype + '/';
        }

        function treatmentEntry() {
            return baseUrlComponent() + routes.treatmententry + '/';
        }

        function treatmentEntryRow(verb) {
            var verbComponent = '';
            if (verb) {
                verbComponent = verb + '/';
            }
            return baseUrlComponent() + verbComponent + routes.treatmententryrow + '/';
        }

        function treatmentPreset() {
            return baseUrlComponent() + routes.treatmentpreset + '/';
        }

        function treatmentSubject() {
            return baseUrlComponent() + routes.treatmentsubject + '/';
        }

        function treatment(verb) {
            var verbComponent = '';
            if (verb) {
                verbComponent = verb + '/';
            }
            return baseUrlComponent() + verbComponent + routes.treatment + '/';
        }

        function copyTreatment() {
            return baseUrlComponent() + routes.copyTreatment + '/';
        }

        function documentList(treatmentId) {
            return baseUrlComponent() + routes.documentList.replace(/:([a-z]\w*)/gi, treatmentId) + '/';
        }

        function gdtList() {
            return baseUrlComponent() + routes.gdtList + '/';
        }

        function laboratoryList(treatmentId) {
            return baseUrlComponent() + routes.laboratoryList.replace(/:([a-z]\w*)/gi, treatmentId) + '/';
        }

        function biometricList(treatmentId) {
            return baseUrlComponent() + routes.biometricList.replace(/:([a-z]\w*)/gi, treatmentId) + '/';
        }

        function disabilityList(treatmentId) {
            return baseUrlComponent() + routes.disabilityList.replace(/:([a-z]\w*)/gi, treatmentId) + '/';
        }

        function removeCase(treatment) {
            return baseUrlComponent() + routes.removeCase
                .replace(/:treatment/gi, treatment.id)
                .replace(/:case/gi, treatment.invoiceCase.id) + '/';
        }

        function biometricReport(process) {
            return baseUrlComponent() + routes.biometricReport
                .replace(/:process/gi, process) + '/';
        }

        function laboratoryReport(process) {
            return baseUrlComponent() + routes.laboratoryReport
                .replace(/:process/gi, process) + '/';
        }

        function treatmentReport(process) {
            return baseUrlComponent() + routes.treatmentReport
                .replace(/:process/gi, process) + '/';
        }

        function user(process, method){
            return baseUrlComponent() + (method ? method + '/' : '') + routes.user
                .replace(/:process/, process)  + '/';
        }
    }
})();