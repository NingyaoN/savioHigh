import { Toast, showToast } from './customToastr.js'

$("#comment").click(() => {
    let msg = $("#message").val();
    const ID = $("#ID").val();
    const blogID = $("#blogID").val();
    $.ajax({
        url: `/comments/${ID}/${blogID}`,
        type: "put",
        data: { msg },
        success: (data) => {
            showToast("success", data.msg, "toast-top-center", 1500);
            setTimeout(() => {
                location.reload();
            }, 1500);
        },
        error: () => {

        }
    })
})