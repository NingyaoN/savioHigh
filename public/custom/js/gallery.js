import { showToast } from "./customToastr.js";

 if($("#liked").val() == "false" || $("#liked").val() == "undefined" || $("#liked").val() == "") 
    localStorage.setItem("like", false)
if($("#liked").val() == "true") {
    $(this).html('<i class="fa fa-heart" aria-hidden="true"></i>Liked');
    $(this).children('.fa-heart').addClass('animate-like');
    localStorage.setItem("like", true)
}
 
console.log(localStorage.getItem("like"))

localStorage.setItem("likeCount", 0)
 $(function(){
    $(document).on('click', '.like-review', function(e) {
        const imageID = $("#imageID").val();
        if(localStorage.getItem("like") == "false") {
            localStorage.setItem("like", true);
            localStorage.setItem("likeCount", 1)
            $(this).html('<i class="fa fa-heart" aria-hidden="true"></i>Liked');
            $(this).children('.fa-heart').addClass('animate-like');

            $.ajax({
                type: 'put',
                url: `/like/image/${imageID}`,
                data: {like: localStorage.getItem("like")},
                success: () => {
                    location.reload();
                },
                error: () => {
                    showToast("error", "Error occured. Please contact support.", "toast-top-center", 1500);
                }
            })
        } else {
            localStorage.setItem("like", false)
            localStorage.setItem("likeCount", 0)
            $(this).html('<i class="fa fa-heart" aria-hidden="true"></i>Like');
            $(this).children('.fa-heart').addClass('animate-like');
            $.ajax({
                type: 'put',
                url: `/like/image/${imageID}`,
                data: {like: localStorage.getItem("like")},
                success: () => {
                    location.reload();
                },
                error: () => {
                    showToast("error", "Error occured. Please contact support.", "toast-top-center", 1500);
                }
            })
        }
    });
});



$("#comment").click(() => {
    comment();
})

let commentID;
const comment = () => {
    showToast("info", "Submitting your post...", "toast-top-center", 1500);
    let desc = $("#desc").val();
    const imageID = $("#imageID").val();
    console.log("fsdf")
    $.ajax({
        type: 'put',
        url:  `/comment/image/${imageID}`,
        data: {desc},
        success: ({ image }) => {
            showToast("success", "Your post submitted successfully.",  "toast-top-center", 1500)
            setTimeout(() => {
                location.reload();
            }, 1500)
        },
        error: () => {

        }
    })
}