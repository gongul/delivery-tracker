'use strict';
const cluster = require('cluster');
const os = require('os');
const uuid = require('uuid');
const boot = require('loopback-boot');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const cookieParser = require('cookie-parser');

const instanceId = uuid.v4();
const cpuCount = os.cpus().length;
const workerCount = 1; // 세팅용 cpuCount / 4;

const master = () => {
  const workerMsgListener = (msg) => {
        
    const workerId = msg.workerId;
    
    if (msg.cmd === 'MASTER_ID') {
      cluster.workers[workerId].send({cmd:'MASTER_ID',masterId: instanceId});
    }
  }

  for(let i=0;i<workerCount;i++){
    const worker = cluster.fork();
    
    worker.on('message', workerMsgListener);
  }

  cluster.on('online', (worker) => {});
  cluster.on('exit', (worker) => {
    const newWorker = cluster.fork();

    worker.on('message', workerMsgListener);
  });
}


const worker = () => {
  const workerId = cluster.worker.id;
  let masterId;

  process.send({workerId: workerId, cmd:'MASTER_ID'});
  process.on('message', (msg) =>{
      if (msg.cmd === 'MASTER_ID') {
        masterId = msg.masterId;
      }
  });
}

if(cluster.isMaster){
  console.log('서버 ID : '+instanceId);
  console.log('서버 CPU 수 : ' + cpuCount);
  console.log('생성할 워커 수 : ' + workerCount);
  console.log(workerCount + '개의 워커가 생성됩니다\n');
  
  master();
}else if(cluster.isWorker){
  const app = module.exports = require("./app.js");
  
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'ejs');
  
  app.use(bodyParser.urlencoded({extended: true}));

  app.use('/static',express.static(__dirname+'/../static'));

  app.use(cookieParser('!test!'));
  app.token();
  
  
  worker();
  
  boot(app, __dirname, (err) => {
    if (err) throw err;
    
    if (require.main === module){
      // app.start();
      app.io = require('socket.io')(app.start());

      require('./socket')(app.io,app);
    }
  });
}



