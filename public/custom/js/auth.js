$(document).ready(() => {
    localStorage.setItem("authUser", $("#userID").val());
    console.log(localStorage.getItem("authUser"))
})