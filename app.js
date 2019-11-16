const cors = require('cors');
const express = require('express');
const schedule = require('node-schedule');

const http = require('http');
const hostname = 'localhost';
const port = 8080;
const app = express();

const Gpio = require('pigpio').Gpio;
const motor = new Gpio(10, {mode: Gpio.OUTPUT});

let pulseWidth = 500;
let increment = 500;

app.use(express.json());
app.use(cors());
app.get('/', (req, res) => res.send('server is running'));
app.get('/feed', (req, res) => {
  feedNow();
  res.send('Your pet has been fed!');
});
app.post('/schedule', (req,res) => {
  let time = new Date(req.body.time)
  schedule.scheduleJob(time, function(){
    feedNow();
  });
  res.send('Your pet will be fed at scheduled time!');
});

feedNow = () => {
  setInterval(() => {
    motor.servoWrite(pulseWidth);

    pulseWidth += increment;
    if (pulseWidth >= 2500) {
      increment = -500;
    }
  }, 500);
}

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
