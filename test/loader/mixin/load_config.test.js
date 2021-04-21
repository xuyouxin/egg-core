'use strict';

const path = require('path');
const assert = require('assert');
const mm = require('mm');
const utils = require('../../utils');
const Application = require('../../..').EggCore;

describe('test/loader/mixin/load_config.test.js', () => {
  let app;
  afterEach(() => app.close());
  afterEach(mm.restore);

  it('should load application config overriding default of egg', () => {
    app = utils.createApp('config');
    const loader = app.loader;
    loader.loadPlugin();
    loader.loadConfig();
    assert(loader.config.name === 'config-test');
    assert(loader.config.test === 1);
    // 支持嵌套覆盖
    assert.deepEqual(loader.config.urllib, {
      keepAlive: false,
      keepAliveTimeout: 30000,
      timeout: 30000,
      maxSockets: Infinity,
      maxFreeSockets: 256,
    });
  });

  it('should load plugin config overriding default of egg', () => {
    app = utils.createApp('plugin');
    const loader = app.loader;
    loader.loadPlugin();
    loader.loadConfig();
    assert(loader.config.name === 'override default'); // why?
  });

  it('should load application config overriding plugin', () => {
    app = utils.createApp('plugin');
    const loader = app.loader;
    loader.loadPlugin();
    loader.loadConfig();
    assert(loader.config.plugin === 'override plugin'); // configured in config/config.js
  });

  // egg config.default
  //   framework config.default
  //     egg config.local
  //       framework config.local
  it('should load config by env', () => {
    app = utils.createApp('config-env');
    const loader = app.loader;
    loader.loadPlugin();
    loader.loadConfig();
    console.log('loader.config.egg>>', loader.config.egg);
    assert(loader.config.egg === 'egg-default'); // configured in config/config.js
  });

  it('should override config by env.EGG_APP_CONFIG', () => {
    mm(process.env, 'EGG_APP_CONFIG', JSON.stringify({
      egg: 'env_egg',
      foo: {
        bar: 'env_bar',
      },
    }));
    app = utils.createApp('config-env-app-config');
    const loader = app.loader;
    loader.loadPlugin();
    loader.loadConfig();
    assert(loader.config.egg === 'env_egg'); // 覆盖了config/config.js 里面的值
    assert(loader.config.foo.bar === 'env_bar'); // 覆盖了config/config.js 里面的值
    assert(loader.config.foo.bar2 === 'b');
    assert(loader.configMeta.egg === '<process.env.EGG_APP_CONFIG>');
    assert(loader.configMeta.foo.bar === '<process.env.EGG_APP_CONFIG>');
    console.log('loader.configMeta.foo.bar>>', loader.configMeta.foo.bar); // loader.configMeta 里面记录了值的来源
    console.log('loader.configMeta.foo.bar2>>', loader.configMeta.foo.bar2); // loader.configMeta 里面记录了值的来源
  });

  it('should override config with invalid env.EGG_APP_CONFIG', () => {
    mm(process.env, 'EGG_APP_CONFIG', 'abc'); // EGG_APP_CONFIG 必须是json格式的字符串，否则不生效
    app = utils.createApp('config-env-app-config');
    const loader = app.loader;
    loader.loadPlugin();
    loader.loadConfig();
    assert(loader.config.egg === 'egg-default');
    assert(loader.config.foo.bar === 'a');
    assert(loader.config.foo.bar2 === 'b');
  });

  it('should not load config of plugin that is disabled', () => {
    app = utils.createApp('plugin');
    const loader = app.loader;
    loader.loadPlugin();
    loader.loadConfig();
    assert(!loader.config.pluginA);
  });

  it('should throw when plugin define middleware', () => {
    const pluginDir = utils.getFilepath('plugin/plugin-middleware');
    app = utils.createApp('plugin', {
      plugins: {
        middleware: {
          enable: true,
          path: pluginDir,
        },
      },
    });
    const loader = app.loader;
    try {
      loader.loadPlugin();
      loader.loadConfig();
      throw new Error('should not run');
    } catch (err) {
      assert(err.message.includes(`Can not define middleware in ${path.join(pluginDir, 'config/config.default.js')}`));
    }
  });

  it('should throw when app define coreMiddleware', () => {
    app = utils.createApp('app-core-middleware');
    assert.throws(() => {
      app.loader.loadPlugin();
      app.loader.loadConfig();
    }, new RegExp('Can not define coreMiddleware in app or plugin')); // coreMiddleware 只能在framework里面定义？
  });

  it('should read appinfo from the function of config', () => {
    app = utils.createApp('preload-app-config');
    const loader = app.loader;
    loader.loadPlugin();
    loader.loadConfig();
    assert(loader.config.plugin.val === 2);
    assert(loader.config.plugin.sub !== loader.config.app.sub);
    assert(loader.config.plugin.sub.val === 2);
    assert(loader.config.app.sub.val === 1);
    assert(loader.config.appInApp === false);
  });

  it('should load config without coreMiddleware', () => {
    app = new Application({
      baseDir: path.join(__dirname, '../../fixtures/no-core-middleware'),
    });
    app.loader.loadPlugin();
    app.loader.loadConfig();
    assert(app.config.coreMiddleware.length === 0);
  });

  it('should override array', () => {
    app = utils.createApp('config-array');
    app.loader.loadPlugin();
    app.loader.loadConfig();
    assert.deepEqual(app.config.array, [ 1, 2 ]); // the config in plugin b override the config in plugin a
    // plugin 的config文件 export的值，直接挂载到了app.config上面
  });

  it('should generate configMeta', () => {
    app = utils.createApp('configmeta');
    app.loader.loadPlugin();
    app.loader.loadConfig();
    const configMeta = app.loader.configMeta;
    const configPath = utils.getFilepath('configmeta/config/config.js');
    assert(configMeta.console === configPath); // loader.configMeta 里面记录了值的来源
    assert(configMeta.array === configPath);
    assert(configMeta.buffer === configPath);
    assert(configMeta.ok === configPath);
    assert(configMeta.f === configPath);
    assert(configMeta.empty === configPath);
    assert(configMeta.zero === configPath);
    assert(configMeta.number === configPath);
    assert(configMeta.no === configPath);
    assert(configMeta.date === configPath);
    assert(configMeta.ooooo === configPath);

    assert(configMeta.urllib.keepAlive === configPath);
    assert(configMeta.urllib.timeout === utils.getFilepath('egg/config/config.default.js'));
    assert(configMeta.urllib.foo === configPath);
    assert(configMeta.urllib.n === configPath);
    assert(configMeta.urllib.dd === configPath);
    assert(configMeta.urllib.httpclient === configPath);
    // undefined will be ignore
    assert(!configMeta.urllib.bar);
  });

  describe('get config with scope', () => {
    it('should return without scope when env = default', async () => {
      mm(process.env, 'EGG_SERVER_ENV', 'default');
      app = utils.createApp('scope-env');
      const loader = app.loader;
      loader.loadPlugin();
      app.loader.loadConfig();
      assert(loader.config.from === 'default');
    });

    it('should return without scope when env = prod', async () => {
      mm(process.env, 'EGG_SERVER_ENV', 'prod');
      app = utils.createApp('scope-env');
      const loader = app.loader;
      loader.loadPlugin();
      app.loader.loadConfig();
      assert(loader.config.from === 'prod'); // 先加载default的，后加载prod的，后加载的覆盖先加载的
    });

    it('should return with scope when env = default', async () => {
      mm(process.env, 'EGG_SERVER_ENV', 'default');
      mm(process.env, 'EGG_SERVER_SCOPE', 'en');
      app = utils.createApp('scope-env');
      const loader = app.loader;
      loader.loadPlugin();
      app.loader.loadConfig();
      assert(loader.config.from === 'en');
    });

    it('should return with scope when env = prod', async () => {
      mm(process.env, 'EGG_SERVER_ENV', 'prod');
      mm(process.env, 'EGG_SERVER_SCOPE', 'en');
      app = utils.createApp('scope-env');
      const loader = app.loader;
      loader.loadPlugin();
      app.loader.loadConfig();
      assert(loader.config.from === 'en_prod');
    });
  });
});
