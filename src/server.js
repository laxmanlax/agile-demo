const app = require('./app');
const pkg = require('../package.json');

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    const host = server.address().address;
    console.log(`Started at http://${host}:${port}`);
    console.log(`Running version v${pkg.version}`);
});
