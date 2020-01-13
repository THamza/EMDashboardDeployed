$(document).ready(function () {
    console.log("HERE");
    console.log(localStorage.baseURL);
    url_string = window.location.href;
    
    let url = new URL(url_string);
    let hashedID = url.searchParams.get("h");
    let appToken = url.searchParams.get("a");
    

    let usersTable = $('#usersTable').DataTable({
        "language": {
            "emptyTable": "No data available in the table"
        },
        "paging": false,
        "searching": false,
        "info": false,
        "autoWidth": true,
        "columnDefs": [
            // {"bVisible": false, "targets": 0},
            {"width": "15%", "targets": 1},
            {"width": "15%", "targets": 2},
            {"width": "25%", "targets": 3},
            {"width": "25%", "targets": 4},
            
            {
                "data": null,
                "defaultContent": "<button id=\"moreInfo\" type=\"button\" class=\"btn green-1\" style='max-width: 8%; background-color: #4e42e5 !important;'> More Info </button>",
                "target": 5
            }
        ]
    });

    $.ajaxSetup({
        xhrFields: {
            withCredentials: true
        }
    });
    
    $.ajax({
        headers:{
            "auth" : appToken
        },
        url: localStorage.baseURL + "/" + hashedID + "/users",
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
        console.log(Queries.data.users)
        for (let i in Queries.data.users) {
            let functionCall = Queries.data.users[i];
            localStorage.setItem(i, JSON.stringify(functionCall));

            let adminAUIID;
            if (functionCall.hasOwnProperty("adminAUIID")) {
                adminAUIID = functionCall.adminAUIID;
            }
            else {
                adminAUIID = "-";
            }

            let firstName;
            if (functionCall.hasOwnProperty("firstName")) {
                firstName = functionCall.firstName;
            }
            else {
                firstName = "-";
            }
            let lastName;
            if (functionCall.hasOwnProperty("lastName")) {
                lastName = functionCall.lastName;
            }
            else {
                lastName = "-";
            }
            let email;
            if (functionCall.hasOwnProperty("email")) {
                email = functionCall.email;
            }
            else {
                email = "-";
            }
            let date;
            if (functionCall.hasOwnProperty("date")) {
                date = functionCall.date;
            }
            else {
                date = "-";
            }
             // Months array
             var months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
             // Convert timestamp to milliseconds
             var dateTime = new Date(date*1000);
             // Year
             var year = dateTime.getFullYear();
             // Month
             var month = months_arr[dateTime.getMonth()];
             // Day
             var day = dateTime.getDate();
             // Hours
             var hours = dateTime.getHours();
             // Minutes
             var minutes = "0" + dateTime.getMinutes();
             // Seconds
             var seconds = "0" + dateTime.getSeconds();
             // Display date time in MM-dd-yyyy h:m:s format
             var convdataTime = month+'-'+day+'-'+year+' '+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

            usersTable.row.add([adminAUIID,firstName,lastName, email, convdataTime]).draw();


        }

        usersTable.draw();
            

    }
    

});