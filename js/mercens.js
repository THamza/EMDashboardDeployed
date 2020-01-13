$(document).ready(function () {

    let mercensTable = $('#mercensTable').DataTable({
        "language": {
            "emptyTable": "No data available in the table"
        },
        "paging": false,
        "searching": false,
        "info": false,
        "autoWidth": false,
        "columns": [
            {"bVisible": false, "targets": 0},
            {"width": "21%", "targets": 1},
            {"width": "22%", "targets": 2},
            {"width": "24%", "targets": 3},
            {"width": "21%", "targets": 4},
            {
                "data": null,
                "defaultContent": "<button id=\"showDetail\" type=\"button\" class=\"btn green-1\" style='max-width: 8%; background-color: darkgrey !important;'> Details </button>",
                "target": 5
            }
        ]
    });


    $.ajaxSetup({
        xhrFields: {
            withCredentials: true
        }
    });

    let nextUrl ;
    let currentUrl;
    let previousUrl;
    let current = 1;
    let totalPages = 1;

    $("#addMar").click(function () {
        $("#filter").css("display", "none");
        $("#addMarDiv").css("display", "block");
        $("#merRow").css("margin-top", "100px");
    });


    function addMer() {
        var mailMar, mailMarNew, nameMar, nameMarNew, countryMar, countryMarNew, passwordMar, passwordMarNew,
            repeatPassMar, repeatPassMarNew;

        mailMar = document.getElementById("mailMar");
        mailMarNew = mailMar.value;

        nameMar = document.getElementById("nameMar");
        nameMarNew = nameMar.value;

        countryMar = document.getElementById("countryMar");
        countryMarNew = countryMar.value;

        passwordMar = document.getElementById("passwordMar");
        passwordMarNew = passwordMar.value;

        repeatPassMar = document.getElementById("repeatPassMar");
        repeatPassMarNew = repeatPassMar.value;

        if (passwordMarNew === repeatPassMarNew) {
            var dataJson = {
                "email": mailMarNew,
                "name": nameMarNew,
                "country": countryMarNew,
                "password": passwordMarNew,
                "confirmPassword": repeatPassMarNew
            };
            var stringData = JSON.stringify(dataJson);

            $.ajax({
                headers: {
                    "Content-Type": "application/json"
                },
                data: stringData,
                type: "POST",
                url: localStorage.baseURL+"/merchants",
                complete: function(){
                    location.reload();
                },
                error: function(query) {
                    alert(query.responseJSON.error.message)
                }
            })
        }
        else {
            alert("Password not matching")
        }
    }
    $("#applyNewMar").click(addMer);

    function filterTable()   {
        var name, nameNew, country, countryNew, countryFilter;
        name = document.getElementById("name");
        nameNew = name.value;
        country = document.getElementById("country");
        countryNew = country.value;
        countryFilter = encodeURI(countryNew);
        console.log(countryFilter);

        $.ajax({
            url: localStorage.baseURL+"/merchants"+"?name="+nameNew+"&country="+countryFilter,
            type: "GET",
            success: renderQueries,
            beforeSend: function(){
                $('#loaderContainer').show();
                $('#pageContainer').hide();
            },
            complete: function(){
                $('#loaderContainer').hide();
                $('#pageContainer').show();
            }
        });

    }

    $("#applyFilter").click(filterTable);


    $.ajax({
        url: localStorage.baseURL+"/merchants",
        type: "GET",
        success: renderQueries,
        beforeSend: function(){
            $('#loaderContainer').show();
            $('#pageContainer').hide();
        },
        complete: function(){
            $('#loaderContainer').hide();
            $('#pageContainer').show();
        }
    });

    function renderQueries(Queries) {
        mercensTable.clear();
        nextUrl = Queries.data.meta.nextPage;
        if (Queries.data.meta.hasOwnProperty("totalPages")){
            totalPages = Queries.data.meta.totalPages;
            current = Queries.data.meta.currentPage;
        }
        else {
            totalPages = 1;
            current = 1;
        }
        currentUrl = localStorage.baseURL+"/merchants?page=";


        let storeData;
        for (let i in Queries.data.merchants) {
            let functionCall = Queries.data.merchants[i];
            if (i == 0) {
                storeData= JSON.stringify(functionCall);
            }
            else {
                storeData += JSON.stringify(functionCall);
            }
            localStorage.setItem(i, JSON.stringify(functionCall));

            let ID;
            if (functionCall.hasOwnProperty("id")){
                ID = functionCall.id;
            }
            else {
                ID = "-"
            }

            let email;
            if (functionCall.hasOwnProperty("email")){
                email = functionCall.email;
            }
            else {
                email = "-"
            }

            let name;
            if (functionCall.hasOwnProperty("name")){
                name = functionCall.name;
            }
            else {
                name = "-"
            }

            let country;
            if (functionCall.hasOwnProperty("country")){
                country = functionCall.country;
            }
            else {
                country = "-"
            }

            let date;
            if (functionCall.hasOwnProperty("date")){
                date = functionCall.date;
            }
            else {
                date = "-"
            }

            mercensTable.row.add([ID, date, name, email, country]).draw();

            $("#currentPage").text(current);
            $("#totalPages").text(totalPages);
        }

        mercensTable.draw();

        console.log(storeData);
        $("#currentPage").text("Page "+current);
        $("#totalPages").text(" / "+totalPages);

        if (current ===  totalPages && totalPages !== 1){
            $('#nextButton').prop('disabled', true);
            $('#previousButton').prop('disabled', false);
        }
        else if ( current === 1 && totalPages !== 1){
            $('#previousButton').prop('disabled', true);
            $('#nextButton').prop('disabled', false);
        }
        else if (current === totalPages && totalPages === 1){
            $('#nextButton').prop('disabled', true);
            $('#previousButton').prop('disabled', true);
        }
        else {
            $('#nextButton').prop('disabled', false);
            $('#previousButton').prop('disabled', false);
        }


    }

    function launchQueryWithoutTime(url) {

        $.ajax({
            url: url,
            success: renderQueries,
            beforeSend: function(){
                $('#loaderContainer').show();
                $('#pageContainer').hide();
            },
            complete: function(){
                $('#loaderContainer').hide();
                $('#pageContainer').show();
            }
        });

        function renderQueries(Queries) {

            mercensTable.clear();

            nextUrl = Queries.data.meta.nextPage;
            previousUrl = Queries.data.meta.currentPage;
            if (Queries.data.meta.hasOwnProperty("totalPages")){
                totalPages = Queries.data.meta.totalPages;
                current = Queries.data.meta.currentPage;
            }
            else {
                totalPages = 1;
                current = 1;
            }

            currentUrl = localStorage.baseURL+"/merchants" ;
            previousUrl = updateQueryStringParameter(currentUrl, "page", current-1);


            for (let i in Queries.data.merchants) {
                let functionCall = Queries.data.merchants[i];
                localStorage.setItem(i, JSON.stringify(functionCall));

                let ID;
                if (functionCall.hasOwnProperty("id")){
                    ID = functionCall.id;
                }
                else {
                    ID = "-"
                }

                let email;
                if (functionCall.hasOwnProperty("email")){
                    email = functionCall.email;
                }
                else {
                    email = "-"
                }

                let name;
                if (functionCall.hasOwnProperty("name")){
                    name = functionCall.name;
                }
                else {
                    name = "-"
                }

                let country;
                if (functionCall.hasOwnProperty("country")){
                    country = functionCall.country;
                }
                else {
                    country = "-"
                }

                let date;
                if (functionCall.hasOwnProperty("date")){
                    date = functionCall.date;
                }
                else {
                    date = "-"
                }


                mercensTable.row.add([ID, date, name, email, country]).draw();

                $("#currentPage").text(current);
                $("#totalPages").text(totalPages);
            }

            mercensTable.draw();

            $("#currentPage").text("Page "+current);
            $("#totalPages").text(" / "+totalPages);

            if (current ===  totalPages && totalPages !== 1){
                $('#nextButton').prop('disabled', true);
                $('#previousButton').prop('disabled', false);
            }
            else if ( current === 1 && totalPages !== 1){
                $('#previousButton').prop('disabled', true);
                $('#nextButton').prop('disabled', false);
            }
            else {
                $('#nextButton').prop('disabled', false);
                $('#previousButton').prop('disabled', false);
            }
        }
    }

    $('#previousButton').click(function () {
        launchQueryWithoutTime(previousUrl);
    });

    $('#nextButton').click(function () {
        launchQueryWithoutTime(nextUrl);
    });

    function updateQueryStringParameter(uri, key, value) {
        var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        var separator = uri.indexOf('?') !== -1 ? "&" : "?";
        if (uri.match(re)) {
            return uri.replace(re, '$1' + key + "=" + value + '$2');
        }
        else {
            return uri + separator + key + "=" + value;
        }
    }


    $('#mercensTable tbody').on( 'click', 'button', function () {
        let index = mercensTable.row($(this).parents('tr')).data();
        window.location = "./merchantDetail.html?q="+index[0];
    });

});