const authorization =   sessionStorage.getItem('token');

var check = 0;
var id = "";
var point ;
var customer ;
function handleEditButtonClick(data) {
  check = 1;
  point=data.point;
  $('#exampleModalCenter').modal('show');
  id = data._id;
  document.getElementById('name').value = data.name;
  document.getElementById('image-preview').src = data.image;
  document.getElementById('phone').value = data.phone;
  document.getElementById('address').value = data.address;
}

// Function to handle the Delete button click event
function handleDeleteButtonClick(data) {
  $('#deleteModalCenter').modal('show');
  customer = data;
}

function deleteCustomer(){
  
  async function deleteCustomer(id) {
    const apiUrl = `https://apigiacui.vercel.app//api/customers/${id}`;
    const authenticationHeader = {
      "Authorization": authorization,
    };
  
    try {
      const response = await fetch(apiUrl, {
        method: "DELETE",
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
          title: 'Xoá Thành Công',
          text: 'Khách hàng đã được xoá',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Lỗi',
          text: 'Xoá khách hàng thất bại!',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Đã xảy ra lỗi!',
      });
    }
  }
  deleteCustomer(customer._id);
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

const apiUrl = "https://apigiacui.vercel.app//api/customers";
const authenticationHeader = {
  "Authorization": authorization,
};


function reloadData() {
  getData(apiUrl, authenticationHeader)
    .then((responseData) => {
      var table = $('.table').DataTable();

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
        editButton.innerText = 'Sửa';
        editButton.classList = 'btn btn-primary btn-round';
        editButton.setAttribute('onclick', 'handleEditButtonClick(' + JSON.stringify(data) + ')');

        var deleteButton = document.createElement('button');
        deleteButton.innerText = 'Xoá';
        deleteButton.classList = 'btn btn-danger btn-round';
        deleteButton.setAttribute('onclick', 'handleDeleteButtonClick(' + JSON.stringify(data) + ')');

        var newRowData = [
          imageElement.outerHTML,
          data.name,
          data.phone,
          data.address,
          data.point,
          editButton.outerHTML,
          deleteButton.outerHTML
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

// Hàm xử lý sự kiện xem trước hình ảnh
function handleImagePreview(event) {
  const file = event.target.files[0];
  const imagePreview = document.getElementById('image-preview');

  if (file) {
    const reader = new FileReader();
    reader.addEventListener('load', function () {
      imagePreview.src = reader.result;
    });

    reader.readAsDataURL(file);
  } else {
    imagePreview.src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
  }
}

// Gọi hàm xử lý sự kiện khi sự kiện onchange xảy ra
document.addEventListener('DOMContentLoaded', function () {
  const imageInput = document.getElementById('image');
  imageInput.addEventListener('change', handleImagePreview);
});
function validateForm() {
  if (check === 0) {
    // Kiểm tra tính hợp lệ của trường "Name"
    const nameInput = document.getElementById('name');
    const nameError = document.getElementById('name-error');
    if (nameInput.value.trim() === '') {
      nameError.textContent = 'Vui lòng điền tên khách hàng!';
    } else {
      nameError.textContent = '';
    }

    // Kiểm tra tính hợp lệ của trường "Image"
    const imageInput = document.getElementById('image');
    const imageError = document.getElementById('image-error');
    if (imageInput.files.length === 0) {
      imageError.textContent = 'Vui lòng chọn ảnh!';
    } else {
      imageError.textContent = '';
    }

    // Kiểm tra tính hợp lệ của trường "Phone"
    const phoneInput = document.getElementById('phone');
    const phoneError = document.getElementById('phone-error');
    const phoneNumber = phoneInput.value.trim();
    if (phoneNumber === '') {
      phoneError.textContent = 'Vui Lòng điền số điện thoại';
    } else if (!isValidPhoneNumber(phoneNumber)) {
      phoneError.textContent = 'Vui lòng nhập đúng số điện thoại!';
    } else {
      phoneError.textContent = '';
    }

    // Kiểm tra tính hợp lệ của trường "Address"
    const addressInput = document.getElementById('address');
    const addressError = document.getElementById('address-error');
    if (addressInput.value.trim() === '') {
      addressError.textContent = 'Vui lòng nhập địa chỉ';
    } else {
      addressError.textContent = '';
    }

    // Kiểm tra tính hợp lệ của toàn bộ form
    if (nameError.textContent === '' &&
      imageError.textContent === '' &&
      phoneError.textContent === '' &&
      addressError.textContent === '') {

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

      function uploadImage() {
        return new Promise(function (resolve, reject) {
          var file = imageInput.files[0];
          var formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", "zkgrnabd"); // Thay YOUR_UPLOAD_PRESET bằng upload preset của bạn

          var url = "https://api.cloudinary.com/v1_1/wuk3mhz3/image/upload"; // Thay YOUR_CLOUD_NAME bằng tên cloud của bạn

          fetch(url, {
            method: "POST",
            body: formData
          })
            .then(function (response) {
              return response.json();
            })
            .then(function (data) {
              resolve(data.secure_url);
            })
            .catch(function (error) {
              reject(error);
            });
        });
      }

      uploadImage()
        .then(function (urlImages) {
          const data = {
            name: nameInput.value,
            image: urlImages,
            phone: phoneInput.value,
            address: addressInput.value,
            point: 0,
          };

          createData(apiUrl, authorization, data)
            .then((response) => {
              const form = document.getElementById('myForm');
              reloadData();
              $('#exampleModalCenter').modal('hide');
              document.getElementById('image-preview').src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
              form.reset();
              Swal.fire({
                icon: 'success',
                title: 'Thành Công',
                text: 'Thêm khách hàng thành công',
              });
            })
            .catch((error) => {
              Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Thêm khách hàng thất bại',
              });
            });
        })
        .catch(function (error) {
          Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Đã xảy ra lỗi',
          });
        });
    }
  } else {
    // Kiểm tra tính hợp lệ của trường "Name"
    const nameInput = document.getElementById('name');
    const nameError = document.getElementById('name-error');
    if (nameInput.value.trim() === '') {
      nameError.textContent = 'Vui lòng điền tên khách hàng';
    } else {
      nameError.textContent = '';
    }

    // Kiểm tra tính hợp lệ của trường "Phone"
    const phoneInput = document.getElementById('phone');
    const phoneError = document.getElementById('phone-error');
    const phoneNumber = phoneInput.value.trim();
    if (phoneNumber === '') {
      phoneError.textContent = 'Vui Lòng điền số điện thoại';
    } else if (!isValidPhoneNumber(phoneNumber)) {
      phoneError.textContent = 'Vui lòng nhập đúng số điện thoại';
    } else {
      phoneError.textContent = '';
    }

    // Kiểm tra tính hợp lệ của trường "Address"
    const addressInput = document.getElementById('address');
    const addressError = document.getElementById('address-error');
    if (addressInput.value.trim() === '') {
      addressError.textContent = 'Vui Lòng điền địa chỉ';
    } else {
      addressError.textContent = '';
    }

    // Kiểm tra tính hợp lệ của toàn bộ form
    if (nameError.textContent === '' &&
      phoneError.textContent === '' &&
      addressError.textContent === '') {
      const imageInput = document.getElementById('image');
      if (imageInput.files.length === 0) {
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
          phone: phoneInput.value,
          address: addressInput.value,
        };
        
        updateData(apiUrl, authorization, id, data)
          .then((response) => {
            const form = document.getElementById('myForm');
            reloadData();
            $('#exampleModalCenter').modal('hide');
            document.getElementById('image-preview').src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
            form.reset();
            Swal.fire({
              icon: 'success',
              title: 'Thành Công',
              text: 'Thông tin khách hàng đã được cập nhật',
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: 'error',
              title: 'Lỗi',
              text: 'Cập nhật thất bại',
            });
          });

      } else {
      
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
  
        function uploadImage() {
          return new Promise(function (resolve, reject) {
            var file = imageInput.files[0];
            var formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "zkgrnabd"); // Thay YOUR_UPLOAD_PRESET bằng upload preset của bạn
  
            var url = "https://api.cloudinary.com/v1_1/wuk3mhz3/image/upload"; // Thay YOUR_CLOUD_NAME bằng tên cloud của bạn
  
            fetch(url, {
              method: "POST",
              body: formData
            })
              .then(function (response) {
                return response.json();
              })
              .then(function (data) {
                resolve(data.secure_url);
              })
              .catch(function (error) {
                reject(error);
              });
          });
        }
  
        uploadImage()
          .then(function (urlImages) {
            const data = {
              name: nameInput.value,
              image: urlImages,
              phone: phoneInput.value,
              address: addressInput.value,
            };
  
            updateData(apiUrl, authorization, id, data)
          .then((response) => {
            const form = document.getElementById('myForm');
            reloadData();
            $('#exampleModalCenter').modal('hide');
            document.getElementById('image-preview').src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
            form.reset();
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Cập nhật thông tin khách hàng thành công',
            });
          })
          .catch((error) => {
            Swal.fire({
              icon: 'error',
              title: 'Lỗi',
              text: 'Cập nhật thông tin khách hàng thất bại',
            });
          });
          })
          .catch(function (error) {
            Swal.fire({
              icon: 'error',
              title: 'Lỗi',
              text: 'Đã xảy ra lỗi',
            });
          });
      }
    }
  }
  return false;
}

// Hàm kiểm tra số điện thoại
function isValidPhoneNumber(phoneNumber) {
  const phonePattern = /^\d{10}$/; // Định dạng số điện thoại gồm 10 chữ số

  return phonePattern.test(phoneNumber);
}
function openmodel() {
  check = 0;
  $('#exampleModalCenter').modal('show');
  const form = document.getElementById('myForm');
  document.getElementById('image-preview').src = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
  form.reset();
}


