//var achillesConfig = {
//    process: 1234,
//    patient: 70219
//};
//TODO: remove the debug values after the || when going live
var achillesConfig = {
    process: parseInt(getURLParameter("process")) || 1234,
    patient: parseInt(getURLParameter("patient")) || 1369,
    port: 36611,
    baseUrl: '192.168.1.107'
};
function getURLParameter(name) {
    return (new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20')||null
}