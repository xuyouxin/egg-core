## 加载plugin

app.loader.loadPlugin()：配置的数据，读取出来之后，会赋值给 loader.plugins

### 作用

plugin.js 配置的是 一个plugin是否enable、path或package在哪里

config.js 配置的则是应用或框架里面，为了防止hard code而参数化的一些变量，
       也可以是plugin依赖的一些数据：数据库地址、账号、密码之类的
       
两者是相辅相成的关系

### 顺序（略去了scope的使用）

- plugin.default

- plugin.{env}

顺序来自于 EggLoader的 getTypeFiles

（没plugin.default.js这个文件的话，会尝试找plugin.js）


### 方法

- loadPlugin：加载plugin

- readPluginConfigs：读取plugin的配置，如plugin.default.js、plugin.js、plugin.local.js 等

- normalizePluginConfig：标准化plugin的配置，因为plugin.js 支持很灵活的、多种多样的写法，需要处理成统一的数据结构
    
    如果plugin只是一个boolean值的话，它会这么处理
   
```aidl
     plugins[name] = {
        name,
        enable: plugin,
        dependencies: [],
        optionalDependencies: [],
        env: [],
        from: configPath,
      }
```

- mergePluginConfig：读取plugin.path 下的package.json 文件内容，里面有name、version、dependencies、env等信息

- getOrderPlugins：处理依赖，得到一个有一定排序的plugins列表

### 属性

- allPlugins，全部的plugins
- appPlugins，应用的plugins
- customPlugins，创建应用实例时，放在options的plugins
- eggPlugins，egg框架的plugins

- orderPlugins，处理过依赖、有排序的plugins
