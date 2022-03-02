import 'dotenv/config';
import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import cgofHandler from './sockets-handlers/cgof';

const app: Application = express();
const server = http.createServer(app);
const io = new Server(server);

const nsp = io.of('/cgof');
nsp.on('connection', cgofHandler);

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
