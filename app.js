const express = require('express');
const app = express();
const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');
const url = require('url');
let PORT = process.env.PORT || 4000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use('/', (req, res, error) => {
  let allReports = [];
  axios.get('https://status.dexcom.com/')
  .then((response) => {
    const $ = cheerio.load(response.data);
    const report = $('.component-inner-container');
    let report_item = '';
    $(report).each(function() {
      let $reportType = $(this).find('.name').text().trim();
      let $reportStatus = $(this).find('.component-status').text().trim();
      report_item = {
        report_type: $reportType,
        report_status: $reportStatus,
        time:  moment().subtract(8 , 'hour').format('MMMM Do YYYY, h:mm:ss a')
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