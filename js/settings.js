$(function() {
    
    url_string = window.location.href;
    var url = new URL(url_string);
    var hashedID = url.searchParams.get("h");
    var appToken = url.searchParams.get("a");
    

    $(init);

    function init() {

        $.ajaxSetup({
            xhrFields: {
                withCredentials: true
            }
        });
        initPage();

    }


    function initPage() {

        $.ajax({
            url: localStorage.baseURL+"/account-info",
            success: fillProfile,
            beforeSend: function(){
                $('#loaderContainer').show()
            },
            complete: function(){
                $('#loaderContainer').hide();
                $('#pageContainer').show();
            }
        });

        function fillProfile(query) {
            $("#emailAccount").val(query.data.accountInfo.email);
            // $("#refCodeAccount").val(query.data.accountInfo.referralCode);
            // $("#typeAccount").val(capitalizeFirstLetter(query.data.accountInfo.planName));
            // $("#callLimitAccount").val(query.data.accountInfo.funcLimit.toLocaleString());
            // $("#expiryDateAccount").val(query.data.accountInfo.planExpiryDate);


            // readonly="readonly"

            if($("#typeAccount").val() === 'Free'){
                $("#changeBillingName").attr("readonly","readonly");
                $("#changeAddressOne").attr("readonly","readonly");
                $("#changeAddressTwo").attr("readonly","readonly");
                $("#changeCountry").attr("readonly","readonly");
                $("#changeCity").attr("readonly","readonly");
                $("#changePostCode").attr("readonly","readonly");
                $("#buttonShowBillingContainer").attr("disabled",true);
            }


            else {
                console.log(query.data.accountInfo);
                if (query.data.accountInfo.hasOwnProperty("billingAddress")){
                    $("#billingNameAccount").val(query.data.accountInfo.billingName);
                    $("#addressOneAccount").val(query.data.accountInfo.billingAddress.addressLine1);
                    $("#countryAccount").val(query.data.accountInfo.billingAddress.postcode);
                    $("#cityAccount").val(query.data.accountInfo.billingAddress.city);
                    $("#postCodeAccount").val(query.data.accountInfo.billingAddress.country);
                    if (query.data.accountInfo.billingAddress.hasOwnProperty("addressLine2")) {
                        $("#addressTwoAccount").val(query.data.accountInfo.billingAddress.addressLine2);
                    }
                }
            }


        }

    }


    $("#buttonSubmitPassword").click(function () {
        let currentPassword = $("#currentPassword").val();
        let newPassword = $("#newPassword").val();
        let confirmNew = $("#confirmNewPassword").val();

        $("#currentPasswordWarning").hide();
        $("#confirmNewPasswordWarning").text("Password fields do not match").hide();
        $("#newPasswordWarning").hide();


        if (currentPassword ==="" && newPassword === "" && confirmNew ==="")
        {
            $("#confirmNewPasswordWarning")
                .text("Please fill in all required fields.")
                .show();
        }
        else if (currentPassword.length < 8) {
            $("#currentPasswordWarning").show();
        }
        else if (currentPassword.length < 8) {
            $("#newPasswordWarning").show();
        }
        else {
            if (confirmNew !== newPassword) {
                $("#confirmNewPasswordWarning").show();
            }
            else {
                $("#modalChangePassword").modal('show');
                $("#currentPasswordWarning").hide();
                $("#confirmNewPasswordWarning").hide();
                $("#newPasswordWarning").hide();
            }
        }
    });

    $("#buttonConfirmPasswordChange").click(function () {
        let currentPassword = $("#currentPassword").val();
        let newPassword = $("#newPassword").val();
        let confirmNew = $("#confirmNewPassword").val();

        $("#currentPasswordWarning").hide();
        $("#confirmNewPasswordWarning").hide();
        $("#newPasswordWarning").hide();

        if ( newPassword.length < 8){
            $("#currentPasswordWarning").show();
        }
        else {
            if (confirmNew !== newPassword){
                $("#confirmNewPasswordWarning").show();
            }
            else {

                let data = {
                    "currentPassword": currentPassword,
                    "newPassword": newPassword,
                    "confirmPassword": confirmNew
                };


                let stringData = JSON.stringify(data);

                $.ajax({
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    data: stringData,
                    success: function(response){
                        location.reload();
                    },
                    error: function(jqXHR) {
                        let responseObject = JSON.parse(jqXHR.responseText);

                        if (responseObject.error.code === 311 || responseObject.error.code === 313){
                            $("#currentPasswordWarning").show();
                        }
                        else if (responseObject.error.code === 310) {
                            $("#confirmNewPasswordWarning").show();
                        }
                        else if (responseObject.error.code === 314 || responseObject.error.code === 316) {
                            $("#confirmNewPasswordWarning").show();
                        }
                        $("#modalChangePassword").modal('hide');
                        $("#confirmNewPassword").val("");

                    },
                    beforeSend: function(){
                        $('#loaderSupportContainer').show();
                        $("#buttonConfirmPasswordChange").prop('disabled', true);
                    },
                    complete: function(){
                        $('#loaderSupportContainer').hide();
                        $("#buttonConfirmPasswordChange").prop('disabled', false);
                    },
                    type: 'PUT',
                    url: localStorage.baseURL + "/password"
                });
            }
        }

    });

    $("#changepass").click(function () {
        var currentPass, newPass, repeatNewPass, currentPassVal, newPassVal, repeatNewPassVal;
        currentPass = document.getElementById("currentPass");
        currentPassVal = currentPass.value;
        newPass = document.getElementById("newPass");
        newPassVal = newPass.value;
        repeatNewPass = document.getElementById("repeatNewPass");
        repeatNewPassVal = repeatNewPass.value;

        if (newPassVal === repeatNewPassVal){
            var dataJson = {
                "currentPassword": currentPassVal,
                "newPassword": newPassVal,
                "confirmPassword": repeatNewPassVal
            };

            var stringData = JSON.stringify(dataJson);

            $.ajax({
                headers: {
                    "Content-Type": "application/json"
                },
                data: stringData,
                type: "PUT",
                url: localStorage.baseURL+"/password",
                // complete: function(){
                //     location.reload();
                // }
            })
        }
        else {
            alert("Passwords not matching")
        }
    });


    $("#submitBilling").click(function () {
        let billingName = $("#changeBillingName").val();
        let addressOne = $("#changeAddressOne").val();
        let postcode = $("#changePostCode").val();
        let city  = $("#changeCity").val();
        let country = $("#changeCountry").val();
        let addressTwo = $("#changeAddressTwo").val();

        let data ;

        if (addressTwo !== ""){
            data = {
                "billingName": billingName,
                "addressLine1": addressOne,
                "addressLine2": addressTwo,
                "postcode": postcode,
                "city": city,
                "country": country
            }
        } else {
            data = {
                "billingName": billingName,
                "addressLine1": addressOne,
                "postcode": postcode,
                "city": city,
                "country": country
            }
        }


        let stringData = JSON.stringify(data);

        $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            data: stringData,
            success: function(response){
                location.reload();
            },
            error: function(jqXHR) {
                let responseObject = JSON.parse(jqXHR.responseText);
                switch (responseObject.error.code) {
                    case 336:
                        $("#billingNameWarning").show();
                        $("#billingCityWarning").hide();
                        $("#billingAddressOneWarning").hide();
                        $("#billingCountryWarning").hide();
                        $("#billingPostCodeWarning").hide();
                        break;
                    case 337:
                        $("#billingNameWarning").hide();
                        $("#billingCityWarning").hide();
                        $("#billingAddressOneWarning").show();
                        $("#billingCountryWarning").hide();
                        $("#billingPostCodeWarning").hide();
                        break;
                    case 338:
                        $("#billingNameWarning").hide();
                        $("#billingCityWarning").hide();
                        $("#billingAddressOneWarning").hide();
                        $("#billingCountryWarning").hide();
                        $("#billingPostCodeWarning").show();
                        break;
                    case 339:
                        $("#billingNameWarning").hide();
                        $("#billingCityWarning").show();
                        $("#billingAddressOneWarning").hide();
                        $("#billingCountryWarning").hide();
                        $("#billingPostCodeWarning").hide();
                        break;
                    case 340:
                        $("#billingNameWarning").hide();
                        $("#billingCityWarning").hide();
                        $("#billingAddressOneWarning").hide();
                        $("#billingCountryWarning").show();
                        $("#billingPostCodeWarning").hide();
                        break;

                }
            },
            type: 'PUT',
            url: localStorage.baseURL + "/billing-info"
        });


    })


    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    $("#buttonShowBillingContainer").click(function () {
        $("#billingContainer").show();
    })

    $("#buttonShowPasswordContainer").click(function () {
        $("#passwordContainer").show();
    })


    $('#currentPassword').keyup(function(){
        if($(this).val() == ''){
            $("#currentPasswordWarning")
                .text("Please enter your current password")
                .show();
        }else if ($(this).val().length < 8){
            $("#currentPasswordWarning")
                .text("Please ensure your password is at least 8 characters long")
                .show();
        }else{
            $("#currentPasswordWarning").text("Wrong current password").hide();
        }
    });

    $('#newPassword').keyup(function(){
        if($(this).val() == ''){
            $("#newPasswordWarning")
                .text("Please enter your new password")
                .show();
        }else if ($(this).val().length < 8){
            $("#newPasswordWarning")
                .text("Please ensure your password is at least 8 characters long")
                .show();
        }else{
            $("#newPasswordWarning").hide();
        }
    });

    $('#confirmNewPassword').keyup(function(){
        if($(this).val() == ''){
            $("#confirmNewPasswordWarning")
                .text("Please confirm your password")
                .show();
        }else if ($(this).val() !== $('#newPassword').val()){
            $("#confirmNewPasswordWarning")
                .text("Please ensure your passwords are matching")
                .show();
        }else{
            $("#confirmNewPasswordWarning").hide();
        }
    });






});