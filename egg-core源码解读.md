## EggCore

### 属性

- type，值为'application' 或者 'agent'

- baseDir，基础目录

- plugins

- config

- options

- console，用来记录日志

- lifecycle，处理生命周期的事件：'error'、'ready_timeout'、'ready_stat'

- loader

### 只读属性

- name，The name of application

- plugins，Retrieve enabled plugins

- config，The configuration of application

- router，EggRouter 类的实例

### 生命周期相关的方法

- beforeStart，Execute scope after loaded and before app start，注释说该方法已弃用
           This method is now NOT recommanded and reguarded as a deprecated one,
             For plugin development, we should use `didLoad` instead.
             For application development, we should use `willReady` instead.

- ready，register an callback function that will be invoked when application is ready.

- readyCallback

- beforeClose，Register a function that will be called when app close.
           注册一个方法，在应用close时被调用
           
- close，Close all, it will close
           调用beforeClose 注册的方法，`close` 事件绑定的方法
           - callbacks registered by beforeClose
           - emit `close` event
           - remove add listeners

### 方法

- url(name, params)，核心代码 return this.router.url(name, params)

- del(...args)，核心代码 this.router.delete(...args)

- toAsyncFunction(fn)，Convert a generator function to a promisable one.

- toPromise ： Convert an object with generator functions to a Promisable one.
       参数可以是数组或对象
       
- use，override koa's app.use, support generator function

### 加载过程

configDidLoad，didLoad，willReady，didReady

beforeClose in app，
beforeClose in plugin，
beforeClose in plugin dep，

### loader

- app.loader.loadToContext

- app.loader.FileLoader

- app.loader.ContextLoader

- app.loader.appInfo

- app.loader.loadFile

### BaseContextClass 类

有ctx, app, config, service 几个属性

### Lifecycle 类

处理app的生命周期
