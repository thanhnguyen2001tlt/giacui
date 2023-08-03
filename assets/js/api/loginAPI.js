const url = 'https://apigiacui.vercel.app/api/login';

function validateForm() {
  var username = document.getElementById("loginEmail").value;
  var password = document.getElementById("loginPassword").value;

  var usernameError = document.getElementById("loginEmailError");
  var passwordError = document.getElementById("loginPasswordError");
  var loginError = document.getElementById("loginError");

  // Đặt nội dung thông báo lỗi về rỗng trước mỗi lần kiểm tra
  usernameError.innerHTML = "";
  passwordError.innerHTML = "";

  if (username === "") {
    usernameError.innerHTML = "Vui lòng điền tên đăng nhập";
    return false;
  }

  if (password === "") {
    passwordError.innerHTML = "Vui lòng điền mật khẩu";
    return false;
  }

  if (!(username === "") && !(password === "")) {
    const fetchData = async () => {
      try {
        const data = {
          username: username,
          password: password
        };

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        const result = await response.json();

        if (undefined !== result.error) {
          loginError.innerHTML = result.error;
        } else {
          loginError.innerHTML = "";

          sessionStorage.setItem("token", result.token);
          sessionStorage.setItem("account", JSON.stringify(result.employee));
          window.location.href = "/home.html";
        }

      } catch (error) {
        console.error('Đã xảy ra lỗi:', error);
      }
    };

    fetchData();
    return false;
  }

  return true;
}
