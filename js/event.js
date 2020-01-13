$(document).ready(function () {
    
    url_string = window.location.href;
    
    var url = new URL(url_string);
    var hashedID = url.searchParams.get("h");
    var appToken = url.searchParams.get("a");
    

    let eventsTable = $('#eventsTable').DataTable({
        "language": {
            "emptyTable": "No data available in the table"
        },
        "paging": false,
        "searching": false,
        "info": false,
        "autoWidth": false,
        "columns": [
//            {"bVisible": false, "targets": 0},
            {"width": "21%", "targets": 1},
            {"width": "22%", "targets": 2},
            {"width": "24%", "targets": 3},
            {"width": "21%", "targets": 4},
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
        url: localStorage.baseURL + "/events"+ "/" + hashedID + "/events",
        type: "GET",
        success: renderQueries,
        beforeSend: function(){
            $('#loaderContainer').show();
            $('#pageContainer').hide();
        },
        complete: function(data){
            console.log(data.responseJSON);
            $('#loaderContainer').hide();
            $('#pageContainer').show();
        }
    });

    function renderQueries(Queries) {
        
        for (let i in Queries.data) {
            let functionCall = Queries.data[i];
            localStorage.setItem(i, JSON.stringify(functionCall));

            let adminAUIID;
            if (functionCall.hasOwnProperty("adminAUIID")) {
                adminAUIID = functionCall.adminAUIID;
            }
            else {
                adminAUIID = "-"
            }
            let eventTitle;
            if (functionCall.hasOwnProperty("eventTitle")) {
                eventTitle = functionCall.eventTitle;
            }
            else {
                eventTitle = "-"
            }

            let maxParticipants;
            if (functionCall.hasOwnProperty("maxParticipants")) {
                maxParticipants = functionCall.maxParticipants;
            }
            else {
                maxParticipants = "-"
            }
            let date;
            if (functionCall.hasOwnProperty("date")) {
                date = functionCall.date;
            }
            else {
                date = "-"
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
            
            eventsTable.row.add([adminAUIID,convdataTime,eventTitle, maxParticipants]).draw();


        }

        eventsTable.draw();
    }


    let nextUrl ;
    let currentUrl;
    let previousUrl;
    let current = 1;
    let totalPages = 1;
});