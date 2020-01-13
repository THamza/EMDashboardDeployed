
if(window.location.href.includes("?plan=")){
    if (window.location.href.includes("free")) {
        $("#control_free").prop("checked", true);
    }
    else {
        $("#control_premium").prop("checked", true);
    }
}



$(document).ready(function() {

    $.ajaxSetup({
        xhrFields: {
            withCredentials: true
        }
    });

    function signUpPremium() {

        $("#warningBoxSignUp").hide();

        let data;
        if ($("#referralSignUp").val() !== ""){
            data = {
                "email": $("#emailSignUp").val().toString(),
                "password": $("#passwordSignUp").val().toString(),
                "confirmPassword": $("#passwordConfirmSignUp").val(),
                "referralCode": $("#referralSignUp").val()
            };
        }else{
            data = {
                "email": $("#emailSignUp").val().toString(),
                "password": $("#passwordSignUp").val().toString(),
                "confirmPassword": $("#passwordConfirmSignUp").val()
            };
        }

        let stringData = JSON.stringify(data);

        $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: stringData,
            success: function(response){
                localStorage.activationToken = response.data.activationToken;
                localStorage.activationEmail = $("#emailSignUp").val().toString();
                window.location = './emailActivation.html'
            },
            error: function(jqXHR) {
                let responseObject = JSON.parse(jqXHR.responseText);

                if (responseObject.error.code === 310){
                    $("#referralSignUpWarning").hide();
                    $("#warningSignUp")
                        .val("Passwords do not match");
                    $("#warningBoxSignUp").show();
                }
                else if (responseObject.error.code === 60) {
                    $("#warningBoxSignUp").hide();
                    $("#referralSignUpWarning").show();

                }
                else {
                    $("#referralSignUpWarning").hide();
                    $("#warningSignUp")
                        .val(responseObject.error.message);
                    $("#warningBoxSignUp").show();
                }
                $("#loader").hide();
                $("#login-content").show();

            },
            beforeSend: function(){
                $("#loader").show();
                $("#login-content").hide();
            },
            type: 'POST',
            url: localStorage.baseURL + "/signup-premium"
        });
    }

    function signUpFree() {

        $("#warningBoxSignUp").hide();

        let data;
        if ($("#referralSignUp").val() !== ""){
            data = {
                "email": $("#emailSignUp").val().toString(),
                "password": $("#passwordSignUp").val().toString(),
                "confirmPassword": $("#passwordConfirmSignUp").val(),
                "referralCode": $("#referralSignUp").val()
            };
        }else{
            data = {
                "email": $("#emailSignUp").val().toString(),
                "password": $("#passwordSignUp").val().toString(),
                "confirmPassword": $("#passwordConfirmSignUp").val()
            };
        }


        let stringData = JSON.stringify(data);

        $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: stringData,
            success: function(response){
                localStorage.activationToken = response.data.activationToken;
                localStorage.activationEmail = $("#emailSignUp").val().toString();
                window.location = './emailActivation.html'
            },
            error: function(jqXHR) {
                let responseObject = JSON.parse(jqXHR.responseText);
                if (responseObject.error.code === 310){
                    $("#referralSignUpWarning").hide();
                    $("#warningSignUp")
                        .val("Passwords do not match");
                    $("#warningBoxSignUp").show();
                }
                else if (responseObject.error.code === 60) {
                    $("#warningBoxSignUp").hide();
                    $("#referralSignUpWarning").show();
                }
                else {
                    $("#referralSignUpWarning").hide();
                    $("#warningSignUp")
                        .val(responseObject.error.message);
                    $("#warningBoxSignUp").show();
                }
                $("#loader").hide();
                $("#login-content").show();

            },
            beforeSend: function(){
                $("#loader").show();
                $("#login-content").hide();
            },
            type: 'POST',
            url: localStorage.baseURL + "/signup-free"
        });
    }


    $("#buttonSignUp").click(function () {

        let plan = $("input[name='select']:checked").val();

        if( !$("#emailSignUp").val().includes("@")) {
            $("#emailSignUpWarning").show();
        }
        if( $("#passwordSignUp").val().length < 8) {
            $("#passwordSignUpWarning")
                .text("Please ensure your password is at least 8 characters long.")
                .show();

        }
        if( $("#passwordConfirmSignUp").val() !== $("#passwordSignUp").val() || $("#passwordConfirmSignUp").val().length < 8 ) {
            $("#passwordConfirmSignUpWarning")
                .text("Please verify that your passwords are matching.")
                .show();

        }

        if (!plan){
            $("#planSignUpWarning")
                .show();
        }

        if( $("#emailSignUp").val().includes("@") && $("#passwordSignUp").val().length > 7 && $("#passwordConfirmSignUp").val() === $("#passwordSignUp").val() && !plan === false ){
            switch (plan){
                case "1":
                    signUpFree();
                    break;
                case "2":
                    signUpPremium();
                    break;
            }

        }



    });


    $("input[name='select']").change(function () {
        $("#planSignUpWarning")
            .hide();
    });


    $('#emailSignUp').keyup(function(e){

        if (e.which === 13) {
            $('#passwordSignUp').focus();
        }
        else{
            if($(this).val() == ''){
                $("#emailSignUpWarning").show();
                $("#warningBoxSignUp").hide();
            }else{
                $("#emailSignUpWarning").hide();
                $("#warningBoxSignUp").hide();
            }
        }

    });

    $('#passwordSignUp').keyup(function(e){

        if (e.which === 13) {
            $('#passwordConfirmSignUp').focus();
        }
        else{
            if($(this).val() == ''){
                $("#passwordSignUpWarning")
                    .text("Please enter a password.")
                    .show();
                $("#warningBoxSignUp").hide();
            }else if ($(this).val().length < 8){
                $("#passwordSignUpWarning")
                    .text("Please ensure your password is at least 8 characters long.")
                    .show();
                $("#warningBoxSignUp").hide();
            }else{
                $("#passwordSignUpWarning").hide();
                $("#warningBoxSignUp").hide();
            }
        }



    });

    $('#passwordConfirmSignUp').keyup(function(e){

        if (e.which === 13) {
            $('#referralSignUp').focus();
        }
        else{
            if($(this).val() == ''){
                $("#passwordConfirmSignUpWarning").show();
                $("#warningBoxSignUp").hide();
            }else{
                $("#passwordConfirmSignUpWarning").hide();
                $("#warningBoxSignUp").hide();

            }
        }

    });


    $('#referralSignUp').keyup(function(e){

        if (e.which === 13) {
            $('#buttonSignUp').focus()
                .trigger('click');
        }

    });


});