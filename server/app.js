const loopback = require('loopback');
const fileHelper = require("./lib/fileHelper.js");
const app = loopback();

app.token = function(){
  // app.use(loopback.token());

  app.use(loopback.token());

  
}

app.start = function() {
    // start the web server

  return app.listen(function() {
    app.emit('started');
    const baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
    const explorerPath = app.get('loopback-component-explorer').mountPath;
    console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
    console.log("Express 서버가 " + this.address().port + "번 포트에서 Listen중입니다.");
  });
};


module.exports = app;