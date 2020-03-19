## Pino

For better logs - 

Install
$ npm install -g pino-pretty

Usage
It's recommended to use pino-pretty with pino by piping output to the CLI tool:

npm start | pino-pretty


https://github.com/keymetrics/pm2-logrotate
https://github.com/pinojs/pino-elasticsearch

Levels available -
{ 
  error: 0, -> all errors
  warn: 1, 
  info: 2, -> all crud routes 
  verbose: 3, ->
  debug: 4,-> View with some db calls, 
  silly: 5 -> Views
}


pm2 set pm2-logrotate:rotateInterval 0 0 * * *

cat ~/.pm2/logs/server-out.log | pino-elasticsearch  --host http://35.200.201.124:9200/
