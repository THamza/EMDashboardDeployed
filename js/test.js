$(document).ready(function () {
    $.ajaxSetup({
        xhrFields: {
            withCredentials: true
        }
    });
    $("#download").click(
    function saveData() {
        $.ajax({
            url: "http://13.251.207.57/api/dashboard/admin/merchants",
            type: "GET",
            success: storePage,
        });
        
        function storePage(Queries) {
            let number = Queries.data.meta.totalPages;
            for (j=1; j<number; j++) {
                if (j==number) {
                    for (let i in Queries.data.merchants) {
                        let functionCall = Queries.data.merchants[i];
                        if (i == 0) {
                            storeData = JSON.stringify(functionCall);
                        }
                        else {
                            storeData += JSON.stringify(functionCall);
                        }
                    }
                }
                else {
                    $.ajax({
                        url: "http://13.251.207.57/api/dashboard/admin/merchants?page"+j,
                        type: "GET",
                        success: storePage
                    });
                }
            }
        }
    });
});