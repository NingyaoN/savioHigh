const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const Queue = require('bee-queue');
const moment = require("moment");

const queue = new Queue('example', {
  nearTermWindow: 12000,
  activateDelayedJobs: true
});
const url = "mongodb://localhost:27017";
const dbName = 'tklmovie';

queue.process(function (job, done) {
  try {
  const date = job.data.date;
  const type = job.data.type;
  const noRepeat = job.data.noRepeat;
    MongoClient.connect(url, async (err, client) => {
      if (err) console.log(err);
      const db = client.db(dbName);
      const Site = await db.collection("sites");
      const Cashsale = await db.collection('cashsales');
      const Cashsalereport = await db.collection('cashsalereports');
      const allsites = await Site.find({}).toArray();

      const Purchase = await db.collection('purchases');
      const Purchasereport = await db.collection('purchasereports');

      const Attendance = await db.collection('attendances');
      const Attendancereport = await db.collection('attendancereports');

      let cashsalereport;
      let purchasereport;
      let attendancereport;
      await Promise.all( allsites.map(async site => {
		  console.log('for site = ', site.name, '(', site._id, ')', date) 
          async function cashsale(){ // Cashsale - report for _this_ site
            let total = {
              cashamount: 0,
              cardamount: 0,
              UPIamount: 0,
              amount: 0
            }
			
            const sales = await Cashsale.find({
              site_id: String(site._id),
              invoicedate: date
            }).toArray();
            if (sales) {
              sales.forEach(sale => {
                if (sale.invoicedate == date && sale.site_id == String(site._id)) {
                  total.amount += parseFloat(sale.total.gtotal);
                  if (sale.paymentmethod == 'Cash' || sale.paymentmethod == 'cash')
                    total.cashamount += parseFloat(sale.total.gtotal);
                  if (sale.paymentmethod == 'Card' || sale.paymentmethod == 'card')
                    total.cardamount += parseFloat(sale.total.gtotal);
                  if (sale.paymentmethod == 'UPI' || sale.paymentmethod == 'upi')
                    total.UPIamount += parseFloat(sale.total.gtotal);
                  if((sale.paymentmethod == "Mix" && sale.items.summary) || (!sale.paymentmethod && sale.items.summary) ) {
                      //this means this is sale summary, also second or is above for older cashsale summaries that did not have paymentmethod field
                      sale.items.summary.forEach(item => {
                        if (item.paymentmethod == "Cash" || item.paymentmethod == "cash")
                        total.cashamount += parseFloat(item.total.gtotal);
                        if (item.paymentmethod == "Card" || item.paymentmethod == "card")
                          total.cardamount += parseFloat(item.total.gtotal);
                        if (item.paymentmethod == "UPI" || item.paymentmethod == "upi")
                          total.UPIamount += parseFloat(item.total.gtotal);
                      });
                    }
                }
              });
            }
            total.amount = Math.round(total.amount)
            total.cashamount = Math.round(total.cashamount)
            total.cardamount = Math.round(total.cardamount)
            total.UPIamount = Math.round(total.UPIamount)

            let data = {
              total,
              site_id: site._id,
              date
            };
            console.log('cashsalereport data = ', data, sales.length, sales);
            cashsalereport = await Cashsalereport.findOne({
              date: data.date,
              site_id: site._id
            });
            if (cashsalereport) {
              console.log('cashsalereport found! updating...')
              await Cashsalereport.update({
                _id: ObjectID(cashsalereport._id)
              }, {
                $set: {
                  total: total
                }
              });
            } else {
              console.log('cashsalereport generating a new one...')
              cashsalereport = await Cashsalereport.insert(data);
            }
          } 
          
          async function purchase(){ // Purchase - report for _this_ site
            let amount = 0;
            const purchases = await Purchase.find({
              invoicedate: date,
              site: site._id
            }).toArray();
            if (purchases) {
              await Promise.all(purchases.map(async (purchase) => {
                if(!purchase.editedby){
                  amount += parseFloat(purchase.gtotal);
                }
              }));
            }
            let data = {
              total: amount,
              site_id: site._id,
              date: date
            }
            console.log('purchasereport data = ', data);
            purchasereport = await Purchasereport.findOne({
              date: data.date,
              site_id: site._id
            });
            if (purchasereport) {
              console.log('purchasereport found! updating...')
              await Purchasereport.update({
                _id: ObjectID(purchasereport._id)
              }, {
                $set: {
                  total: data.total
                }
              });
            } else {
              console.log('purchasereport generating a new one...')
              purchasereport = await Purchasereport.insert(data);
            }
          } 
          
          async function attendance(){ // Attendance - report for _this_ site
            let present = 0,
              absent = 0;
            const attendances = await Attendance.find({
              date: date,
              site: site._id
            }).toArray();
            console.log('attendances = ', attendances)
            if (attendances) {
              await Promise.all(attendances.map(async (attendance) => {
                var arr = Object.keys(attendance.attendance);
                await Promise.all(await arr.map(async data => {
                  if (attendance.attendance[data]["status"] == '1') {
                    present++;
                  } else {
                    absent++;
                  }
                }));
              }));
            }
            let record = {
              present: present,
              absent: absent
            }
            let data = {
              record,
              site_id: site._id,
              date: date
            }
            console.log('attendancereport data = ', data);
            attendancereport = await Attendancereport.findOne({
              date: data.date,
              site_id: site._id
            });
            if (attendancereport) {
              console.log('attendancereport found! updating...')
              await Attendancereport.update({
                _id: ObjectID(attendancereport._id)
              }, {
                $set: {
                  total: data.total
                }
              });
            } else {
              console.log('attendancereport generating a new one...')
              attendancereport = await Attendancereport.insert(data);
            }
          }

          if(type && type == "cashsale"){
            cashsale();
          }
          if(type && type == "purchase"){
            purchase();
          }
          if(type && type == "attendance"){
            attendance();
          }
          if(type == "dailyreport"){
            cashsale();
            purchase();
            attendance();
          }
        }));
      if(type == "dailyreport"){
        let newJob = {
          date: moment(date, "DD-MM-YYYY").add(1, 'days').format("DD-MM-YYYY"),
          type: "dailyreport"
        }
        const job = await queue.createJob(newJob);
        let nextDay = Date.parse(moment(date + " 23:59:00", "DD-MM-YYYY HH:mm:ss").add(1, 'days').format("YYYY-MM-DD HH:mm:ss +0530"));
        job.delayUntil(nextDay);
        job.save();
      }
      return done(null, cashsalereport, purchasereport, attendancereport);
    });
  } catch (error) {
    console.log(error)
  }
});

// console.log('res = ',result);
