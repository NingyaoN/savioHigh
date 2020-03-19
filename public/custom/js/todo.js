import { Toast, showToast } from './customToastr.js'


    // $(".desc").hide();
    // $("#add-todo").click(() => {
    //     $(".desc").show();
    //     $("#add-todo").hide();
    // }) 

    // $("#cancel").click(() => {
    //     $("#add-todo").show();
    //     $(".desc").hide();
    // })

    $("#add").click(() => {
        console.log("clicked")
        const name = $("#name").val();
        const desc = $.trim($("#description").val());
        const todoDate = $("#todo-date").val();
        const todoTime = $("#todo-time").val();
        const venue = $("#todo-venue").val();
        const about = $("#todo-about").val();
        if(!todoDate) return showToast("error", "Please select date", "toast-top-center", 2000);
        if(!todoTime) return showToast("error", "Please Select Timing.", "toast-top-center", 2000);
        if(!about) return showToast("error", "Please enter what it is about.", "toast-top-center", 2000);
        if(!about) return showToast("error", "Please enter venue.", "toast-top-center", 2000);
        if(!desc.length) return showToast("error", "Description cannot be empty", "toast-top-center", 2000);
       
        $.ajax({
            url:`/shs/${name}/add/todo`,
            type: 'put',
            data: { desc, todoDate, todoTime, venue },
            success: (data) => {
                location.reload();
            },
            error: () => {

            }
        })
        
    })

  

    
    $("#fetchData").change(() => {
        alert("fetching")
    })

