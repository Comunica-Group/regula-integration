import express from 'express';
import http from 'http';
import path from 'path';
import config from 'config';
import cors from 'cors';
import bodyParser from 'body-parser';
import _debug from 'debug';

const debug = _debug('server');
const publicRouter = express.Router();

const app = express();

const corsOptions = {
  origin: 'http://localhost:3000',
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: config.bodyParserLimit }));
app.use(express.static(path.join(__dirname, '/../../build')));

const healthApiRoute = '/api/health';

publicRouter.get(healthApiRoute, (req, res) => {
  res.send({
    apiStatus: "Healthy!"
  });
});
app.use('/', publicRouter);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  next();
});

const server = () => {
  debug('Starting server...');
  const httpServer = http.Server(app);
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, '/../../build', 'index.html'));
  });
  httpServer.listen(config.port, () => {
    debug(`Server running on ${config.port}. Try hitting ${healthApiRoute}...`);
  });
};

server();

