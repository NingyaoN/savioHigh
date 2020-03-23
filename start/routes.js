"use strict";

const Route = use("Route");
//Route.get("/", "AppController.dashboard");
Route.get("/privacy", "AppController.privacy");
Route.get("/shs/common/gallery/:index", "GalleryController.commonGallery");
Route.get("/get/thumbnail", "GalleryController.getThumbnail");
Route.put("/send/mail", "AppController.sendMail");
Route.get("/shs/about", "AppController.about");
//Developer's routes
Route.get("/developer", "DeveloperController.landing");
Route.group(() => {


}).middleware(["userCheck"]);

Route.get("/", "AppController.dashboard").middleware(["guest"])
Route.get("/shs/blog/single/view/:ID/:blogID", "BlogController.singleView");

Route.group(() => {
    Route.get("/reset-password", "UserController.resetPassword");
    Route.put("/reset-password/:email", "UserController.checkEmail");
    Route.put("/update-password/:email", "UserController.updatePassword");
    // User Registration
    Route.post("/check/email", "UserController.checkEmail");
    Route.get("request", "UserController.create");
  
    Route.get("register", "UserController.registerUser");
    Route.post("register", "UserController.storeUser");
    // User Signing in
    Route.get("login", "SessionController.create");
    Route.post("login", "SessionController.store");
    //View Gallery  
}).prefix("shs/user").middleware(["guest"])


Route.group(() => {
    Route.get("/users", "ProfileController.allusers");
    Route.get("/user/:userID/fetch", "ProfileController.getUser");
    Route.post("/user/profile/:userID/update", "ProfileController.updateProfile")
}).prefix("api")
// User Session Controller (loging out)
Route.group(() => {
    //test
    //payment 
    Route.get("/shs/payment", "PaymentController.payment");
    Route.get("/payment/config", "PaymentController.paymentConfig");
    Route.post("/create-checkout-session", "PaymentController.createSession")
    Route.get("/success", "PaymentController.success");
    Route.get("/cancel", "PaymentController.cancel");

    //Authenticated 
    Route.get("/shs/:handle", "AppController.authenticatedRedirect")

    //VIew Gallery
    Route.get("/shs/:username/gallery/", "AppController.gallery");
    Route.get("/shs/:handle/bulk/gallery/:year", "GalleryController.bulkGallery");
    Route.get("/shs/:handle/gallery/:index", "GalleryController.gallery");
    Route.get("/shs/:handle/image/detail/:imageID", "GalleryController.imageDetail");
    Route.put("/like/image/:imageID", "GalleryController.like");
    Route.put("/comment/image/:imageID", "GalleryController.comment");
    Route.put("/comment/image/reply/:imageID/:commentID", "GalleryController.replyComment");

    // Bug Report
    Route.get("bug-report", "BugreportController.bugReport");
    Route.put("/shs/:id/bug-report", "BugreportController.storeReport");
    Route.get("/shs/:email/bugs", "BugreportController.bugs");

    Route.get("/shs/:handle/contact", "AppController.contact");


    
    //User section
    Route.get("/shs/:handle/profile", "ProfileController.profile");
    Route.put("/shs/user/edit/profile", "ProfileController.editProfile");
    Route.get("/shs/retrieve/:tag", "ProfileController.retrievePost");
   

    //Blogs
    Route.get("/shs/:handle/blog", "AppController.blog");
    Route.get("/shs/:email/create-blog", "BlogController.create")
    Route.put("/shs/:email/blog/storeImage", "BlogController.storeImage");
    Route.put("/shs/:email/blog/create/:userID/:blogID", "BlogController.createBlog");
    Route.get("/retrieve/blogs", "BlogController.retrieveBlogs");
    Route.get("/shs/:handle/blog/single/view/:ID/:blogID", "BlogController.singleView");
    Route.put("/comments/:ID/:blogID", "BlogController.comment");
    Route.put('/comment/reply/:ID/:blogID/:commentID', "BlogController.storeReply");
    
    //Create todo list
    Route.get("/shs/:handle/todo", "TodoController.display");
    Route.get("/shs/get/todo", "TodoController.getTodo");
    Route.put("/shs/:email/add/todo", "TodoController.addTodo");
    Route.post("/shs/todo/delete", "TodoController.deleteTodo");
    Route.get("logout", "SessionController.delete");
}).middleware(["auth:session"]);

Route.group(() => {
    // Upload Image
    // Route.get("/:email/upload", "AppController.uploadImage");
    Route.put("/:name/upload/image", "AppController.storeImage");
    Route.put("/:name/upload/thumbnail", "AppController.storeThumbnail");

}).prefix("shs").middleware(["auth:session, adminAction"]);

Route.get('/unauthorized', ({ view }) => {
    return view.render("displays.unsorted.unauthorized");
})




//Unauthenticated routes that get redirected to app if loggedin

// Route.group(() => {


//   Route.get('user/forgotpassword', "UserController.forgotPassword");
//   Route.get('user/checkemail', 'UserController.checkEmail');
//   Route.post("user/:email/forgotpassword", "UserController.updatePassword");
//   //notification
//   Route.post("/dashboard", "NotificationController.webpushnotification");
// }).middleware(["guest"]);



// //Unauthenticated API routes
// Route.group(() => {
//   Route.put("login", "SessionController.apistore");
// }).prefix("api/v1");

// //authenticated view routes
// Route.group(() => {


//   Route.get("dashboard", "AdminController.dashboard");

//   Route.get("app", "SessionController.app");
//   Route.get("testjson", "UserController.postTest");
//   Route.put("users", "UserController.search");
//   Route.get("me", "UserController.me");
//   Route.get("profile", "UserController.userprofile");
//  // Route.get("/app/:usertype/:vid/stream", "VideoController.stream");

//   Route.get("videos", "PanelController.allMovies");
//   Route.get("app/video/:vid/watch", "VideoController.stream");
//   //manage user
//   Route.get("app/user/:uid/setting", "SettingController.profileSetting");
//   Route.get("user/card/:uid/info", "SettingController.cardInfo");

//   //review
//   Route.put("/video/review/:vid/likes", "VideoController.likes");
//   Route.get("/video/review/:vid/review", "VideoController.review");

//   //queries 
//   Route.get("support", "DashboardController.supportView");
//  // Route.put("user/query", "DashboardController.handleQuery");

//   //blog
//   Route.get("/user/blog", "DashboardController.blogView");
//   Route.get("/user/single/blog", "DashboardController.singleBlogView");

//   //concact
//   Route.get("/user/contact", "DashboardController.contactView");
//   Route.put("user/saveContact", "DashboardController.handleQuery");
//   //event
//   Route.get("/user/event", "DashboardController.eventView");
//   Route.get("/user/single/:eid/event", "DashboardController.singleEventView");

//   //premium
//   Route.get("/user/premium", "UserController.premiumPage");
//   Route.get("/user/:uid/payment", "UserController.paymentPage");
//   Route.get("/user/payment/error", "UserController.paymentError");
//   Route.post("/user/premium/pay", "UserController.pay");
//   Route.post("/user/payment/success", "UserController.success");
//   Route.put("/user/premium/question", "UserController.premiumQuestion")
//   Route.get("/user/payment/successrender", "UserController.successRender");
//   Route.get("/user/payment/failure", "UserController.failure");

//   //gallery
//   Route.get("/user/gallery", "DashboardController.galleryView");

//   //payment
//   Route.post("/user/:uid/payment", "PaymentController.savePayment");
// }).middleware(["auth:session"]);

// // Admin view Routes
// Route.group(() => {
//   Route.get("admin/panel", "AdminController.panel")
//   Route.get("admin/video/upload", "VideoController.uploadForm");
//   Route.put("admin/video/upload/:vid/movie", "VideoController.upload");
//   Route.post("admin/video/upload/:vid/video", "VideoController.uploadVideo");
//   Route.post("admin/video/upload/photo", "VideoController.uploadPhoto");
//   Route.get("admin/video/history", "VideoController.history");
//   //manage movie
//   Route.put("admin/video/:vid/delete", "VideoController.delete");
//   Route.put("admin/video/:vid/displayReview", "VideoController.displayRreview");
//   Route.get("admin/video/uploadedVideos", "VideoController.uploadedMovies");
//   Route.get("video/all", "PanelController.allVideo");
//   Route.get("/video/recent", "PanelController.recentVideos");
//   Route.get("/video/:vid/edit", "VideoController.editVideo");
//   Route.get("/video/:vid/history", "VideoController.videoHistory")
//   //users
//   Route.get("user/manage", "PanelController.showUser");
//   //manage query
//   Route.get('/admin/query', "PanelController.query");
//   Route.get("/admin/user/:uid/profile", "PanelController.userProfile");
//   Route.put("/admin/user/:qid/query", "PanelController.deleteQuery");

//   //event
//   Route.get("admin/event/add", "EventController.getEvent");
//   Route.post("/admin/event/save/photo", "EventController.saveEventPhoto")
//   Route.put('/admin/event/save', "EventController.saveEvent");
//   Route.get("/admin/view/events", "EventController.viewEvents");
//   Route.get("/admin/event/:eid/view", "EventController.singleEvent");
// }).middleware(["auth:session", "admin"]);

// Route.get("*", "ErrorController.handleunauthorized");