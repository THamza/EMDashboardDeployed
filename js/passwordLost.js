
$(document).ready(function() {

    $("#buttonResetPassword").click(function () {

        let data = {
            "email": $("#emailResetPassword").val()
        };
        let stringData = JSON.stringify(data);

        $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: stringData,
            success: function(response){
                console.log("SUcess");
                $("#currentEmail").text($("#emailResetPassword").val());

                $("#buttonResetPassword").hide();
                $("#textBeforeClick").hide();
                $("#emailResetPassword").hide();
                $("#textAfterClick").show();

            },
            error: function(jqXHR) {
                let responseObject = JSON.parse(jqXHR.responseText);
                $("#warningResetPassword")
                    .val("Email is not registered.");
                $("#warningResetPasswordBox").show();
            },
            type: 'POST',
            url: localStorage.baseURL + "/password-recovery"
        });


    });


});