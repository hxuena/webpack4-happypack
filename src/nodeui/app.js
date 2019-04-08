const Koa = require("Koa");
const config = require("./config");
const render = require('koa-swig');
const co = require('co');
const serve = require('koa-static');
const router = require('koa-simple-router');
import controllerInit from './controllers';
import errorHandler from './middlewares/errorHandle';
import log4js from 'log4js';
const logger = log4js.getLogger('cheese');

const app = new Koa();

app.context.render = co.wrap(render({
  root: config.default.viewDir,
  autoescape:true,
  cache: 'memory',
  ext: 'html',
  varControls: ["[[","]]"],
  writeBody: false
}))
log4js.configure({
  appenders: { cheese: { type: 'file', filename: __dirname + '/logs/errpr.log' } },
  categories: { default: { appenders: ['cheese'], level: 'error' } }
});

errorHandler.error(app, logger)
controllerInit(app, router)
app.use(serve(config.default.staticDir))

app.listen(config.default.port, () => {
  console.log(config)
  console.log(`current port ${config.default.port}`)
})