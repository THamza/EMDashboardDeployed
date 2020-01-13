$(document).ready(function () {
    // let myParamVar = urlParams.get('myParam');
    url_string = window.location.href;

    var url = new URL(url_string);
    var hashedID = url.searchParams.get("h");
    var appToken = url.searchParams.get("a");
    


    $.ajaxSetup({
        xhrFields: {
            withCredentials: true
        }
    });

    $.ajax({
        url: localStorage.baseURL+"/account-info",
        type: "GET",
        success: getName
    });

    function getName(query) {
        var name;
        name = query.data.accountInfo.displayName;
        document.getElementById("welcome").innerHTML = "Welcome " + name.toUpperCase();
    }
});
