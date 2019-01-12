const page = require('webpage').create();

page.open('http://naver.com/', function(status) {
  if (status) {
    var html  = page.content;
    console.log(html);
  }
  
  phantom.exit();
});