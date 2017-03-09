const fs = require('fs');
const request = require('request');

const host = process.env.KUBERNETES_SERVICE_HOST;
const port = process.env.KUBERNETES_SERVICE_PORT;
const inCluster = host && port;
const endpoint = inCluster ? `https://${host}:${port}` : process.env.KUBERNETES_PROXY_URL;

const config = {
    baseUrl: `${endpoint}/api/v1`,
    json: true
};
if (inCluster) {
    const ca = fs.readFileSync('/var/run/secrets/kubernetes.io/serviceaccount/ca.crt');
    const token = fs.readFileSync('/var/run/secrets/kubernetes.io/serviceaccount/token');

    Object.assign(config, {
        ca,
        headers: {Authorization: `Bearer ${token}`}
    });
}

console.log(`Inspecting at: ${endpoint}`);
module.exports = request.defaults(config);
