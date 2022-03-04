import 'dotenv/config';
import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import {
  conwayAuthenticator,
  conwaySocketHandler,
} from './socket-handlers/conway';

const app: Application = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});

const nsp = io.of('/conway');
nsp.use(conwayAuthenticator);
nsp.on('connection', conwaySocketHandler);

app.use(express.static(path.join(__dirname, '../public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/api', (req: Request, res: Response) => {
  res.send('App is Running');
});
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`server is running on PORT ${PORT}`);
});
