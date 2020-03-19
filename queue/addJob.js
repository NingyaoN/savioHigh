const Queue = require('bee-queue');
const moment = require("moment");
const url = "mongodb://localhost:27017";
const dbName = 'tklmovie';

const queue = new Queue('example', {
    nearTermWindow: 12000,
    activateDelayedJobs: true
   });

// create a client to mongodb
const MongoClient = require('mongodb').MongoClient;

 const jobUtil = {
    addJob: function(date, type = "dailyreport", delay = `${moment().format("DD-MM-YYYY HH:mm:ss")}`){
        try{
            MongoClient.connect(url, date, async(err, client ) => {
                if (err) {
                    return console.log(err);
                }
                let data = {date: date, type: type}
                let delayUntil = moment(delay, "DD-MM-YYYY HH:mm:ss").format("YYYY-MM-DD HH:mm:ss +0530");
                const job = await queue.createJob(data);
                job.delayUntil(Date.parse(delayUntil));
                job.save();
                job.on('succeeded', result => {console.log(`Received result for job ${job.id}: ${result}`);});

            });
        }catch(error){
            console.log('errrror = ',error)
        }
    }
}

module.exports = jobUtil;
