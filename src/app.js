const kube = require('./kube');
const express = require('express');
const pkg = require('../package.json');

const ns = process.env.KUBERNETES_NAMESPACE || 'default';

const app = express();
app.use(express.static(`${__dirname}/../public`));

app.get('/config', (req, res) => {
    res.send({
        version: pkg.version,
        showSelf: JSON.parse(process.env.UI_SHOW_SELF || 'false'),
        self: process.env.UI_SELF || 'agilestacks/agile-demo'
    });
});

app.get('/cluster', (req, res) => {
    kube.get(`namespaces/${ns}/pods`, (err, r, data) => {
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
    kube.get(`proxy/namespaces/${ns}/pods/${id}/data.json`, (err, r, {image}) => {
        if (image && !err) {
            kube.get({url: `proxy/namespaces/${ns}/pods/${id}/${image}`, json: false}).pipe(res);
        } else {
            res.sendStatus(404);
        }
    });
});

module.exports = app;
