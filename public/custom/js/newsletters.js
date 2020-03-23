import {showToast} from './customToastr.js';


$("#send").click((e) => {
    toggleLoader();
    console.log("fsdf")
    const to = $("#to").val();
    const msg = $("#msg").val();
    const name = $("#name").val();
    const userID = $("#userID").val();
    $.ajax({
        type: "put",
        url: `/shs/${name}/newsletter/send`,
        data: {to, msg, userID},
        success: (data) => {
            toggleLoader();
            showToast("success", "Your query has been sent.", "toast-top-center", 1000);
            setTimeout(() => {
                location.reload();
            }, 1000)
        },
        error: (error) => {
            toggleLoader();
            showToast("error", error.responseJSON.msg, "toast-top-center", 1000);
            setTimeout(() => {
                location.reload();
            }, 1000)
        }
    })
})