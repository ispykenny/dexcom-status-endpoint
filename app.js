const express = require('express');
const app = express();
const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');
const url = require('url');
let PORT = process.env.PORT || 4000;
let allReports = [];

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use('/', (req, res, error) => {
  axios.get('https://status.dexcom.com/')
  .then((response) => {
    const $ = cheerio.load(response.data);
    const report = $('.component-inner-container');
    let localUrl = 'http://localhost:4000/';
    let checkUrl = url.parse(localUrl, true).hostname
    let timeStamp = '';
    if(checkUrl === "localhost") {
      timeStamp =  moment().format('MMMM Do YYYY, h:mm:ss a');
    } else {
      timeStamp =  moment().subtract(8 , 'hour').format('MMMM Do YYYY, h:mm:ss a');
    }
    let report_item = '';
    $(report).each(function() {
      let $reportType = $(this).find('.name').text().trim();
      let $reportStatus = $(this).find('.component-status').text().trim();
      report_item = {
        report_type: $reportType,
        report_status: $reportStatus,
        time: timeStamp
      }
      allReports.push(report_item)
    })

    res.json(allReports)
    
  })
  .catch((error) => {
    console.log(error)
  })
});



app.listen(PORT, () => console.log(`listening to port ${PORT}`))