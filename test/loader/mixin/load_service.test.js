'use strict';

const path = require('path');
const request = require('supertest');
const mm = require('mm');
const assert = require('assert');
const utils = require('../../utils');

describe('test/loader/mixin/load_service.test.js', function () {
  let app;
  afterEach(mm.restore);
  afterEach(() => app.close());

  it('should load from application and plugin', async () => {
    app = utils.createApp('plugin');
    app.loader.loadPlugin();
    app.loader.loadConfig();
    app.loader.loadApplicationExtend();
    app.loader.loadCustomApp();
    app.loader.loadService();
    app.loader.loadController();
    app.loader.loadRouter();
    assert(app.serviceClasses.foo);
    assert(app.serviceClasses.foo2);
    assert(!app.serviceClasses.bar1);
    assert(app.serviceClasses.bar2); // plugin 里面的service 也会被加载进来
    assert(app.serviceClasses.foo4);

    console.log('bar2>>', app.serviceClasses.bar2);

    // bar2>> [Function: Bar2] {
    //       [Symbol(EGG_LOADER_ITEM_FULLPATH)]: '/Users/travis.xu/work_openSource/egg-core/test/fixtures/plugin/node_modules/b/app/service/bar2.js',
    //       [Symbol(EGG_LOADER_ITEM_EXPORTS)]: true
    //     }

    await request(app.callback())
      .get('/')
      .expect({
        foo2: 'foo2',
        foo3: 'foo3',
        foo4: true,
        foo5: true,
        foo: true,
        bar2: true,
        msg: 'hello world',
      })
      .expect(200);
  });

  it('should throw when dulplicate', function () {
    assert.throws(() => {
      app = utils.createApp('service-override');
      app.loader.loadPlugin();
      app.loader.loadConfig();
      app.loader.loadService();
    }, /can't overwrite property 'foo'/); // application里的service与 plugin里的service，名词重复了，会报错
  });

  it('should check es6', function () {
    app = utils.createApp('services_loader_verify');
    app.loader.loadPlugin();
    app.loader.loadConfig();
    app.loader.loadApplicationExtend();
    app.loader.loadService();
    // assert('foo' in app.serviceClasses);
    // assert('bar' in app.serviceClasses.foo);
    // assert('bar1' in app.serviceClasses.foo);
    // assert('aa' in app.serviceClasses.foo);

    assert('foo' in app.service);
    assert('bar' in app.service.foo);
    assert('bar1' in app.service.foo);
    assert('aa' in app.service.foo);
  });

  it('should each request has unique ctx', async () => { // 每个请求有唯一的上下文
    app = utils.createApp('service-unique');
    app.loader.loadPlugin();
    app.loader.loadConfig();
    app.loader.loadApplicationExtend();
    app.loader.loadCustomApp();
    app.loader.loadService();
    app.loader.loadController();
    app.loader.loadRouter();

    await request(app.callback())
      .get('/same?t=1')
      .expect('true')
      .expect(200);

    await request(app.callback())
      .get('/same?t=2')
      .expect('true')
      .expect(200);
  });

  it('should extend app.Service', async () => {
    app = utils.createApp('extends-app-service');
    app.loader.loadPlugin();
    app.loader.loadConfig();
    app.loader.loadApplicationExtend();
    app.loader.loadCustomApp();
    app.loader.loadService();
    app.loader.loadController();
    app.loader.loadRouter();

    await request(app.callback())
      .get('/user')
      .expect(function (res) {
        assert(res.body.user === '123mock');
      })
      .expect(200);
  });

  describe('subdir', function () {
    it('should load 2 level dir', async () => {
      mm(process.env, 'NO_DEPRECATION', '*');
      app = utils.createApp('subdir-services');
      app.loader.loadPlugin();
      app.loader.loadConfig();
      app.loader.loadApplicationExtend();
      app.loader.loadCustomApp();
      app.loader.loadService();
      app.loader.loadController();
      app.loader.loadRouter();

      await request(app.callback())
        .get('/')
        .expect({
          user: {
            uid: '123',
          },
          cif: {
            uid: '123cif',
            cif: true,
          },
          bar1: {
            name: 'bar1name',
            bar: 'bar1',
          },
          bar2: {
            name: 'bar2name',
            bar: 'bar2',
          },
          'foo.subdir2.sub2': {
            name: 'bar3name',
            bar: 'bar3',
          },
          subdir11bar: {
            bar: 'bar111',
          },
          ok: {
            ok: true,
          },
          cmd: {
            cmd: 'hihi',
            method: 'GET',
            url: '/',
          },
          serviceIsSame: true,
          oldStyle: '/',
        })
        .expect(200);
    });
  });

  describe('service in other directory', () => {
    before(() => {
      const baseDir = utils.getFilepath('other-directory');
      app = utils.createApp('other-directory');
      app.loader.loadCustomApp();
      app.loader.loadService({
        directory: path.join(baseDir, 'app/other-service'),
      });
      return app.ready();
    });

    it('should load', () => {
      assert(app.serviceClasses.user);
    });
  });
});
