const gcm = require("node-gcm");
const User = use("App/Models/User");
const Employee = use("App/Models/Video");
const Notification = use("App/Models/Notification");
const _ = require("lodash");

const sender = new gcm.Sender(
  "AAAATI_MOMA:APA91bHj0nq7FjmP-mLMzuMi2JDfbw1pJIlteFMDS5D-jl-cFOhBtnATVn5HwUo_5g8bY3DGRhsnT1C-XVSnkVDCjLbem4IDsR82xEvt36VD0hBhevwocg5LTBGN_97Wio3vtcl0stmc"
);
const sendNotification = (message, regTokens) => {
  return new Promise((resolve, reject) => {
    sender.send(
      message,
      {
        registrationTokens: regTokens
      },
      function(err, response) {
        if (err) {
          reject(err);
        }
        resolve(response);
      }
    );
  });
};
const movieID = async (mids, title, body, meta) => {
  var message = new gcm.Message({
    contentAvailable: true
  });
  message.addData({
    title,
    body,
    icon: "ic_launcher",
    meta
  });
  let tokens = await Promise.all(
    mids.map(async _id => {
      const user = await User.findOne({
        _id
      });
      if (!user) {
        return;
      }
      const video = await Video.findOne({
        _id: uids
      });
      if (!video) {
        return;
      }
      const notiObject = {
        mid: video._id,
        body,
        title,
        meta
      };
      await Notification.create(notiObject);
    })
  );
  tokens = _.compact(tokens);
  try {
    await sendNotification(message, tokens);
  } catch (error) {
    console.log(error);
  }
};


module.exports = {
  movieID,
};