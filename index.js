const express = require('express')
const fs = require('fs');
const path = require("path");
const functions = require('./src/functions.js');
var parseUrl = require('body-parser');
let encodeUrl = parseUrl.urlencoded({ extended: false });
const app = express();
let title = "Weltome to the boilerplate";

// App setter
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

// Routers
app.get('/', (req, res) => {
  res.render("index", {
    title: title
  });
  // Can also be
  // res.sendFile(__dirname + '/index.html')
});
app.get('/section1', (req, res) => {
  res.render("section1", {
    title: title
  });
  console.log('Section 1');
});
app.get('/section2', (req, res) => {
  res.render("section2", {
    title: title
  });
  console.log('Section 2');
});
app.get('/section3', (req, res) => {
  res.render("section3", {
    title: title
  });
  console.log('Section 3');
});

// Actions
app.post('/posted', encodeUrl, (req, res) => {
  console.log('Form posted succesfully');
  res.render("posted", {
    title: title,
    name: req.body.name,
    desc: req.body.desc,
    url: req.body.url,
    sel: req.body.sel
  });
})

app.listen(4000)