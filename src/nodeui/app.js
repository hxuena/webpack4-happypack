const Koa = require("Koa");
const config = require("./config");
const render = require('koa-swig');
const co = require('co');
const serve = require('koa-static');
const router = require('koa-simple-router');
import errorHandler from './middlewares/errorHandle';
const app = new Koa();
import log4js from 'log4js';
const logger = log4js.getLogger('cheese');
import { asClass, asValue, createContainer, Lifetime } from 'awilix';
import { scopePerRequest, loadControllers }  from 'awilix-koa';

// 创建IOC容器
const container = createContainer();
// Scoped lifetime = new instance per request
app.use(scopePerRequest(container))
//装载service
container.loadModules([__dirname + '/services/*.js'], {
  formatName: "camelCase",
  resolverOptions: {
    lifetime: Lifetime.SCOPED
  }
})

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

//自动注册所有的路由
app.use(loadControllers('controllers/*.js', {cwd: __dirname}))
app.use(serve(config.default.staticDir))

app.listen(config.default.port, () => {
  console.log(config)
  console.log(`current port ${config.default.port}`)
})