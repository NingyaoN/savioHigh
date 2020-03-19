// const logger = use("tklmovie/logger");
// const User = use("App/Models/User");
// const Review = use("App/Models/Review");
// const moment = require("moment");
// const phone = require("phone");
// const { validateAll } = use("Validator");
// const Hash = use("Hash");
// const _ = require("lodash");
// const Video = use("App/Models/Video");
// const Drive = use("Drive");
// const ObjectID = require("mongodb").ObjectID;

// class AdminController {
//   async dashboard({ request,response, view, auth }) {
//     const movies = await Video.find();
//     const user = await auth.getUser();
   
//     if(!movies) {
//       response.json({
//         message: "There is no  Movies"
//       });
//     }
//     const processMovies = await Promise.all( movies.map( async movie => {
//         let url;
//         const key  = movie.photo_id;
//         if(key[0]) {

//           const image = await Drive.disk("s3").exists(key[0]);
//           if(image) {
//             url = await Drive.disk("s3").getSignedUrl(key[0]);
//           }
//         }
//         movie.photo_id =  url;
//         return movie;
//     }));  
//     let premiumMovies = [];
//     let recentMovies = [];
//     let oldMovies = [];
//     let reviewMovies = [];
//     await processMovies.forEach(movie => {
//       if(movie.type == "premium") {
//         premiumMovies.push(movie);
//       }
//       if(movie.type == "recent") {
//         recentMovies.push(movie)
//       } 
//       if (movie.type == "old") {
//         oldMovies.push(movie);
//       } 
//       if(movie.review == true) {
//         reviewMovies.push(movie);
//       }
//     })

//   //mark as online user 
//     user.online = true;
//     await user.save();
//     return view.render("displays.admin.userdashboard", {
//      premiumMovies, 
//      recentMovies, 
//      oldMovies, 
//      reviewMovies,
//      movies
//      });
//   }
//   async manageuser({ request, view, auth }) {
//     logger.log(request, "debug", auth.user);
//     const user = await auth.getUser();
//     const theUser = await User.findOne({ _id: user._id });
//     const users = await User.find({ site: theUser.site });
//     return view.render("displays.admin.manageuser", { users });
//   }
//   async editPassword({ params, view }) {
//     const userDetail = await User.findOne({ _id: params.uid });
//     return view.render("displays.unsorted.changePassword", { userDetail });
//   }

//   async updatePassword({params,request, view}){
//     const data = request.only([
//       "oldpassword",
//       "newpassword",
//       "retypepassword",
//     ]);
//     const oldpass = await Hash.make(data.oldpassword);
//     const userDetail = await User.findOne({
//       _id: params.uid
//     });
//     const verifyPassword = await Hash.verify(
//       data.oldpassword,
//       userDetail.password
//     )

//     if (!verifyPassword) {
//       return view.render("displays.unsorted.msg", {
//         msg: `Old password does not match.<a href='/admin/manageuser'>Try again </a>`
//       });
//     } else if (data.newpassword !== data.retypepassword) {
//       return view.render("displays.unsorted.msg", {
//         msg: `New password and confirmed password does not match.<a href='/admin/manageuser'>Try again </a>`
//       });
//     } else if (data.newpassword && data.newpassword === data.retypepassword) {
//       userDetail.password = await Hash.make(data.newpassword);
//       await userDetail.save();
//       return view.render("displays.unsorted.msg", {
//         msg: `Your password has been changed successfully.`
//       });
//     }
//     return view.render("displays.unsorted.msg", {
//       msg: `Server Error in changing password. Contact Support`
//     });
//   }
//   async panel({view}) {
//     const fromDate = moment().startOf('month').toDate();
//     const toDate = moment().toDate();
//     const allUsers = await User.find()
//     let onlineUsers = [];
//     let monthlyRegisteredUsers = [];
//     await allUsers.forEach(user => {
//       if(user.online == true) {
//         onlineUsers.push(user);
//       }
//       if(user.created_at >= fromDate && user.created_at <= toDate) {
//         monthlyRegisteredUsers.push(user);
//       }
//     })
//     return view.render("displays.admin.panel", {onlineUsers, monthlyRegisteredUsers, allUsers});
//   }
//   async uploadPhoto({request, response, }) {
//     const data = await request.all();
//      let today = moment().format("DD-MM-YYYY");
//      data.photo_id = [];
//      request.multipart.file("photo", {}, async file => {
//       if (file.clientName === "") {
//         return;
//       }
//       const randomKey = uuidv4();
//       const key = `movie/${today}/${randomKey}/photo/${file.clientName}`;
//       data.photo_id.push(key);
//       const res = await Drive.disk("s3").put(key, file.stream);
//     });
//     await request.multipart.process();
//     const payload = {
//       title: data.title,
//       photo_id: data.photo_id
//     }
//     if(!payload) {
//       return response.status(500).json({
//         err: [
//           {message: "Error occured while uploading."}
//         ]
//       });
//     }
//     const saveVideo = await Video.create(payload);
//     const singleVideo = await Video.findOne({_id: saveVideo._id });
//     const video_id = singleVideo._id;
//     return response.status(200).json({video_id});
//   }
// }
// module.exports = AdminController;
