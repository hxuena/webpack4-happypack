const Koa = require("Koa");
const config = require("./config");
const render = require('koa-swig');
const co = require('co');
const serve = require('koa-static');
const router = require('koa-simple-router');
import controllerInit from './controllers'

const app = new Koa();

app.context.render = co.wrap(render({
  root: config.default.viewDir,
  autoescape:true,
  cache: 'memory',
  ext: 'html',
  varControls: ["[[","]]"],
  writeBody: false
}))

controllerInit(app, router)
app.use(serve(config.default.staticDir))

app.listen(config.default.port, () => {
  console.log(config)
  console.log(`current port ${config.default.port}`)
})