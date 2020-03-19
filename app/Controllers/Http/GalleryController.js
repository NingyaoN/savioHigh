const Image = use("App/Models/Image");
const Thumbnail = use("App/Models/Thumbnail");
const uuidv4 = require("uuid/v4");
const Drive = use("Drive");
const moment = use("moment");
const { validateAll } = use("Validator");
const { ObjectID } = use("mongodb")
const uuid = use("uuid/v4");

class GalleryController {
   async gallery({request, response, view, auth}) {
    let images = await Image.find({year: request.params.index});
    images = await Promise.all(await images.map(async image => {
        let url;
        const key = image.photo_id;
        if (key[0]) {
            const image = await Drive.disk("s3").exists(key[0]);
            if (image) {
                url = await Drive.disk("s3").getSignedUrl(key[0]);
            }
        }
        image.photo_id = url;
        return image;
    }))
    return view.render('dashboard.singleGallery', { images }); 
   }
    async imageDetail ({ request, response, auth, view }) {
        const id = request.params.imageID;
     
        if(!id) return response.status(500).json({err: "Image does not exist."});
        const image = await Image.findOne({_id: id});
        const user = await auth.getUser();
        let url;
        const key = image.photo_id;
        if (key[0]) {
            const image = await Drive.disk("s3").exists(key[0]);
            if (image) {
                url = await Drive.disk("s3").getSignedUrl(key[0]);
            }
        }
        image.photo_id = url;
        let liked = false;
        let i = 0;
        for(i;i<image.like.length;i++) {
            if(JSON.stringify(image.like[i].likeBy.userID) ==  JSON.stringify(user._id)) liked = true;
        }
        let likeCount = image.like.length ||  0;
        let commentCount = image.comments.length || 0;
        return view.render("dashboard.gallery.details", {image, liked, likeCount, commentCount});
    }

    async like({request, response, auth}) {
      const imageID = request.params.imageID;
      console.log(imageID)

      let image = await Image.findOne({_id: imageID});
      if(!image) return response.status(500).json({err: "There is no such image."});
      const user = await auth.getUser();
      const {like} = await request.only(["like"])
      console.log(like)
      if(like == "true") {
          image.like.push({
              likeBy: {
                 userID: user._id,
                 user_name: user.name, 
              }
          })
        await image.markModified("like");
        await image.save();
      } 
      if (like == "false") {
        let i=0;
        console.log("hit me")
        for (i; i < image.like.length; i++) {
            if (JSON.stringify(image.like[i].likeBy.userID) == JSON.stringify(user._id)) {
                image.like.splice(i, 1);
            }
        }
        await image.markModified("like");
        await image.save();
      }
    }

    async comment({request, response, auth }) {
        const image = await Image.findOne({_id: request.params.imageID});
        const {desc} = await request.only(["desc"]);
        const user = await auth.getUser();

        const payload = {
            comment: desc,
            commentID: uuid(),
            commentor_details: user,
            date: moment().format("MMM Do YY"),
            replies: [],
        }

        image.comments.push(payload);
        await image.markModified("comments");
        await image.save();
        return response.status(200).json({ image })
    }

    async replyComment({request, response, auth}) {
        const user = await auth.getUser();
        const imageID = request.params.imageID;
        const commentID = request.params.commentID;
        const {replyMsg}  = await request.only(["replyMsg"])
        const image = await Image.findOne({_id: imageID});
    
        image.comments.forEach(comment => {
            if(comment.commentID == commentID) {
                comment.replies.push({
                    reply: replyMsg,
                    replier_details: user,
                    date: moment().format("MMM Do, YY"),
                    replyID: uuid(),
                })
            }
        })

        await image.markModified("comments");
        await image.save();

        return response.status(200).json({image});
    }

    async bulkGallery({response, request, view, auth }) {
        const images = await Image.find({year: request.params.year});
        if(!images) return response.status(500).json({msg: "There is no image."})

        const allImage = await Promise.all(await images.map(async image => {
            let url;
            const key = image.photo_id;
            if (key[0]) {
                const image = await Drive.disk("s3").exists(key[0]);
                if (image) {
                    url = await Drive.disk("s3").getSignedUrl(key[0]);
                }
            }
            image.photo_id = url;
            return image;
        }));
        return view.render("dashboard.gallery.bulkGallery", {allImage, year: request.params.year});
    }
}


module.exports = GalleryController;