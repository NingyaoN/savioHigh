import { Toast, showToast } from './customToastr.js'

$("#email").change(() => {
    checkEmail();
})

const checkEmail = () => {

    // let email = $("#email").val();
    // console.log("HIT", email)
    // $.ajax({
    //     type: "POST",
    //     url: "/shs/user/check/email",

    //     data: { email },
    //     success: () => {
    //         showToast( "success", "Email Check success. CONTINUE",  "toast-top-center" , 3000) 
    //     },
    //     error: (err) => {
    //         console.log(err)
    //         showToast( "error", "Sorry! Email is already taken.",  "toast-top-center" , 3000) 
    //     }
    // })
}


$("#register").on("click", () => {
    signup();
})

const signup = () => {
    
    let name = $("#regname").val();
    let email = $("#regemail").val();
    let password = $("#regpassword").val();
    let cpassword = $("#c_password").val();
    const errors = {
        name: "Name is required.",
        email: "Email is required.",
        password: "Password is required.",
        cpassword: "Confirm password is required",
        pmatch: "Password does not match",
        pshort: "Password is too short",
        registered: "REGISTERED SUCCESSFULLY."
    };

    if (!name) {
        
        $(".error1").text("Required")
        return showToast("error", errors.name, "toast-top-center", 2000);
    }
    if (!email) {
        
        $(".error2").text("Required")
        return showToast("error", errors.email, "toast-top-center", 2000);
    }
    if (!password) {
        
        $(".error4").text("Required")
        return showToast("error", errors.password, "toast-top-center", 2000);
    }
    if (password.length < 5) {
        
        return showToast("error", errors.pshort, "toast-top-center", 2000);
    }
    if (!cpassword) {
        
        return showToast("error", errors.cpassword, "toast-top-center", 2000);
    }
    if (password != cpassword) {
        
        return showToast("error", errors.pmatch, "toast-top-center", 2000);
    }


    const payload = {
        name,
        email,
        password,
        cpassword
    }
    $.ajax({
        type: `POST`,
        url: `/shs/user/register`,
        data: payload,
        success: (data) => {
            showToast("success", "Registered Successfull. Kindly Login!", "toast-top-center", 2500);
            document.querySelector("#flipper").classList.toggle("flip");
        },
        error: (err) => {
            showToast("error", "Errors occured!. Please contact support.", "toast-top-center", 2000);
            $(`
                <p>'Duplicate Entry: User with same email already exist. Please Try with another email.'</p>
            `).appendTo("#register_err");

            $("#email").val("");
        }
    })
}