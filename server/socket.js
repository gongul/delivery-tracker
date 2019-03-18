const schedule = require('node-schedule');
const track = require('../lib/custom/delivery');
const DeliveryFrame = require('../lib/custom/delivery-frame');

module.exports = (io,app) => {
    io.on('connection', (socket) => {
        let job;
    
        socket.on('disconnect',(data) => {
        });
    
    
        socket.on('leaveRoom',() => {
            console.log("leaveRoom");
            
            socket.disconnect();
        });
        
        socket.on('joinRoom', (carrierId,invoicNumber) => {
            socket.join(carrierId+invoicNumber, async () => {
                const Schedule = app.models.Schedule;
                const Carrier = app.models.carrier;

                if(job){return;}

                try{
                    const hasCarrier = await Carrier.findOne({where:{id:carrierId}});

                    if(!hasCarrier){
                        io.to(carrierId+invoicNumber).emit('chat message', {"msg":"없는 택배사 입니다."});
                        return;
                    }
                    
                    const hasSchedule = await Schedule.findOne({where:{uuid:carrierId+invoicNumber}});

                    if(hasSchedule) return;

                    job = schedule.scheduleJob('1 * * * * *', async () => {
                        const carrierIds = carrierId.split(".");

                        let delivery = await track.getTrack[carrierIds[0]][carrierIds[1]](invoicNumber)

                        if(delivery instanceof DeliveryFrame) delivery = delivery.getDelivery();

                        io.to(carrierId+invoicNumber).emit('chat message', delivery);
                    });

                    const result = await Schedule.create({uuid:carrierId+invoicNumber,name:job.name});

                }catch(e){
                    console.log(e);
                    if(job) job.cancel();
                    
                    return;
                }
                
            });
        });
    
    });
}
