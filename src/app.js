import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import {
  loadConfig
} from './helpers/config.js';
import eventsRouter from './routes/events.js';

const config = loadConfig(process.env.NODE_ENV);
var app = express();

process.env.PORT = process.env.PORT || '5000';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.get('/', (req, res) => {
  res.send(`Civic API V${config.version}`);
});

app.use('/events', eventsRouter);

app.listen(parseInt(process.env.PORT), () => {
  console.log(`Civic API listening on port ${process.env.PORT}!`);
});

module.exports = app;

process.on('SIGTERM', function() {
  process.exit(0);
});
