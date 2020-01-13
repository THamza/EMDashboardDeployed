
$(document).ready(function() {
    $("#currentEmailBefore").text(localStorage.activationEmail);
    $("#currentEmailAfter").text(localStorage.activationEmail);

    $("#buttonResendActivation").click(function () {

        let data = {
            "activationToken": localStorage.activationToken
        };
        let stringData = JSON.stringify(data);

        $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: stringData,
            success: function(response){

                $("#buttonResendActivation").hide();
                $("#textBeforeClick").hide();
                $("#textAfterClick").show();


            },
            error: function(jqXHR) {
                let responseObject = JSON.parse(jqXHR.responseText);
            },
            type: 'POST',
            url: localStorage.baseURL + "/activation/resend-email"
        });


    });


});