import { Toast, showToast } from './customToastr.js'

$(".floatMe").hover(() => {
    let type = $("#admin").val();
    console.log(type)
    if (type != "true" || type == "undefined") return showToast("error", "You are not admin!", "toast-top-center", 1000);
})

$("#upload").click(() => {
    uploadFunc();
});


const uploadFunc = () => {
    let handle = $("#name").val();
    let type = $("#admin").val();
    if (type != "true" || type == "undefined") return showToast("error", "You are not admin!", "toast-top-center", 1000);
    var thumbnail = $("input[name='thumbnail']:checked").val();
    var fd = new FormData();
    var files = $('#file')[0].files[0];
    fd.append('file', files);

    for (var value of fd.values()) {
        console.log(value); 
     }
    $.ajax({
        url: thumbnail == "yes" ? `/shs/${handle}/upload/thumbnail` : `/shs/${handle}/upload/image`,
        type: 'put',
        data: fd,
        contentType: false,
        processData: false,
        success: function(response) {
            $("#file").val("");
            return showToast("success", "Success: Image uploaded successfully.", "toast-top-center", 2000);
        },
        error: () => {
            return showToast("error", "Error: Error Occured while uploading image. Please contact support.", "toast-top-center", 2000);
        }
    });
}