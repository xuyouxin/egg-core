exports.status = {
  match(ctx) {
    console.log('ctx.method>>', ctx.method);
    return ctx.method === 'GET';
  },
};
