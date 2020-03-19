const User = use("App/Models/User");
const Blog = use("App/Models/Blog");
const moment = use("moment");
const uuidv4 = use("uuid/v4");
const Drive = use("Drive");
const { ObjectID } = use("mongodb")
class BlogController {
    // async blogSection({ view }) {
    //     const blogs = await Blog.find();
    //     let allBlogs = [];

    //     let i, j;
    //     for (i = 0; i < blogs.length; i++) {
    //         for (j = 0; j < blogs[i].user_blog.length; j++) {
    //             // let url;
    //             // const key = blogs[i].user_blog[j].photo_id;
    //             // if (key[0]) {
    //             //     const image = await Drive.disk("s3").exists(key[0]);
    //             //     if (image) {
    //             //         url = await Drive.disk("s3").getSignedUrl(key[0]);
    //             //     }
    //             // }
    //             // blogs[i].user_blog[j].photo_id = url;
    //              blogs[i].user_blog[j]._id = blogs[i]._id,
    //             blogs[i].user_blog[j].user_id = blogs[i].user_details.user_id;
    //             blogs[i].user_blog[j].count = blogs[i].user_blog[j].comments.length;
    //             blogs[i].user_blog[j].desc = blogs[i].user_blog[j].desc.slice(0, 30) + '...'
    //             allBlogs.push(blogs[i].user_blog[j]);
    //         }
    //     }
    //     return view.render("displays.blog.blog-landing", { allBlogs });
    // }
    async storeImage({ request, response, auth }) {
        const user = await auth.getUser();
        if (!user) return response.status(500).json({ msg: " User not found." });
        const data = await request.all();
        const blog = await Blog.findOne({ "user_details.user_id": user._id });
        let thisYear = moment().format("YYYY");
        data.photo_id = [];
        request.multipart.file("file", {}, async file => {
            if (file.clientName === "") {
                return;
            }
            const randomKey = uuidv4();
            const key = `${thisYear}/${randomKey}/blog/${file.clientName}`;
            data.photo_id.push(key);
            const res = await Drive.disk("s3").put(key, file.stream);
        });
        await request.multipart.process();
        const blog_id = uuidv4();

        if (blog) {
            const payload = {
                blog_id,
                photo_id: data.photo_id,
                date: moment().format("DD-MM-YYYY")
            }
            blog.user_blog.push(payload);
            await blog.markModified("user_blog");
            await blog.save();
            return response.status(200).json({ blog, blog_superID: blog._id, blog_id });

        } else {
            const payload = {
                user_details: {
                    user_id: user._id,
                    user_name: user.name,
                    user_email: user.email,
                },
                user_blog: [{
                    blog_id,
                    photo_id: data.photo_id,
                    date: moment().format("DD-MM-YYYY")
                }]
            }
            const blog = await Blog.create(payload);
            return response.status(200).json({ blog, blog_superID: blog._id, blog_id });
        }

    }

    async createBlog({ request, response, }) {
        const data = request.only(["title", "desc", "blog_superID", "about"]);
        const userID = request.params.userID;
        const blogID = request.params.blogID;

        const blog = await Blog.findOne({ _id: data.blog_superID });
        if (!blog) return response.status(500).json({ msg: "Something went wrong." });
        blog.user_blog.map(blog => {
            if (blog.blog_id == blogID) {
                blog.title = data.title;
                blog.desc = data.desc;
                blog.about = data.about;
                blog.comments = []
            }

            return blog;
        })
        await blog.markModified("user_blog");
        await blog.save();

        return response.status(200).json({ msg: "success" })
    }

    // TODO: create blog even for user who doesn't upload image in create blog.
    async createInstantBlog({ request, response }) {
        const data = request.only(["title", "desc", "about"]);
        const user = await User.findOne({ email: request.params.email });
        const payload = {
            user_details: {
                user_name: user.name,
                user_email: user.email,
                user_id: user._id
            },
            user_blog: [{
                desc: data.desc,

            }]
        }
    }
    async singleView({ view, request, response }) {
        const singleBlog = await Blog.findOne({ _id: ObjectID(request.params.ID) });
        if (!singleBlog) return response.status(500).json({ msg: "Something went wrong!! Please contact support." });
        const userBlog = await Promise.all(singleBlog.user_blog.filter(blog => {
            return blog.blog_id == request.params.blogID;
        }))

        if (userBlog[0].photo_id.length > 0) {
            let url;
            const key = userBlog[0].photo_id;
            if (key[0]) {
                const image = await Drive.disk("s3").exists(key[0]);
                if (image) {
                    url = await Drive.disk("s3").getSignedUrl(key[0]);
                }
            }
            userBlog[0].photo_id = url;
        }
        let blogUser = await User.findOne({_id: ObjectID(singleBlog.user_details.user_id)});
        let url;
        // const key = blogUser.photo_id;
        // if (key[0]) {
        //     const image = await Drive.disk("s3").exists(key[0]);
        //     if (image) {
        //         url = await Drive.disk("s3").getSignedUrl(key[0]);
        //     }
        // }
        // blogUser.photo_id = url;
        return view.render("dashboard.blog.singleView", {
            userDetail: blogUser,
            userBlog: userBlog[0],
            ID: request.params.ID,
            blogID: request.params.blogID,
            count: userBlog[0].comments.length,
        });
    }

    async comment({ auth, request, response }) {
        const ID = request.params.ID;
        const blogID = request.params.blogID;

        const singleBlog = await Blog.findOne({ _id: ObjectID(ID) });
        if (!singleBlog) return response.status(500).json({ msg: "Something went wrong. Please try again." });
        const data = await request.only(["msg"]);
        // await Promise.all(singleBlog.user_blog.map(blog => {
        //     if (blog.blog_id == blogID) {
        //         blog.comments.push({
        //             comment: data.msg,
        //             commentID: uuidv4(),
        //             reply: [],
        //         })
        //     }
        // }))
        const blog = await Promise.all(singleBlog.user_blog.filter(blog => {
            return blog.blog_id == blogID;
        }))

        const user = await User.findOne({_id: singleBlog.user_details.user_id});
        blog[0].comments.push({
            date: moment().format('DD-MM-YYYY, h:mm:ss a'),
            comment: data.msg,
            commentID: uuidv4(),
            commentor: {
                name: user.name,
                id: user._id,
            },
            reply: [],
        })
        await singleBlog.markModified("user_blog");
        await singleBlog.save();
        return response.status(200).json({ singleBlog, msg: "Your comment have been posted successfully" });
    }

    async storeReply({ request, response, auth }) {
        const user = await auth.getUser();
        const commentID = request.params.commentID;
        const blogID = request.params.blogID;
        const ID = request.params.ID;
        console.log("id", ID)
        const userBlogs = await Blog.findOne({ _id: ObjectID(ID) });
        console.log("userblog", userBlogs)
        if (!userBlogs) return response.status(500).json({ msg: "Something went wrong. Couldn't find the specific blog." });

        const specificBlog = await Promise.all(userBlogs.user_blog.filter(blog => {
            return blog.blog_id == blogID;
        }));

        const comment = await specificBlog[0].comments.filter(comment => {
            return comment.commentID == commentID
        })
        const data = await request.only(["replyMsg"])
        comment[0].reply.push({
            msg: data.replyMsg,
            replyID: uuidv4(),
            replier: {
                name: user.name,
                id: user._id,
            },
            date: moment().format('DD-MM-YYYY, h: mm: ss a '),
        });
        await userBlogs.markModified("user_blog");
        await userBlogs.save();

        return response.status(200).json({ msg: "You have replied successfully." })
    }
}

module.exports = BlogController;