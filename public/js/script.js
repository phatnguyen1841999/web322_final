
$(document).ready(function () {
    if ($("#reg_err").length > 0) {
        $("#myModal").modal('show');
    }
    if ($("#login_err").length > 0) {
        $("#myModal1").modal('show'); 
    }
});


/*$(document).ready(function () {
    if ($(".isa_warning").length > 0) {
        $("#myModal1").modal('show');
    }
});*/


$('#dob').datepicker({
    uiLibrary: 'bootstrap4'
});




