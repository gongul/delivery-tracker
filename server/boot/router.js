
module.exports = (app) => {
    const User = app.models.user;
    const router = require('./router/index')(app);

}