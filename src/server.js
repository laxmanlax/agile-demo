const app = require('./app');

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    const host = server.address().address;
    console.log(`Started at http://${host}:${port}`);
});
