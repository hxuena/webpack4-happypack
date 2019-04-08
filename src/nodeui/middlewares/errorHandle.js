const errorHandle = {
  error(app, logger) {
    app.use(async (ctx, next) => {
      try {
        await next();
      } catch (error) {
        logger.error(error);
        ctx.status = error.status || 200;
        ctx.body = '哎吆，出错了sss'
      }
    });
    app.use(async (ctx, next) => {
      await next();
      if (404 != ctx.status) return;
      ctx.body = '哎吆，出错了'
    })
  }
}
export default errorHandle;