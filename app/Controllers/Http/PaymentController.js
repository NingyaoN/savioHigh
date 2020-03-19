
const stripe = use("stripe")(process.env.s_PRIVATE);
const Razorpay = use('razorpay')
const instance = use("./utility/razorpayInstances");

class PaymentController {
    payment({ auth, view, request, response }) {
        // let params = {
        //     key: "rzp_test_kUkp3Wy1h8kxWH",
        //     currency: "INR",
        //     name: "SHS-2010",
        // }
        console.log("ppppppppppp")
        return view.render("displays.payment.originalPayment");
    }
    async paymentConfig({ request, response }) {
        return response.status(200).json({
            publicKey: process.env.STRIPE_PUBLISHABLE_KEY,
            basePrice: process.env.D_BASE_PRICE,
            currency: process.env.CURRENCY
        })
    }
    async createSession({ request, response }) {
        const domainURL = process.env.DOMAIN;
        const data = await request.all();
        const session = await stripe.checkout.sessions.create({
            payment_method_types: process.env.PAYMENT_METHODS.split(", "),
            locale: data.locale,
            line_items: [
                {
                    quantity: 1,
                    amount: process.env.D_BASE_PRICE,
                    name: "shs-2010",
                    images: ["https://picsum.photos/300/300?random=4"],
                    currency: process.env.CURRENCY,
                   // Keep the amount on the server to prevent customers from manipulating on client
                }
            ],
            // ?session_id={CHECKOUT_SESSION_ID} means the redirect will have the session ID set as a query param
            success_url: `${domainURL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${domainURL}/canceled.html`
        });
        const sessionId = session.id;
        console.log("session", session)
        return response.send({ sessionId });
    }
    async charged({ request, response }) {
        const data = await request.only(["amount"]);
        let params = {
            key: "rzp_test_kUkp3Wy1h8kxWH",
            currency: "INR",
            name: "SHS-2010",
        }

        var instance = new Razorpay({
            key_id: "rzp_test_kUkp3Wy1h8kxWH",
            key_secret: 'cKk5AgneTFbgNwXpNHYJkaIK'
        });

        const order = instance.orders.create({
            amount: data.amount,
            currency: params.currency,
            receipt: uuidv4(),
            payment_capture: 0
        });


        instance.orders.create(options, function (err, order) {
            console.log(order);
        });

        console.log(order);


    }
    success({ view }) {
        return view.render("payment.success")
    }
    cancel({ view }) {
        return view.render("payment.cancel")
    }
}

module.exports = PaymentController;