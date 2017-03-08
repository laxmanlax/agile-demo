const express = require('express');
const kube = require('kubernetes-client');

const url = process.env.KUBE_API;
const config = url ? {url} : kube.config.getInCluster();
const core = new kube.Core(config);
console.log(`Inspecting at: ${config.url}`);

const app = express();
app.use(express.static(`${__dirname}/../public`));

app.get('/cluster', (req, res) => {
    core.ns.pods.get((err, pods) => {
        if (!err) {
            res.send(pods);
        } else {
            console.error(err);
            res.status(500).send('Kubernetes API server error');
        }
    });
});

module.exports = app;
