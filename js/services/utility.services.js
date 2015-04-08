(function () {
    "use strict";

    angular
        .module('achilles')
        .factory('urls', urls)

    function urls(){
        var protocol = "http://";
        var baseUrl = "localhost";
        //var baseUrl = "192.168.1.145";
        var port = "37114";
        var routes = {
            treatmentlist: 'patient/:patient/treatmentlist',
            treatmententry: 'treatmententry',
            treatmententryrow: 'treatmententryrow',
            treatmententrytype: 'treatmententrytype',
            treatment: 'treatment'
        };

        var factory = {
            treatmentList: treatmentList,
            treatmentEntryTypeList: treatmentEntryTypeList,
            treatmentEntry: treatmentEntry,
            treatmentEntryRow: treatmentEntryRow,
            treatment: treatment
        };

        return factory;

        function baseUrlComponent(){
            return protocol+baseUrl+':'+port+'/';
        }

        function treatmentList(patientId){
            return 'http://localhost/ngachilles/json/demo.treatment.json';
            //return baseUrlComponent()+routes.treatmentlist.replace(/:([a-z]\w*)/gi, patientId)+'/';
        }

        function treatmentEntryTypeList(){
            //return 'http://localhost/ngachilles/json/demo.treatmententrytype.json';
            return baseUrlComponent()+routes.treatmententrytype+'/';
        }

        function treatmentEntry(){
            return baseUrlComponent()+routes.treatmententry+'/';
        }

        function treatmentEntryRow(){
            return baseUrlComponent()+routes.treatmententryrow+'/';
        }

        function treatment(){
            return baseUrlComponent()+routes.treatment+'/';
        }
    }
})();