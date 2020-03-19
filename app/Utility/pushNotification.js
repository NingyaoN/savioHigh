const webPush = use("web-push");


webPush.setVapidDetails("mailto:ajaxning@gmail.com", publicVapidKey, privateVapidKey);
const subscription = await request.all();
//  resource created
response.status(201).json({});

const payload = JSON.stringify({
  title: 'Notification from TKLmovie',
});

webPush.sendNotification(subscription, payload).catch((err) => console.log(err));
