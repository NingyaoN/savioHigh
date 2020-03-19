import { Toast, showToast } from './customToastr.js'

$(document).ready(() => {
})
$("#selectAction").change(() => {
    console.log("fsdfdsfdsf")
    let action = $("#selectAction").val();
    const name = $('#name').val();
    console.log(action)
    if (action == "todo") return window.location.href = `/shs/${name}/todo`;
    if (action == "profile") return window.location.href = `/shs/${name}/profile`;
    if (action == "createBug") return window.location.href = `/bug-report`;
    if (action == "developer") return window.location.href = `/developer`;
    if (action == "donate") return window.location.href = "/shs/payment";
    if (action == "privacy") return window.location.href = "/privacy";
    if (action == "logout") {
        showToast("warning", "Loging out ...", "toast-top-center", 3000);
        setTimeout(() => {
            return window.location.href = "/logout";
        }, 3000);
    }
})
