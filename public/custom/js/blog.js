import { Toast, showToast } from './customToastr.js'

$("#image_upload").click(() => {
    uploadImage();
});

$("#upload").click(() => {
    uploadBlog()
});

const reloadPage = () => {
    return location.reload();
}
let blogID, userID, blog_superID;
const uploadImage = () => {
    let name = $("#name").val();
    var fd = new FormData();
    var files = $('#file')[0].files[0];
    fd.append('file', files);
    // Display the values
    for (var value of fd.values()) {
        console.log(value);
    }
    $.ajax({
        url: `/shs/${name}/blog/storeImage`,
        type: 'put',
        data: fd,
        contentType: false,
        processData: false,
        success: function(response) {
            console.log(response)
            blogID = response.blog_id;
            userID = response.blog.user_details.user_id
            blog_superID = response.blog._id
            return showToast("success", "Image uploaded", "toast-top-center", 2000);
        },
        error: () => {
            return showToast("error", "Image Uploading failed! Please contact support", "toast-top-center", 2000);
        }
    });
}

const uploadBlog = () => {
    console.log(blogID, userID, blog_superID)
    let name = $("#name").val();
    const title = $("#title").val();
    const about = $("#about").val();
    const desc = $.trim($("#desc").val());
    const payload = {
        title,
        desc,
        blog_superID,
        about,
    }
    $.ajax({
        url: blogID == "" ? `/shs/${name}/blog/create` : `/shs/${name}/blog/create/${userID}/${blogID}`,
        type: 'put',
        data: payload,
        success: (data) => {
            showToast("success", data.msg, "toast-top-center", 2000);
            setTimeout(reloadPage, 1500);
        },
        error: (err) => {
            return showToast("error", err.msg, "toast-top-center", 2000);
        }
    });
}