const express = require('express');
const rqsIp = require('request-ip');
const app = express();

app.set('port', process.env.PORT || 3000) 

app.get('/', (req, res, next) => {
    res.send('<h1>Hello world<h1>');
})

app.get('/ip', (req, res) => {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    console.log("ip:", ip);
    res.send({ ip });
})

app.get('/ip-request', (req, res) => {
    const client = rqsIp.getClientIp(req);
    console.log('New Ip:', client)
    res.send({ client})
})

app.listen(app.get('port'), () => {
    console.info(`Server listen on port ${app.get('port')}`);
})