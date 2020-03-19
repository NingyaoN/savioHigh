// var createCheckoutSession = stripe => {
//     const payload = {
//         locale: "en"
//     }
//     $.ajax({
//         url: "/create-checkout-session",
//         type: "post",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         data: payload,
//         success: (result) => {
//             console.log(data);
//         }
//     });
//   };


//   $.ajax({
//       url: "/payment/config",
//       type: "get",
//       success: (result) => {
//             window.config = result.json();
//             var stripe = Stripe(config.publicKey);
//             $("#pay").click( evt => {
//                 createCheckoutSession(stripe);
//             })
//       }
//   })
// /* Handle any errors returns from Checkout  */
// var handleResult = function(result) {
//     if (result.error) {
//      alert("Error happens")
//     }
//   };



// var createCheckoutSession = function() {
//     return  fetch("/create-checkout-session", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json"
//       },
//       body: JSON.stringify({
//         locale: "en"
//       })
//     }).then(function(result) {

//     });
//   };


// fetch("/payment/config")
//   .then(function(result) {
//     return result.json();
//   })
//   .then(function(json) {
//     console.log("json", json)
//     window.config = json;
//     var stripe = Stripe(config.publicKey);
//     // Setup event handler to create a Checkout Session on submit
//     document.querySelector("#pay").addEventListener("click", (evt)  => {
//       createCheckoutSession(stripe).then((result) => {
//         stripe.redirectToCheckout({sessionId: result.sessionId}).then(handleResult);
//       });
//     });
//   });