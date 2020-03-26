const User = use("App/Models/User");
const Image = use("App/Models/Image");
const Blog = use("App/Models/Blog");
const Thumbnail = use('App/Models/Thumbnail');
const uuidv4 = require("uuid/v4");
const Drive = use("Drive");
const moment = use("moment");
const nodemailer = use("nodemailer");
const { validateAll } = use("Validator");

const Helpers = use('Helpers');
class AppController {
    about({ view }) {
        return view.render('dashboard.about')
    }
    privacy({ view }) {
        return view.render("privacy");
    }
    async dashboard({view}) {
        return view.render("landing")
    }
    async gallery({ auth, request, view }) {
        const thumbnails = await Thumbnail.find();
        if (!thumbnails) return response.status(404).json({ msg: "No thumbnail found" });

        let allThumbnail = await Promise.all(await thumbnails.map(async image => {
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
           
            console.log(allThumbnail)
        // const allThumbnail = [];
        return view.render("dashboard.gallery", { allThumbnail, count: allThumbnail.length })
    }
    async authenticatedRedirect({ view }) {
        // let images = await Image.find();
        // images = await Promise.all(await images.map(async image => {
        //     let url;
        //     const key = image.photo_id;
        //     if (key[0]) {
        //         const image = await Drive.disk("s3").exists(key[0]);
        //         if (image) {
        //             url = await Drive.disk("s3").getSignedUrl(key[0]);
        //         }
        //     }
        //     image.photo_id = url;
        //     return image;
        // }))
        // console.log(images)

         const images = [];
        return view.render('dashboard.dashboard', { images, year: moment().format("MM-YYYY")}); 

    }
    async uploadImage({ request, response, auth, view }) {
        const user = await auth.getUser();
        if (!user.admin) return response.redirect("/unauthorized");
        return view.render("displays.uploads.uploadImage");
    }

    async storeImage({ request, response, auth }) {
        const user = await auth.getUser();
        const data = await request.all();
        let thisYear = moment().format("YYYY");
        data.photo_id = [];
        request.multipart.file("file", {}, async file => {
            if (file.clientName === "") {
                return;
            }
            const randomKey = uuidv4();
            const key = `${thisYear}/${randomKey}/photo/${file.clientName}`;
            data.photo_id.push(key);
            const res = await Drive.disk("s3").put(key, file.stream);
        });
        const title = moment().format("DD-MM-YYYY");
        await request.multipart.process();
        const payload = {
            title,
            photo_id: data.photo_id,
            year: moment().format('YYYY'),
            like: [],
            comments: [],
            user_details: {
                user_name: user.name,
                userID: user._id,
            }
        }
        if (!payload) {
            return response.status(500).json({
                err: [
                    { message: "Error occured while uploading." }
                ]
            });
        }
        const image = await Image.create(payload)
        return response.status(200).json({ photo_id: image.photo_id });
    }
    async storeThumbnail({ request, response, auth }) {
        const data = await request.all();
        let thisYear = moment().format("YYYY");
        data.photo_id = [];
        request.multipart.file("file", {}, async file => {
            if (file.clientName === "") {
                return;
            }
            const randomKey = uuidv4();
            const key = `${thisYear}/${randomKey}/photo/${file.clientName}`;
            data.photo_id.push(key);
            const res = await Drive.disk("s3").put(key, file.stream);
        });
        const title = moment().format("DD-MM-YYYY");
        const tag = "thumbnail";
        await request.multipart.process();
        const payload = {
            title,
            tag,
            photo_id: data.photo_id,
            year: moment().format("YYYY"),
            like: [],
            comments: []
        }
        if (!payload) {
            return response.status(500).json({
                err: [
                    { message: "Error occured while uploading." }
                ]
            });
        }
        const image = await Thumbnail.create(payload)
        delete payload.tag;
        await Image.create(payload);
        return response.status(200).json({ photo_id: image.photo_id });
    }
    async getContact({ request, response }) {
        const users = await User.find();
        if (!users) return response.status(500).json({ msg: "User not found." })
        const admins = [];
        users.map(user => {
            if (user.admin) admins.push(user);
        });
        if (admins.length == 0) return response.status(500).json({ msg: "Admin User not found. Contact would not be loaded." })
        return response.status(200).json({ admins })
    }
    async sendMail({ request, response }) {

    }

    async blog({ view }) {
        const blogs = await Blog.find();
        let allBlogs = [];
        let blogTypes = [];

        let i, j;
        for (i = 0; i < blogs.length; i++) {
            for (j = 0; j < blogs[i].user_blog.length; j++) {
                let url;
                blogTypes.push(blogs[i].user_blog[j].about)
                const key = blogs[i].user_blog[j].photo_id;
                if (key[0]) {
                    const image = await Drive.disk("s3").exists(key[0]);
                    if (image) {
                        url = await Drive.disk("s3").getSignedUrl(key[0]);
                    }
                }
                blogs[i].user_blog[j].photo_id = url;
                 blogs[i].user_blog[j]._id = blogs[i]._id,
                blogs[i].user_blog[j].user_id = blogs[i].user_details.user_id;
                blogs[i].user_blog[j].count = blogs[i].user_blog[j].comments.length;
                blogs[i].user_blog[j].desc = blogs[i].user_blog[j].desc.slice(0, 30) + '...'
                allBlogs.push(blogs[i].user_blog[j]);
            }
        }
        blogTypes = blogTypes.filter(function(item, pos) {
            return blogTypes.indexOf(item) == pos;
        })
        return view.render("dashboard.blog", { allBlogs, blogTypes });
    }

    async contact({ request, response, view }) {
        const users = await User.find();
        if (!users) return response.status(500).json({ msg: "User not found." })
        const admins = [];
        users.map(user => {
            if (user.admin) admins.push(user);
        });
        if (admins.length == 0) return response.status(500).json({ msg: "Admin User not found. Contact would not be loaded." })
        return view.render("dashboard.contact", { admins })
    }
}

module.exports = AppController;