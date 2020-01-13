
$(document).ready(function() {

    $("#buttonSignIn").click(function (e) {

        $("#warningBoxSignIn").hide();

        if( (! $("#emailIDSignIn").val().includes("@")) && ($("#emailIDSignIn").val().length >= 7)){

            $("#emailSignInWarning")
                .text("Please enter a valid email/ID.")
                .show();

        }

        if( $("#passwordSignIn").val().length < 8) {

            $("#passwordSignInWarning")
                .text("Please enter a valid password.")
                .show();
        }

        if( ($("#emailIDSignIn").val().includes("@") || ($("#emailIDSignIn").val().length < 7))&& $("#passwordSignIn").val().length >= 8 ){

            $.ajaxSetup({
                xhrFields: {
                    withCredentials: true
                }
            });

            let data = {
                "identity": $("#emailIDSignIn").val(),
                "password": $("#passwordSignIn").val()
            };


            let stringData = JSON.stringify(data);

            e.preventDefault();

            $.ajax({
                headers: {
                     'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                type: 'POST',
                url: "http://fye-em.aui.ma/signin",
                data: stringData,
                success: function (d) {
                  window.location.hashedID = d.data.hashedID;
                  window.location.appToken = d.data.appToken.value;
                  // window.open('./home.html' + d.data.hashedID + d.data.appToken.value);
                  window.location = './home.html' + "?h=" + d.data.hashedID + "&a=" + d.data.appToken.value;
                },
                error: function(jqXHR) {
                    $("#warningSignIn")
                        .val("Incorrect email/ID or password");
                    $("#warningBoxSignIn").show();
                    $("#buttonSignIn").prop('disabled', false);
                    $("#loader").hide();
                    $("#signin-content").show();

                },
                beforeSend: function(){
                    $("#buttonSignIn").prop('disabled', true);
                    $("#loader").show();
                    $("#signin-content").hide();
                },
            });
        }

    });

    $('#emailIDSignIn').keyup(function(e){

        if (e.which === 13) {
            $('#passwordSignIn').focus();
        }
        else{
            if(!$(this).val().includes("@") && $("#emailIDSignIn").val().length >= 7){
                $("#emailSignInWarning").show();
                $("#warningBoxSignIn").hide();

            }else{
                $("#emailSignInWarning").hide();
                $("#warningBoxSignIn").hide();

            }
        }
    });

    $('#passwordSignIn').keyup(function(e){

        if (e.which === 13) {
            $('#buttonSignIn').focus()
                .trigger('click');
        }
        else{
            if($(this).val().length < 8){
                $("#passwordSignInWarning").show();
                $("#warningBoxSignIn").hide();
            }else{
                $("#passwordSignInWarning").hide();
                $("#warningBoxSignIn").hide();
            }
        }
    });


});
