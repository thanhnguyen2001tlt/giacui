const authorization = sessionStorage.getItem('token');
function handleEditButtonClick(dataOrder) {
    async function getData(url = "", headers = {}) {
        const response = await fetch(url, {
            method: "GET",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                ...headers,
                "Content-Type": "application/json",
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
        });
        return response.json();
    }

    
    const apiUrl = "https://apigiacui.vercel.app/api/orderDetails/"+dataOrder._id;
    const authenticationHeader = {
        "Authorization": authorization,
    };
    
    
    function reloadDataOrder() {
        getData(apiUrl, authenticationHeader)
            .then((responseData) => {
                var table = $('#datadataorderDetails').DataTable();
    
                table.clear();
    
                responseData.forEach((data) => {
                    console.log('data::: ', data);
                    
                    var newRowData = [
                        data.service,
                        data.servicePrice,
                        data.quantity,
                        data.subtotal,
                    ];
    
                    table.row.add(newRowData);
                });
    
                table.draw();
    
            })
            .catch((error) => {
                console.error("Failed to fetch data:", error);
            })
    
    }
    
    reloadDataOrder();
    
    $('#orderDetails').modal('show');

  }
  
// load data
async function getData(url = "", headers = {}) {
    const response = await fetch(url, {
        method: "GET",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            ...headers,
            "Content-Type": "application/json",
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
    });
    return response.json();
}

const apiUrl = "https://apigiacui.vercel.app/api/orders";
const authenticationHeader = {
    "Authorization": authorization,
};


function reloadData() {
    getData(apiUrl, authenticationHeader)
        .then((responseData) => {
            var table = $('#datatable').DataTable();

            table.clear();

            responseData.forEach((data) => {
                var imageElement = document.createElement('img');
                imageElement.src = data.image;
                imageElement.style.height = "100px";
                imageElement.style.width = "100px";
                imageElement.style.objectFit = "cover";
                imageElement.alt = 'Image';

                imageElement.style.borderRadius = "50%";

                var editButton = document.createElement('button');
                editButton.innerText = 'Chi Tiết';
                editButton.classList = 'btn btn-primary btn-round';
                editButton.setAttribute('onclick', 'handleEditButtonClick(' + JSON.stringify(data) + ')');

                
                var newRowData = [
                    data.customer,
                    data.employee,
                    formatDate(data.orderDate),
                    formatDate(data.deliveryDate),
                    data.totalAmount,
                    data.prepaidAmount,
                    data.remainingAmount,
                    editButton.outerHTML,
                ];

                table.row.add(newRowData);
            });

            table.draw();

        })
        .catch((error) => {
            console.error("Failed to fetch data:", error);
        })

}

reloadData();
function formatDate(date) {
    const dateParts = date.split("T")[0].split("-");
    const year = dateParts[0];
    const month = dateParts[1];
    const day = dateParts[2];

    return day + '/' + month + '/' + year;
}
 