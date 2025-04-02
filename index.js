const express = require('express');
const rqsIp = require('request-ip');
const session = require('express-session')
const app = express();

app.set('port', process.env.PORT || 3000) 

app.use(session({
    secret:'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 20 * 60 * 1000 } // 20 minutes
}))

app.use((req, res, next) => {
    if (req.session) {
        req.session._garbage = Date();
        req.session.touch();
    }

    next();
})

app.get('/', (req, res, next) => {
    req.session.user = 'activeUser'; 
    res.send('<h1>Session started<h1>');
})

app.get('/ip', (req, res) => {
    const ip = 
        req.headers['cf-connecting-ip'] ||
        req.headers['x-real-ip'] ||
        req.headers["x-forwarded-for"] || 
        req.socket.remoteAddress ||
        req.connection.remoteAddress;
    console.log("ip:", ip); //"105.233.187.232"
    res.send({ ip });
})

app.get('/ip-request', (req, res) => {
    const client = rqsIp.getClientIp(req); //"105.233.187.232"
    console.log('New Ip:', client)
    res.send({ client})
})

app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.send('<h1>Session ended<h1>');
    });
});

app.listen(app.get('port'), () => {
    console.info(`Server listen on port ${app.get('port')}`);
})