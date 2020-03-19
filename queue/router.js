const Arena = require('bull-arena');

const express = require('express');
const router = express.Router();
const app = express();
const arena = Arena({
    queues: [
      {
        name: 'example',
        hostId : "Queue",
        type: "bee",
        // Redis auth.
        redis: {
          port: '6379',
          host: '127.0.0.1'
        //   password: /* Your redis password */,
        },
      }
    ],
  },
  {
    // Make the arena dashboard become available at {my-site.com}/arena.
    basePath: '/arena',
    // Let express handle the listening.
    disableListen: true
  });
  
  // Make arena's resources (js/css deps) available at the base app route
app.use('/', arena);
app.listen(3000);