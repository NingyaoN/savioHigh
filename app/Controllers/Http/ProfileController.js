const User = use("App/Models/User");
const Image = use("App/Models/Image");
const Blog = use("App/Models/Blog");
const Drive = use("Drive");
const { ObjectID } = use("mongodb")


class ProfileController {
    async profile({ view, auth, request, response }) {
        const user = await auth.getUser();
        if (!user) return response.status(500).json({ msg: "user does not exist." })
        return view.render("dashboard.user.profile", { user });
    }
    async allusers({response, request, }) {
        const users = await User.find();
        return response.status(200).json(users);
    }

    async getUser({request, response, auth }) {
        const user = await User.findOne({_id: ObjectID(request.params.userID)});
        console.log(user)
        if(!user) return response.status(500).json({msg: "User does not exist."});
        return response.status(200).json(user)
    }
    async updateProfile({request, response, auth}) {
        const user = await User.findOne({_id: request.params.userID});
        if(!user) return response.status(500).json({msg: "User not found."});
        const data = await request.all();
        user.name = data.user.name;
        user.email = data.user.email;
        user.phone = data.user.phone;
        user.bio = data.user.bio; 
        await user.save();
        return response.status(200).json(user);
    }
    async editProfile({ request, response, auth }) {
        const data = await request.only(["name", "email", "phone", "bio"]);
        const user = await auth.getUser();
        if (!user) return response.status(500).json({ msg: "User does not exist." });
        user.name = data.name;
        user.email = data.email;
        user.phone = data.phone;
        user.bio = data.bio;

        await user.save();
        delete user.password;
        return response.status(200).json({ user });
    }


    async retrievePost({ request, response, auth }) {
        const tag = request.params.tag;
        const user = await auth.getUser();
        if (tag == "image") {
            let images = await Image.find({ "user_details.userID": user._id });
            if (!images.length) return response.status(500).json({ msg: "You don't have any image. Please upload." })

            // const displays = await Promise.all(images.map(async (image) => {
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
             const displays = []
            console.log("000000000000000000000000000000000000000000000")
            return response.status(200).json({ displays, tag });
        }
        if (tag == "blog") {
            const blogs = await Blog.find({ "user_details.user_id": user._id });
            if (!blogs.length) return response.status(500).json({ msg: "You haven't posted any blogs. Please Create a blog." });

            let displays = [];

            // let i, j;
            // for (i = 0; i < blogs.length; i++) {
            //     for (j = 0; j < blogs[i].user_blog.length; j++) {
            //         let url;
            //         const key = blogs[i].user_blog[j].photo_id;
            //         if (key[0]) {
            //             const image = await Drive.disk("s3").exists(key[0]);
            //             if (image) {
            //                 url = await Drive.disk("s3").getSignedUrl(key[0]);
            //             }
            //         }
            //         blogs[i].user_blog[j].photo_id = url;
            //         blogs[i].user_blog[j]._id = blogs[i]._id,
            //             blogs[i].user_blog[j].user_id = blogs[i].user_details.user_id;
            //         blogs[i].user_blog[j].count = blogs[i].user_blog[j].comments.length;
            //         blogs[i].user_blog[j].desc = blogs[i].user_blog[j].desc.slice(0, 30) + '...'
            //         displays.push(blogs[i].user_blog[j]);
            //     }
            // }
            // console.log(displays)
            return response.status(200).json({displays, tag})
        }
    }
}


module.exports = ProfileController;