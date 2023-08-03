var employee = JSON.parse(sessionStorage.getItem("account"));

document.getElementById("userImage").setAttribute("src", employee.image);

function logout() {
    
    sessionStorage.clear();
    window.location.href = "index.html";
}