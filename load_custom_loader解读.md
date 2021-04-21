## loadCustomLoader：加载自定义的文件夹下的内容

在调用loadCustomLoader之前，需要先调用loadConfig

在config.js 里面配置，directory 表示扫描的文件夹，inject表示注入的目标，只能是app或ctx

```aidl
customLoader: {
    adapter: {
      directory: 'app/adapter',
      inject: 'app',
    },
    util: {
      directory: 'app/util',
      inject: 'app',
    },
    repository: {
      directory: 'app/repository',
      inject: 'ctx',
    },
    plugin: {
      directory: 'app/plugin',
      inject: 'app',
      loadunit: true,
    },
},
```

### 逻辑

- 如果指定了loadunit为true，则会使用this.getLoadUnits()，这样的话，plugin、framework、application的对应内容都会加载；
  否则，只会加载application的对应内容。
  
- 如果指定inject为app，则会调用loader.loadToApp，即内容会注入到app对象

- 如果指定inject为ctx，则会调用loader.loadToContext，即内容会注入到ctx对象
