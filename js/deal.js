$(document).ready(function () {

    let vouchersTable = $('#vouchersTable').DataTable({
        "language": {
            "emptyTable": "No data available in the table"
        },
        "paging": false,
        "searching": false,
        "info": false,
        "autoWidth": false,
        "columns": [
            {"bVisible": false, "targets": 0},
            {"width": "10%", "targets": 1},
            {"width": "10%", "targets": 2},
            {"width": "10%", "targets": 3},
            {"width": "15%", "targets": 4},
            {"width": "25%", "targets": 5},
            {"width": "10%", "targets": 6},
            {"width": "10%", "targets": 7},
            {"width": "10%", "targets": 8},
            {
                "data": null,
                "defaultContent": "<button id=\"deleteBtn\" type=\"button\" class=\"btn green-1\" style='max-width: 8%; background-color: darkgrey !important;'> Delete </button>",
                "target": 8
            }
        ]
    });


    $.ajaxSetup({
        xhrFields: {
            withCredentials: true
        }
    });

    $("#import").click(function () {
        $("#importBtn").css("display", "none");
        $("#choseFile").css("display", "block");
    })




});