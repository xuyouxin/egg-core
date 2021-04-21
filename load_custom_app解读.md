## 加载app.js 或者 agent.js

如果调用loadCustomApp，加载的是app.js

如果调用loadCustomAgent，加载的是agent.js

搜索的目录是this.getLoadUnits()，所以加载的顺序是plugin，framework，application

### 逻辑

- 如果加载的内容是一个类，则会调用this.lifecycle.addBootHook(bootHook);

 这样这个类 里面可以实现多个 与生命周期相关的钩子方法，例如：configDidLoad、didLoad、willReady、didReady、
    serverDidReady、beforeClose等

- 如果加载的内容是一个方法，则会调用this.lifecycle.addFunctionAsBootHook(bootHook);

 然后这个方法会被当作configDidLoad 这样的钩子，加入到lifecycle里面：egg-redis、egg-mongoose都用的这种
