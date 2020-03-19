

export function Toast(type, css, msg, duration) {
    this.type = type;
    this.css = css;
    this.msg = msg;
    this.duration = duration;
}

// export var toasts = [
//     new Toast('error', 'toast-bottom-full-width', 'This is positioned in the bottom full width. You can also style the icon any way you like.'),
//     new Toast('info', 'toast-top-full-width'),
//     new Toast('warning', 'toast-top-left', 'This is positioned in the top left. You can also style the icon any way you like.'),
//     new Toast('success', 'toast-top-right', 'top right'),
//     new Toast(" ", "", ""),
//     new Toast('error', 'toast-bottom-left', 'bottom left')
// ];

toastr.options.positionClass = 'toast-top-full-width';
toastr.options.extendedTimeOut = 0; //1000;
toastr.options.timeOut = 500;
toastr.options.showDuration = 2000;
toastr.options.fadeOut = 100;
toastr.options.fadeIn = 100;
toastr.options.progressBar = true;
var i = 0;

$('#tryMe').click(function () {
    $('#tryMe').prop('disabled', true);
    delayToasts();
});

// function delayToasts() {
//     if (i === toasts.length) { return; }
//     var delay = i === 0 ? 0 : 2100;
//     window.setTimeout(function () { showToast(); }, delay);

//     // re-enable the button        
//     if (i === toasts.length - 1) {
//         window.setTimeout(function () {
//             $('#tryMe').prop('disabled', false);
//             i = 0;
//         }, delay + 1000);
//     }
// }

export function showToast(error, msg ,pos, duration) {
    toastr.options.positionClass = pos;
    toastr.options.showDuration = duration;
    toastr.options.progressBar = true;
    new Toast(error, pos, msg);
    toastr[error](msg);
    //delayToasts();
}

