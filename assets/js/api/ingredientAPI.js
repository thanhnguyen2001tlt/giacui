function calculateTotal() {
  const quantityInput = document.getElementById('quantity');
  const unitPriceInput = document.getElementById('unitPrice');
  const totalInput = document.getElementById('total');

  const quantity = parseFloat(quantityInput.value);
  const unitPrice = parseFloat(unitPriceInput.value);

  if (!isNaN(quantity) && !isNaN(unitPrice)) {
    const total = quantity * unitPrice;
    totalInput.value = total.toFixed(2); // Hiển thị đến 2 chữ số thập phân
  } else {
    totalInput.value = ''; // Xóa giá trị nếu không hợp lệ
  }
}


function updateRemaining() {
  const totalInput = document.getElementById('total');
  const prepaidInput = document.getElementById('prepaid');
  const remainingInput = document.getElementById('remaining');

  const totalValue = parseFloat(totalInput.value);
  const prepaidValue = parseFloat(prepaidInput.value);

  if (!isNaN(totalValue) && !isNaN(prepaidValue)) {
    const remainingValue = Math.max(totalValue - prepaidValue, 0);
    remainingInput.value = remainingValue;
  } else {
    remainingInput.value = '';
  }
}
const authorization = sessionStorage.getItem('token');
var check = 0;
var id = "";
var ingredient;
function handleEditButtonClick(data) {
  check = 1;
  $('#exampleModalCenter').modal('show');
  id = data._id;
  document.getElementById('name').value = data.name;
  document.getElementById('date').value = data.date;
  document.getElementById('quantity').value = data.quantity;
  document.getElementById('unitPrice').value = data.unitPrice;
  document.getElementById('total').value = data.total;
  document.getElementById('prepaid').value = data.prepaid;
  updateRemaining();
}

// Function to handle the Delete button click event
function handleDeleteButtonClick(data) {
  $('#deleteModalCenter').modal('show');
  ingredient = data;
}

function deleteCustomer() {

  async function deleteCustomer(id) {
    const apiUrl = `https://apigiacui.vercel.app/api/ingredients/${id}`;
    const authenticationHeader = {
      "Authorization": authorization,
    };

    try {
      const response = await fetch(apiUrl, {
        method: "Xóa",
        headers: {
          ...authenticationHeader,
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        reloadData();
        $('#deleteModalCenter').modal('hide');
        Swal.fire({
          icon: 'success',
          title: 'Xóa Thành Công',
          text: 'Nguyên liệu đã được xóa thành công!',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Xóa nguyên liệu thất bại!',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Đã xảy ra lỗi',
      });
    }
  }
  deleteCustomer(ingredient._id);
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

const apiUrl = "https://apigiacui.vercel.app/api/ingredients";
const authenticationHeader = {
  "Authorization": authorization,
};


function reloadData() {
  getData(apiUrl, authenticationHeader)
    .then((responseData) => {
      var table = $('.table').DataTable();
      table.clear();

      responseData.forEach((data) => {
        var nameElement = document.createElement('td');
        nameElement.innerText = data.name;

        var dateElement = document.createElement('td');
        dateElement.innerText = data.date;

        var quantityElement = document.createElement('td');
        quantityElement.innerText = data.quantity;

        var unitPriceElement = document.createElement('td');
        unitPriceElement.innerText = data.unitPrice;

        var totalElement = document.createElement('td');
        totalElement.innerText = data.total;

        var prepaidElement = document.createElement('td');
        prepaidElement.innerText = data.prepaid;

        var remainingElement = document.createElement('td');
        remainingElement.innerText = data.remaining;

        var editButton = document.createElement('button');
        editButton.innerText = 'Sửa';
        editButton.classList = 'btn btn-primary btn-round';
        editButton.setAttribute('onclick', 'handleEditButtonClick(' + JSON.stringify(data) + ')');

        var deleteButton = document.createElement('button');
        deleteButton.innerText = 'Xóa';
        deleteButton.classList = 'btn btn-danger btn-round';
        deleteButton.setAttribute('onclick', 'handleDeleteButtonClick(' + JSON.stringify(data) + ')');

        var newRowData = [
          nameElement.outerHTML,
          dateElement.outerHTML,
          quantityElement.outerHTML,
          unitPriceElement.outerHTML,
          totalElement.outerHTML,
          prepaidElement.outerHTML,
          remainingElement.outerHTML,
          editButton.outerHTML,
          deleteButton.outerHTML
        ];

        table.row.add(newRowData);
      });

      table.draw();

    })
    .catch((error) => {
      console.error("Không thể tìm nạp dữ liệu:", error);
    })
}
reloadData();


function validateForm() {
  if (check === 0) {
    const nameInput = document.getElementById('name');
    const nameError = document.getElementById('name-error');
    if (nameInput.value.trim() === '') {
      nameError.textContent = 'Vui lòng điền tên nguyên liệu!';
    } else {
      nameError.textContent = '';
    }

    const dateInput = document.getElementById('date');
    const dateError = document.getElementById('date-error');
    if (dateInput.value.trim() === '') {
      dateError.textContent = 'Vui lòng chọn ngày!';
    } else {
      dateError.textContent = '';
    }

    const quantityInput = document.getElementById('quantity');
    const quantityError = document.getElementById('quantity-error');
    if (quantityInput.value.trim() === '') {
      quantityError.textContent = 'Vui lòng  điền số lượng!';
    } else {
      quantityError.textContent = '';
    }

    const unitPriceInput = document.getElementById('unitPrice');
    const unitPriceError = document.getElementById('unitPrice-error');
    if (unitPriceInput.value.trim() === '') {
      unitPriceError.textContent = 'Vui lòng  điền giá!';
    } else {
      unitPriceError.textContent = '';
    }

    const totalInput = document.getElementById('total');
    const totalError = document.getElementById('total-error');
    if (totalInput.value.trim() === '') {
      totalError.textContent = 'Vui lòng  điền tổng tiền!';
    } else {
      totalError.textContent = '';
    }

    const prepaidInput = document.getElementById('prepaid');
    const prepaidError = document.getElementById('prepaid-error');
    if (prepaidInput.value.trim() === '') {
      prepaidError.textContent = 'Vui lòng nhập số tiền trả trước!';
    } else {
      prepaidError.textContent = '';
    }

    const remainingInput = document.getElementById('remaining');
    const remainingError = document.getElementById('remaining-error');
    if (remainingInput.value.trim() === '') {
      remainingError.textContent = 'Vui lòng nhập số tiền còn lại!';
    } else {
      remainingError.textContent = '';
    }

    if (
      nameError.textContent === '' &&
      dateError.textContent === '' &&
      quantityError.textContent === '' &&
      unitPriceError.textContent === '' &&
      totalError.textContent === '' &&
      prepaidError.textContent === '' &&
      remainingError.textContent === ''
    ) {

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

      const data = {
        name: nameInput.value,
        date: dateInput.value,
        quantity: Number.parseInt(quantityInput.value),
        unitPrice: Number.parseInt(unitPriceInput.value),
        total: Number.parseInt(totalInput.value),
        prepaid: Number.parseInt(prepaidInput.value),
        remaining: Number.parseInt(remainingInput.value)
      };

      createData(apiUrl, authorization, data)
        .then((response) => {
          const form = document.getElementById('myForm');
          reloadData();
          $('#exampleModalCenter').modal('hide');
          form.reset();
          Swal.fire({
            icon: 'success',
            title: 'Thêm Thành Công',
            text: 'Nguyên liệu đã được thêm',
          });
        })
        .catch((error) => {
          Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Nguyên liệu chưa đc thêm',
          });
        });
    }
  } else {
    const nameInput = document.getElementById('name');
    const nameError = document.getElementById('name-error');
    if (nameInput.value.trim() === '') {
      nameError.textContent = 'Vui lòng điền tên nguyên liệu!';
    } else {
      nameError.textContent = '';
    }

    const dateInput = document.getElementById('date');
    const dateError = document.getElementById('date-error');
    if (dateInput.value.trim() === '') {
      dateError.textContent = 'Vui lòng chọn ngày!';
    } else {
      dateError.textContent = '';
    }

    const quantityInput = document.getElementById('quantity');
    const quantityError = document.getElementById('quantity-error');
    if (quantityInput.value.trim() === '') {
      quantityError.textContent = 'Vui lòng  điền số lượng!';
    } else {
      quantityError.textContent = '';
    }

    const unitPriceInput = document.getElementById('unitPrice');
    const unitPriceError = document.getElementById('unitPrice-error');
    if (unitPriceInput.value.trim() === '') {
      unitPriceError.textContent = 'Vui lòng  điền giá!';
    } else {
      unitPriceError.textContent = '';
    }

    const totalInput = document.getElementById('total');
    const totalError = document.getElementById('total-error');
    if (totalInput.value.trim() === '') {
      totalError.textContent = 'Vui lòng  điền tổng tiền!';
    } else {
      totalError.textContent = '';
    }

    const prepaidInput = document.getElementById('prepaid');
    const prepaidError = document.getElementById('prepaid-error');
    if (prepaidInput.value.trim() === '') {
      prepaidError.textContent = 'Vui lòng nhập số tiền trả trước!';
    } else {
      prepaidError.textContent = '';
    }

    const remainingInput = document.getElementById('remaining');
    const remainingError = document.getElementById('remaining-error');
    if (remainingInput.value.trim() === '') {
      remainingError.textContent = 'Vui lòng nhập số tiền còn lại!';
    } else {
      remainingError.textContent = '';
    }

    if (
      nameError.textContent === '' &&
      dateError.textContent === '' &&
      quantityError.textContent === '' &&
      unitPriceError.textContent === '' &&
      totalError.textContent === '' &&
      prepaidError.textContent === '' &&
      remainingError.textContent === ''
    ) {

      async function updateData(apiUrl = "", authorization = "", id, data = {}) {
        const response = await fetch(apiUrl + '/' + id, {
          method: "PUT",
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

      const data = {
        name: nameInput.value,
        date: dateInput.value,
        quantity: Number.parseInt(quantityInput.value),
        unitPrice: Number.parseInt(unitPriceInput.value),
        total: Number.parseInt(totalInput.value),
        prepaid: Number.parseInt(prepaidInput.value),
        remaining: Number.parseInt(remainingInput.value)
      };

      updateData(apiUrl, authorization, id, data)
        .then((response) => {
          const form = document.getElementById('myForm');
          reloadData();
          $('#exampleModalCenter').modal('hide');
          form.reset();
          Swal.fire({
            icon: 'success',
            title: 'Thành Công',
            text: 'Nguyên liệu đã được cập nhật',
          });
        })
        .catch((error) => {
          Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Cập nhật nguyên liệuh thất bại',
          });
        });

    }
  }
  return false;
}


function openmodel() {
  check = 0;
  $('#exampleModalCenter').modal('show');
  const form = document.getElementById('myForm');
  form.reset();
}


