$(document).ready(function () {

    $.ajaxSetup({
        xhrFields: {
            withCredentials: true
        }
    });

    let merchantsDetailsTable = $('#merchantsDetailsTable').DataTable({
        "language": {
            "emptyTable": "No data available in the table"
        },
        "paging": false,
        "searching": false,
        "info": false,
        "autoWidth": false,
        "columnDefs": [
            {"bVisible": false, "targets": 0},
            {"width": "10%", "targets": 1},
            {"width": "10%", "targets": 2},
            {"width": "10%", "targets": 3},
            {"width": "12%", "targets": 4},
            {"width": "20%", "targets": 5},
            {"width": "13%", "targets": 6},
            {"width": "10%", "targets": 7},
            {"width": "15%", "targets": 8}
        ]
    });

    let link = document.URL;
    var n = link.length, i, starting;
    for (i=0; i<n; i++) {
        if (link[i]=="q" && link[i+1]=="=") {
            starting=i+2;
            break;
        }
    }
    var id = link[starting];
    for (i=starting+1; i<link.length; i++){
     id += link[i];
    }
    // console.log(id);

});