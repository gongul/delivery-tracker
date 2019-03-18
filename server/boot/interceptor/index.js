module.exports = (app) => {
    const user = require('./user')(app);
    const carrier = require('./carrier')(app);
    const admin = require('./admin')(app);
}