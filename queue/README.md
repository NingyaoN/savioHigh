# CashSale Report generation scheduling

## Prerequisites:
- docker installed
> docker run -d -p 6379:6379 redis

To access redis via GUI
> node queue/router.js
http://alpha.tklmovie.com/arena

...
run this command one time
> node queue/addJob.js


Finally, run this
> node queue/worker.js
...
