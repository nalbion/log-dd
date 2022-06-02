import { Server } from 'http';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import mainRouter from './api/main';

const app = new Koa();

app.use(bodyParser());

app.use(mainRouter());

const PORT = process.env.PORT || 9020;

console.info(`Application is running on port ${PORT}, swagger documentation at /swagger`);

const server: Server = app.listen(PORT);

export default server;
