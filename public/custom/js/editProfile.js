import { Toast, showToast } from './customToastr.js'
$(document).ready(() => {
    $(".editProfile").hide();
})
$("#edit").click(() => {
   
    $(".editProfile").show();

    $(".profile").hide();
    $(".post").hide();
    $(".postSectoin").hide();
    $(".vl").hide();
})
$(".cancel").click(() => {
    $(".editProfile").hide();
    $(".profile").show();
    $(".post").show();
    $(".vl").show();
    $(".postSectoin").show();
}) 


$("#saveChanges").click(() => {
    showToast("info", "Saving", "toast-top-center", 20000);
    const name = $("#editName").val();
    const email = $("#email").val();
    const phone = $("#phone").val();
    const bio = $("#bio").val();
    console.log(name, email, phone, bio)
    if (!name) return showToast("error", "Name is required", "toast-top-center", 2000);
    if (!email) return showToast("error", "Email is require!", "toast-top-center", 2000);
    if (!phone) return showToast("error", "Phone is require", "toast-top-center", 2000);

    $.ajax({
        url: `/shs/user/edit/profile`,
        type: "put",
        data: {
            name,
            email,
            phone,
            bio,
        },
        success: (data) => {
            showToast("success", "Profile updated successfully.", "toast-top-center", 2000);
            setTimeout(() => {
                window.location.href = `/shs/${data.user.name}/profile`
            }, 1000);



        },
        error: () => {
            return showToast("error", "Something went wrong! Please try again.", "toast-top-center", 2000);
        }

    })
 })
// const editProfile = () => {
//     $("#name").removeAttr("disabled").focus();
//     $("#email").removeAttr("disabled");
//     $("#phone").removeAttr("disabled");
// };


$(document).ready(() => {
    const user = $("#userName").val();
    
    $.ajax({
        type: 'get',
        url: `/shs/retrieve/image`,
        success: ({displays, tag}) => {
                displays.forEach((image, idx) => {
                    $(`
                    <div class="col-sm-12 col-md-4 ftco-animate fadeInUp ftco-animated">
                    <div class="flip-container">
                    <div class=" flipper flipper${idx} mb-5" id="flipper${idx}">
                        <div class="front">
                            <img class="images" src="${image.photo_id}"/>
                            <br />
                            <a class="flipbutton btn btn-danger btn-sm" id="info${idx}" href="#"><i class="fas fa-forward"></i></a>
                            <a href="/shs/${user}/image/detail/${image._id}" class="btn btn-sm btn-danger" id="details">View Details</a>
                            <button class="btn btn-sm btn-danger" id="delete">Delete Image</button>
                        </div>
                        
                        <div class="back">
                            <h4 class="title"></h4>
                                <b>No info at this moment</b>
                            <button class="flipbutton btn btn-sm btn-danger" id="back${idx}" href="#"><i class="fas fa-backward"></i></a>
                        </div>
                    </div>
                
                </div>
                </div>
                    `).appendTo('.appendRq');
                    var info = document.getElementById(`info${idx}`);
                    var back = document.getElementById(`back${idx}`);
                    info.onclick = function(){
                        document.querySelector(`#flipper${idx}`).classList.toggle("flip");
                        return false;
                    }
                    back.onclick = function(e){ 
                        document.querySelector(`#flipper${idx}`).classList.toggle("flip");
                        return false;
                    }
                })
             
        },
        error: (err) => {
            console.log("---")
           if(err.responseJSON.msg) {
            showToast("warning", "You Don't have any post.", "toast-top-center", 2000);
            $(".appendRq").replaceWith("<p>${err.responseJSON.msg}</p>")
           } 
        }
        

    })
})

$("#selectAct").change(() => {
    if($("#selectAct").val() == "image") retrievePost("image");
    if($("#selectAct").val() == "blog") retrievePost("blog");
    
})

const retrievePost = (tag) => {
    showToast("info", "Loading... Please wait.", "toast-top-center", 2000);
    const user = $("#userName").val();
    
    $.ajax({
        type: 'get',
        url: `/shs/retrieve/${tag}`,
        success: ({displays, tag}) => {
              if(tag == "image") {
                  console.log("1", tag)
                displays.forEach((image, idx) => {
                    $(".appendRq").replaceWith(`
                    <div class="col-sm-12 col-md-4 ftco-animate fadeInUp ftco-animated">
                    <div class="flip-container">
                    <div class=" flipper flipper${idx} mb-5" id="flipper${idx}">
                        <div class="front">
                            <img src="${image.photo_id}"/>
                            <br />
                            <a class="flipbutton btn btn-danger btn-sm" id="info${idx}" href="#"><i class="fas fa-forward"></i></a>
                            <a href="/shs/${user}/image/detail/${image._id}" class="btn btn-sm btn-danger" id="details">View Details</a>
                            <button class="btn btn-sm btn-danger" id="delete">Delete Image</button>
                        </div>
                        
                        <div class="back">
                            <h4 class="title"></h4>
                            <b>No info at this moment</b>
                            <button class="flipbutton btn btn-sm btn-danger" id="back${idx}" href="#"><i class="fas fa-backward"></i></a>
                        </div>
                    </div>
                
                </div>
                </div>
                    `)
                    var info = document.getElementById(`info${idx}`);
                    var back = document.getElementById(`back${idx}`);
                    info.click(() => {
                        document.querySelector(`#flipper${idx}`).classList.toggle("flip");
                        return false;
                    })
                   
                    back.onclick = function(e){ 
                        document.querySelector(`#flipper${idx}`).classList.toggle("flip");
                        return false;
                    }
                })
            }
              if(tag == "blog") {
                    displays.forEach((image, idx) => {
                        $(".appendRq").replaceWith(`
                        <div class="col-sm-12 col-md-4 ftco-animate fadeInUp ftco-animated">
                        <div class="flip-container">
                        <div class="flipper flipper${idx}" id="flipper${idx}">
                            <div class="front">
                                <img src="${image.photo_id}"/>
                                <br />
                                <a class="flipbutton btn btn-danger btn-sm" id="info${idx}" href="#"><i class="fas fa-forward"></i></a>
                                <button class="btn btn-sm btn-danger" id="details">Read More</button>
                                <button class="btn btn-sm btn-danger" id="delete">Delete Post</button>
                            </div>
                            
                            <div class="back">
                                <h4 class="title"></h4>
                               <b>No info at the moment</b>
                                <button class="flipbutton btn btn-sm btn-danger" id="back${idx}" href="#"><i class="fas fa-backward"></i></a>
                            </div>
                        </div>
                    
                    </div>
                    </div>
                        `)
        
                        var info = document.getElementById(`info${idx}`);
                        var back = document.getElementById(`back${idx}`);
                    
                        info.onclick = function(){
                            document.querySelector(`#flipper${idx}`).classList.toggle("flip");
                            return false;
                        }
                       
                        back.onclick = function(e){
                            // e.preventDefault();
                            document.querySelector(`#flipper${idx}`).classList.toggle("flip");
                            return false;
                            
                        }
                       })
                }
              
        },
        error: (err) => {
            console.log("display this")
           if(err.responseJSON.msg) {
            showToast("warning", "You Don't have any post.", "toast-top-center", 2000);
                $(".appendRq").replaceWith(`
                    <p>${err.responseJSON.msg}</p>
                `);
           }
        }
        

    })
}


// const retrieveBlog = () => {
//     console.log("blog")

//     $.ajax({
//         type: 'get',
//         url: `/shs/retrieve/blog`,
//         success: ({ blogs,  }) => {
//             console.log("return")
//         }
//     })
// }