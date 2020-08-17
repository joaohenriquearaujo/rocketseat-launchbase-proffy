//server
const express = require("express");
const server = express();

const { pageLanding, pageStudy, pageGiveClasses, saveClasses } = require("./pages");

//set nunjucks (template engine)
const nunjucks = require("nunjucks");
nunjucks.configure("src/views", {
  express: server,
  noCache: true,
});

// console.log(__dirname)

//start and configure server
server
  //receive data from request.body
  .use(express.urlencoded({ extended: true }))
  // set static files (css, scripts, images)
  .use(express.static("public"))
  // application routes
  .get("/", pageLanding)
  .get("/study", pageStudy)
  .get("/give-classes", pageGiveClasses)
  .post("/save-classes", saveClasses)
  //start server
  .listen(5500);
