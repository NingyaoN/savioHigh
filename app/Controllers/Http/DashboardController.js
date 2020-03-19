const User = use("App/Models/User");
const Query = use("App/Models/Query");
const nodemailer = require('nodemailer');
const Video = use("App/Models/Video");
const Event = use("App/Models/Event");
const Drive = use("Drive");
const moment = use("moment");


class DashboardController{
  async supportView({view}) {
    return view.render("displays.unsorted.support");
  }
  async handleQuery({request, response, auth}) {
    const user = await auth.getUser();
    const data = await request.only(["name","msg"]);
    const from = user.email;
    if(data.msg.length <= 10) {
        return response.status(500).json({
          err: [
            {message: "Message too short"}
          ]
        });
    }
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
             user: 'ajaxning123@gmail.com',
             pass: 'ningshen'
         }
     });

     const mailOptions = {
      from: from, // sender address
      to: 'tklmovie123@gmail.com', // list of receivers
      subject: `Query from ${user.email}` , // Subject line
      html: `<p>${data.msg}</p>`// plain text body
    };

    transporter.sendMail(mailOptions,  async (err, info) =>  {
      if(err)
        console.log(err)
      else {
        const payload = {
          message: data.msg,
          user_email: user.email,
          user_id: user._id,
          date: moment().format("DD-MM-YYYY"),
          entryDate: moment().utcOffset("+5:30").toDate()
        }
        const query = await  Query.create(payload);
      }
   });
   return response.status(200).json({msg: data.msg})
  }
  async blogView({view}) {
    return view.render("displays.unsorted.blog");
  }
  async singleBlogView({view}) {
    return view.render("displays.unsorted.singleBlog");
  }
  async contactView({view}) {
    return view.render("displays.unsorted.contact");
  }
  // async saveContact({request, response, auth}) {
  //   const data = await request.only(["name", "msg"]);
  //   const user = await auth.getUser();

  //   if(!user) {
  //     return response.status(500).json({
  //       err: [
  //         {message: "There is no user."}
  //       ]
  //     })
  //   }
  //   const payload = {
  //     message: data.msg
  //   }
  //   const support = await Support.findOne({user_id: user._id});
  //   if(support) {
  //     support.message.push(payload);
  //     await support.markModified("message");
  //     await support.save();
  //   }
  //   const newPayload = {
  //     user_id: user._id,
  //     name: data.name,
  //     message: {
  //       message: data.msg,
  //   }
    
  // }
  // await Support.create(newPayload);
  // return response.status(200).json({
  //   newPayload
  // })
  // }
  async eventView({view}) {
    const events = await Event.find();
    if(!events) {
      return response.status(500).json({
        err: [
          {message: "There is no events."}
        ]
      })
    }
    const allEvents = await Promise.all(await events.map(async event => {
      let url;
        const key  = event.event_photo;
        if( key ) {
          const image = await Drive.disk("s3").exists(key);
          if(image) {
            url = await Drive.disk("s3").getSignedUrl(key);
          }
        }
        event.event_photo =  url;
        return event;
    }));
    const latestEvent = allEvents[allEvents.length - 1];
    const excludeLastEvent = allEvents.pop(allEvents[allEvents.length - 1]);
    return view.render('displays.unsorted.event',{latestEvent, excludeLastEvent});
  }
  async singleEventView({view, params}) {
    const event = await Event.findOne({_id: params.eid});
    console.log(event);
    if(!event) {
      return response.status(500).json({
        err: [
          {message: "There is no such event."}
        ]
      })
    }
    let url;
    const key  = event.event_photo;
    if( key ) {
      const image = await Drive.disk("s3").exists(key);
      if(image) {
        url = await Drive.disk("s3").getSignedUrl(key);
      }
    }
   // event.desc = event.description.substr(0, 19);
    event.event_photo =  url;
    
    return view.render("displays.unsorted.singleEvent", {event});
  }
  async galleryView({view}) {
    const videos = await Video.find()
    const allVideos = await Promise.all(await videos.map(async video => {
      let url, url2;
        const key  = video.photo_id;
        const key2 = video.video_id;
        if( key[0] && key2 ) {
          const image = await Drive.disk("s3").exists(key[0]);
          const movie = await Drive.disk("s3").exists(key2[0]);
          if(image && movie) {
            url = await Drive.disk("s3").getSignedUrl(key[0]);
            url2 = await Drive.disk("s3").getSignedUrl(key2[0]);
          }
        }
        video.photo_id =  url;
        video.video_id = url2;
        return video;
    }));
    console.log(allVideos) 
    return view.render("displays.unsorted.gallery", {allVideos});
  }
 }
module.exports =  DashboardController;