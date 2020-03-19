const { addJob } = require("../queue/addJob");

addJob("10-10-2018", "dailyreport", "10-10-2018 23:59:00"); 
//- change this ^^^^^^^^^^        and        ^^^^^^^^^^ with the current date
//- when deploying this on production this file needs to be ran one time manually (node queue/initJob.js)