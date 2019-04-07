import IndexController from './indexController'
const indexController = new IndexController()

const init = (app, router) => {
  app.use(router(_ => {
  console.log(1)
    _.get("/", indexController.indexAction())
  }))
}

export default init