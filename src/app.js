const express = require('express');
const kube = require('kubernetes-client');

const url = process.env.KUBE_API;
const config = url ? {url} : kube.config.getInCluster();
const core = new kube.Core(config);

const app = express();
app.use(express.static(`${__dirname}/../public`));

app.get('/cluster', (req, res) => {
    core.ns.pods.get((err, pods) => {
        res.send(pods);
    });
});

module.exports = app;
