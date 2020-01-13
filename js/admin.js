$(document).ready(function () {

    url_string = window.location.href;
    var url = new URL(url_string);
    var hashedID = url.searchParams.get("h");
    var appToken = url.searchParams.get("a");
    
    
    $.ajaxSetup({
        xhrFields: {
            withCredentials: true
        }
    });

    let adminsTable = $('#adminsTable').DataTable({
        "language": {
            "emptyTable": "No data available in the table"
        },
        "paging": false,
        "searching": false,
        "info": false,
        "autoWidth": false,
        "columns": [
            { "bVisible": false, "targets": 0 },
            { "width": "29%", "targets": 1 },
            { "width": "29%", "targets": 2 },
            { "width": "29%", "targets": 3 },
            { "width": "29%", "targets": 4 },
            { "width": "29%", "targets": 5 },
            {
                "data": null,
                "defaultContent": "<button id=\"moreInfoBtn\" type=\"button\" class=\"btn green-1\" style='max-width: 8%; background-color: #19b1b8 !important;'> Deactivate </button>",
                "target": 4
            }
        ]
    });

//    let adminsTableTwo = $('#adminsTableTwo').DataTable({
//        "language": {
//            "emptyTable": "No data available in the table"
//        },
//        "paging": false,
//        "searching": false,
//        "info": false,
//        "autoWidth": false,
//        "columns": [
//            { "bVisible": false, "targets": 0 },
//            { "width": "29%", "targets": 1 },
//            { "width": "29%", "targets": 2 },
//            { "width": "29%", "targets": 3 },
//            {
//                "data": null,
//                "defaultContent": "<button id=\"changeStatusBtn2\" type=\"button\" class=\"btn green-1\" style='max-width: 8%'> Activate </button>",
//                "target": 4
//            }
//        ]
//    });

    $("#addAdmin").click(function () {
        $("#addAdmin").css("display", "none");
        $("#addAdminDiv").css("display", "block");
    });

function newAdmin() {
    var admName, admMail, admPass, admReaPass, admNameNew, admMailNew, admPassNew, admReaPassNew;
    admMail = document.getElementById("mailAdmin");
    admMailNew = admMail.value;
    admName = document.getElementById("nameAdmin");
    admNameNew = admName.value;
    admPass = document.getElementById("passwordAdmin");
    admPassNew = admPass.value;
    admReaPass = document.getElementById("repeatPass");
    admReaPassNew = admReaPass.value;
    console.log(admMailNew, admNameNew, admReaPassNew, admReaPassNew);

    if (admPassNew === admReaPassNew) {
        var dataJson = {
                "email": admMailNew,
                "displayName": admNameNew,
                "password": admPassNew,
                "confirmPassword": admReaPassNew
            };

        var stringData = JSON.stringify(dataJson);

        $.ajax({
            headers: {
                "Content-Type": "application/json"
            },
            data: stringData,
            type: "POST",
            url: localStorage.baseURL+"/accounts",
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
    $("#apply").click(newAdmin);

    $.ajax({
        headers:{
            "auth" : appToken
        },
        url: localStorage.baseURL + "/" + hashedID + "/admins",
        type: "GET",
        success: renderQueries,
        beforeSend: function(){
            $('#loaderContainer').show();
            $('#pageContainer').hide();
        },
        complete: function(data){
            $('#loaderContainer').hide();
            $('#pageContainer').show();
        }
    });

    function renderQueries(Queries) {
        
        for (let i in Queries.data.admins) {
            let functionCall = Queries.data.admins[i];
            localStorage.setItem(i, JSON.stringify(functionCall));

            let id;
            if (functionCall.hasOwnProperty("auiID")) {
                id = functionCall.auiID;
            }
            else {
                id = "-"
            }
            let date;
            if (functionCall.hasOwnProperty("createdAt")) {
                date = functionCall.createdAt;
            }
            else {
                date = "-"
            }

            let firstName;
            if (functionCall.hasOwnProperty("firstName")) {
                firstName = functionCall.firstName;
            }
            else {
                firstName = "-"
            }
            let lastName;
            if (functionCall.hasOwnProperty("lastName")) {
                lastName = functionCall.lastName;
            }
            else {
                lastName = "-"
            }
            let email;
            if (functionCall.hasOwnProperty("email")) {
                email = functionCall.email;
            }
            else {
                email = "-"
            }
            
            adminsTable.row.add([id,id, date, firstName, lastName, email]).draw();
            
//            else {
//                adminsTableTwo.row.add([id, date, firstName, email]).draw();
//            }

        }

        adminsTable.draw();
    }

    $('#adminsTable tbody').on( 'click', '#moreInfoBtn', function () {

        let data = adminsTable.row($(this).parents('tr')).data();

        getMoreData(data[0]);
        function getMoreData(id) {
            $.ajax({
                url: localStorage.baseURL+"/accounts/"+id+"/deactivation",
                type: "GET",
                complete: function(){
                    location.reload();
                }
            })
        }});

//    $('#adminsTableTwo tbody').on( 'click', '#changeStatusBtn2', function () {
//
//        let data = adminsTableTwo.row($(this).parents('tr')).data();
//
//        change(data[0]);
//        function change(id) {
//            $.ajax({
//                url: localStorage.baseURL+"/accounts/"+id+"/activation",
//                type: "POST",
//                complete: function(){
//                    location.reload();
//                }
//            })
//        }});

});
function downloadCSV(csv, fileName) {
    var csvFile;
    var dowloadLink;

    csvFile = new Blob([csv], {type:"text/csv"});
    dowloadLink = document.createElement("a");
    dowloadLink.download = fileName;
    dowloadLink.href = window.URL.createObjectURL(csvFile);
    dowloadLink.style.display = "none";

    document.body.appendChild(dowloadLink);
    dowloadLink.click();
}

function exportTableToCSV(fileName) {
    var csv = [];
    table = document.getElementById("adminsTable");
    var rows = table.querySelectorAll("table tr");
    for (var i=0; i<rows.length; i++) {
        var row = [], cols = rows[i].querySelectorAll("td, th");
        for (var j=0; j< cols.length-1; j++)
            row.push(cols[j].innerText);

        csv.push(row.join(","));
    }
    downloadCSV(csv.join("\n"), fileName);
}

//function exportTable2ToCSV(fileName) {
//    var csv = [];
//    table = document.getElementById("adminsTableTwo");
//    var rows = table.querySelectorAll("table tr");
//    for (var i=0; i<rows.length; i++) {
//        var row = [], cols = rows[i].querySelectorAll("td, th");
//        for (var j=0; j< cols.length-1; j++)
//            row.push(cols[j].innerText);
//
//        csv.push(row.join(","));
//    }
//    downloadCSV(csv.join("\n"), fileName);
//}