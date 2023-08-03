const authorization = sessionStorage.getItem('token');
var cart = [];
var totalPrice = 0;
var customer;
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

const apiUrl = "https://apigiacui.vercel.app/api/services";
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
        editButton.innerText = 'Bán';
        editButton.classList = 'btn btn-primary btn-round';
        editButton.setAttribute('onclick', 'handleEditButtonClick(' + JSON.stringify(data) + ')');

        var newRowData = [
          imageElement.outerHTML,
          data.name,
          (data.price).toLocaleString('it-IT', { style: 'currency', currency: 'VND' }),
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



function handleEditButtonClick(data) {
  checkDuplicateId(cart, data, true);

}
function addQuantity(data) {
  checkDuplicateId(cart, data, true);
}
function priveteQuantity(data) {
  checkDuplicateId(cart, data, false);

}
function loadDataCart() {
  var totalPrice = 0;
  var table = $('#cart').DataTable();
  table.clear();
  cart.forEach((data) => {
    totalPrice += data.total;
    var divButton = document.createElement('div');

    var divElement = document.createElement('div');
    var priveteButton = document.createElement('button')
    priveteButton.innerText = '-';
    priveteButton.classList = ' btn btn-outline-danger';
    priveteButton.setAttribute('onclick', 'priveteQuantity(' + JSON.stringify(data) + ')');
    priveteButton.style.width = "100%";

    var addButton = document.createElement('button')
    addButton.innerText = '+';
    addButton.classList = 'btn btn-outline-success';
    addButton.setAttribute('onclick', 'addQuantity(' + JSON.stringify(data) + ')');
    addButton.style.width = "100%";

    divElement.innerHTML = `<input type='number' style='text-align: center; border-radius: 0px;'  class=' form-control'  value='${data.quantity}' readonly>`

    divButton.appendChild(priveteButton);

    divButton.appendChild(divElement);

    divButton.appendChild(addButton);
    var deleteButton = document.createElement('button');
    deleteButton.innerText = 'X';
    deleteButton.classList = 'btn btn-danger btn-round';
    deleteButton.setAttribute('onclick', 'remove(' + JSON.stringify(data) + ')');


    var newRowData = [
      data.name,
      (data.price),
      divButton.outerHTML,
      (data.total),
      deleteButton.outerHTML
    ];

    table.row.add(newRowData);
  });
  document.getElementById('countMoney').innerText = totalPrice.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
  document.getElementById('countMoneyPrint').innerText = totalPrice.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
  table.draw();

  var tablePrint = $('#prints').DataTable();
  tablePrint.clear();
  cart.forEach((data) => {
    var newRowDataPrint = [
      data.name,
      (data.price),
      "x " + data.quantity,
      (data.total),
    ];
    tablePrint.row.add(newRowDataPrint);
  });


  tablePrint.draw();
}

function remove(object) {
  var existingIndex = -1;
  for (var i = 0; i < cart.length; i++) {
    if (cart[i]._id === object._id) {
      existingIndex = i;
      break;
    }
  }
  if (existingIndex !== -1) {
    cart.splice(existingIndex, 1);
    loadDataCart();

  }

}
function checkDuplicateId(array, object, check) {
  var existingIndex = -1;
  for (var i = 0; i < array.length; i++) {
    if (array[i]._id === object._id) {
      existingIndex = i;
      break;
    }
  }
  if (existingIndex !== -1) {
    if (check == true) {
      array[existingIndex].quantity++;
      array[existingIndex].total += object.price;
    } else {
      if (array[existingIndex].quantity > 1) {
        array[existingIndex].quantity--;
        array[existingIndex].total -= object.price;
      } else {
        array.splice(existingIndex, 1)
      }
    }
  } else {
    object['quantity'] = 1;
    object['total'] = object.price;
    array.push(object)
  }
  loadDataCart();
}


reloadData();

function find() {
  var info = document.getElementById("infoGust").value;
  if (info.length > 0) {
    // Load data
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

    const apiUrl = "https://apigiacui.vercel.app/api/customers/" + info; // Thay thế "your-api-url" bằng URL tương ứng trong ứng dụng của bạn
    const authenticationHeader = {
      "Authorization": authorization,
    };

    function getCustomerData() {
      getData(apiUrl, authenticationHeader)
        .then((customers) => {
          if (customers.error) {
            Swal.fire({
              icon: 'error',
              title: 'không tìm thấy',
              text: 'Khách hàng không tồn tại kiểm tra lại số điện thoại vừa nhập',
            });
            return;
          }
          document.getElementById('nameGust').innerText = customers.name;
          customer = customers;
        })
        .catch((error) => {
          console.error("Failed to fetch customer data:", error);
        });
    }
    getCustomerData();

  } else {
    Swal.fire({
      icon: 'error',
      title: 'Chưa Điền SĐT ',
      text: 'Vui lòng điền SĐT của khách hàng ',
    });
  }

}
function pay() {
  if (cart.length > 0) {
    if (customer != undefined) {
      var prepaidAmount = document.getElementById('prepaidAmount').value;
      var dateorder = document.getElementById('dateorder').value;

      var isValid = true;

      if (prepaidAmount === '') {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Số tiền trả trước không được để trống',
        });
        isValid = false;
      } else if (isNaN(prepaidAmount)) {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Số tiền trả trước phải là một số',
        });
        isValid = false;
      }

      if (dateorder === '') {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Ngày đặt hàng không được để trống',
        });
        isValid = false;
      }
      if (isValid) {
        async function createData(apiUrl = "", authorization = "", data = {}) {
          const response = await fetch(apiUrl, {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json",
              Authorization: authorization,
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(data),
          });
          return response.json();
        }

        const apiUrl = "https://apigiacui.vercel.app/api/orders";
        var employee = JSON.parse(sessionStorage.getItem("account"));
        var total = 0;
        cart.forEach((data) => {
          total += data.total;
        });
        const data = {
          customer: customer.name,
          employee: employee.name,
          orderDate: getTime(),
          deliveryDate: dateorder,
          totalAmount: total,
          prepaidAmount: Number(prepaidAmount),
          remainingAmount: Number(total - prepaidAmount)
        };
        document.getElementById('nameGustPrint').innerText = customer.name;
        document.getElementById('datePayPrint').innerText = formatDate(getTime());
        document.getElementById('prepaidAmountPrint').innerText =  Number(prepaidAmount).toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
        document.getElementById('remainingAmountPrint').innerText = Number(total - prepaidAmount).toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
        document.getElementById('datePrint').innerText = formatDate(new Date(dateorder));

        createData(apiUrl, authorization, data)
          .then((responses) => {
            cart.forEach((service) => {
              async function createData(apiUrl = "", authorization = "", data = {}) {
                const response = await fetch(apiUrl, {
                  method: "POST",
                  mode: "cors",
                  cache: "no-cache",
                  credentials: "same-origin",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: authorization,
                  },
                  redirect: "follow",
                  referrerPolicy: "no-referrer",
                  body: JSON.stringify(data),
                });
                return response.json();
              }
              const apiUrl = "https://apigiacui.vercel.app/api/orderDetails";
              const data = {
                order: responses,
                service: service.name,
                servicePrice: service.price,
                quantity: service.quantity,
                subtotal: service.total
              };
              createData(apiUrl, authorization, data)
                .then((response) => {


                })
                .catch((error) => {
                  // Xử lý khi có lỗi
                  console.error(error);
                  Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Lỗi tạo đơn hàng chi tiết',
                  });
                });

            });
            window.print();
            // Tạo một tệp PDF từ mã HTML bằng thư viện jsPDF
           

            // Sử dụng hàm để tạo tệp PDF từ mã HTML

          })
          .catch((error) => {
            // Xử lý khi có lỗi
            console.error(error);
            Swal.fire({
              icon: 'error',
              title: 'Lỗi',
              text: 'Lỗi tạo đơn hàng',
            });
          });
      }

    } else {
      Swal.fire({
        icon: 'error',
        title: 'Chọn khách hàng',
        text: 'Mời bạn chọn khách hàng,',
      });
    }
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Hiện chưa có sản phẩm,dịch vụ',
      text: 'Mời bạn chọn sản phẩm dịch vụ cần mua',
    });
  }
}

function formatDate(date) {
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  var hour = date.getHours();
  var minute = date.getMinutes();

  return day + '/' + month + '/' + year + ' ' + hour + ':' + minute;
}




function getTime() {
  // Lấy ngày hiện tại
  const currentDate = new Date();

  // Lấy giá trị ngày, tháng và năm
  const currentDay = currentDate.getDate();
  const currentYear = currentDate.getFullYear();

  // Chuyển đổi múi giờ sang múi giờ Việt Nam (GMT+7)
  const vietnamTime = new Date(currentYear, currentDate.getMonth(), currentDay, currentDate.getHours() + 7, currentDate.getMinutes(), currentDate.getSeconds());

  return vietnamTime;

}
function updateRemaining() {
  var prepaidAmount = document.getElementById('prepaidAmount').value;
  var totalPrice = 0;
  cart.forEach((data) => {
    totalPrice += data.total;
  });
  if (!isNaN(prepaidAmount) && totalPrice > 0) {
    document.getElementById('remainingAmount').innerHTML = totalPrice - prepaidAmount;
  }
}