const fs = require('fs');
let Parser = require('rss-parser');
const puppeteer = require('puppeteer');
let parser = new Parser();
// Date
let today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth()).padStart(2, '0'); //January is 0!
let yyyy = today.getFullYear();
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
today = monthNames[mm] + ' ' + dd + ', ' + yyyy;
let date4file = dd+'-'+mm+'-'+yyyy;


// Exported functions
exports.readConfig = function (sourceName) {
  synconfig = JSON.parse(fs.readFileSync('feeds/config/'+sourceName+'.json'));
  console.log("Leyendo config de:",sourceName);
  return synconfig;
}

exports.writeJson = function (title, feed, selector) {
  let jsonData = { 
    title: title,
    feed: feed, 
    link: selector.link,
    text: selector.text,
    image: selector.img 
  };
  let fileName = title.toLowerCase()+'-'+date4file;
 
  let data = JSON.stringify(jsonData, null, 2);
  fs.writeFileSync('feeds/'+fileName+'.json', data);
}

exports.addURL = function (req, res){
  
  (async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto(req.body.url);
    
    // const resultsSelector = '#primary #contents #details h3 a';
    const resultsSelector = req.body.sel;
    await page.waitForSelector(resultsSelector);
    
    // Extract the results from the page.
    const links = await page.evaluate(resultsSelector => {
      
      
      return [...document.querySelectorAll(resultsSelector)].map(anchor => {
        let item = {
          title: anchor.textContent,
          link: anchor.href
        }
        return item;
      });
    }, resultsSelector);
    
    // Print all the files.
    links.length = 10;
    let count = 0;
    let datafeed = {};
    let name = req.body.name;
    let desc = req.body.desc;
    let url = (new URL(req.body.url));
    let refresh = req.body.refresh;
    let selector = req.body.sel;
    let title = name;
    name = name.toLowerCase().split(' ').join('_');
    links.forEach(item => {
      count++;
      let itemName = 'item-'+count;
      // console.log(item.title + ' - ' + item.link)
      datafeed[itemName] = {
        title: item.title,
        link: item.link
      }
    });
    
    feedconfig = {
      "Title": title,
      "Description": desc,
      "URL": url,
      "Selector": selector,
      "Refresh": refresh,
      "Source": url.hostname
    }
    datafeed = {
      "Title": title,
      "Description": desc,
      "items":{datafeed}
    }
    // console.log(links.join('\n'));
    datafeed = JSON.stringify(datafeed, null, 2);
    feedconfig = JSON.stringify(feedconfig, null, 2);
    console.log(datafeed);
    fs.writeFileSync("feeds/"+name+"-"+date4file+".json", datafeed);
    fs.writeFileSync("feeds/config/"+name+".json", feedconfig);
    console.log("File written successfully\n"); 
    
    
    await browser.close();
  })();
  console.log(`Feed URL ingresado`);
  console.log(JSON.stringify(req.body, null, 4));
}

exports.addRSS = function (req, res){
  console.log(`Feed RSS ingresado`);
  // console.log(JSON.stringify(req.body, null, 4));
  
  (async () => {
    
    // let feed = await parser.parseURL('https://www.reddit.com/.rss');
    
    let feed = await parser.parseURL(req.body.url);
    console.log(feed.title);
    let title = feed.title;
    let url = (new URL(req.body.url));
    let name = req.body.name;
    let refresh = req.body.refresh;
    let desc = req.body.desc;
    name = name.toLowerCase().split(' ').join('_');
    let count = 0;
    let datafeed = {};
    feed.items.forEach(item => {
      count++;
      let itemName = 'item-'+count;
      // console.log(item.title + ' - ' + item.link)
      datafeed[itemName] = {
        title: item.title,
        link: item.link
      };
      
    });
    datafeed = {title: title,
      "items":{datafeed}
    }
    // console.log(JSON.stringify(datafeed, null, 4));
    
    feedconfig = {
      "Title": title,
      "Description": desc,
      "URL": url,
      "Selector": "RSS",
      "Refresh": refresh,
      "Source": url.hostname
    }
    datafeed = JSON.stringify(datafeed, null, 2);
    feedconfig = JSON.stringify(feedconfig, null, 2);
    fs.writeFileSync("feeds/config/"+name+".json", feedconfig);
    fs.writeFileSync("feeds/"+name+'-'+date4file+".json", datafeed);
    console.log("File written successfully\n"); 
    
  })();
  
}
