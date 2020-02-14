const express = require('express');
const app = express();
const axios = require('axios');
const cheerio = require('cheerio')
let PORT = process.env.PORT || 4000;
let latestReport = "";

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use('/', (req, res, error) => {
  axios.get("https://status.dexcom.com/")
  .then((response) => {
    const $ = cheerio.load(response.data);
    const report = $('.status-day');
    latestReport = {
      reported: $(report[0]).find('p').text(),
      date: $(report[0]).find('.date').text()
    };
    res.json(latestReport);
  })
  .catch((error) => {
    console.log(error)
  })
})




app.listen(PORT, () => console.log(`listening to port ${PORT}`))