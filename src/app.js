const client = require('./client');
const express = require('express');
const request = require('request');

const ns = process.env.KUBERNETES_NAMESPACE || 'default';

const app = express();
app.use(express.static(`${__dirname}/../public`));

app.get('/cluster', (req, res) => {
    client.get(`namespaces/${ns}/pods`, (err, r, data) => {
        if (!err) {
            res.send(data);
        } else {
            console.error(err);
            res.status(500).send('Kubernetes API server error');
        }
    });
});

app.get('/image/:id', (req, res) => {
    const {id} = req.params;
    client.get(`proxy/namespaces/${ns}/pods/${id}/data.json`, (err, r, {image}) => {
        if (image && !err) {
            client.get({url: `proxy/namespaces/${ns}/pods/${id}/${image}`, json: false}).pipe(res);
        } else {
            request(`https://api.adorable.io/avatars/200/${id}.png`).pipe(res);
        }
    });
});

module.exports = app;
