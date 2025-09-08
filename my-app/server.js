const { createServer } = require('http');
const next = require('next');

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev }); // uses .next by default
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((req, res) => {
      // make Passenger/proxies happy
      if (!req.headers['x-forwarded-proto']) {
        req.headers['x-forwarded-proto'] = req.connection.encrypted ? 'https' : 'http';
      }
      handle(req, res);
    }).listen(port, '0.0.0.0', (err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      console.log(`> Ready on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Error starting Next.js server:', err);
    process.exit(1);
  });