'use strict';

module.exports = function(app) {
  app.get('/', function*(ctx) {
    const foo2 = yield ctx.service.foo2();
    const foo3 = yield this.service.foo3.foo3();
    this.body = {
      foo2: foo2,
      foo3: foo3,
      foo4: !!this.service.foo4,
      foo5: !!this.service.fooDir.foo5,
      foo: !!this.service.foo,
      bar2: !!this.service.bar2,
      msg: this.service.hello.msg,
    };
  });

  app.get('/proxy', function*() {
    this.body = {
      coupon: yield this.proxy.couponQuery.query(),
      userInfo: yield this.proxy.userInfoQuery.query(),
      onlyClass: yield this.proxy.onlyClassQuery.query(),
    };
  });
};
