## 加载service

加载的directory为 path.join(this.options.baseDir, 'app/service')

配置了fieldClass: 'serviceClasses'，加载出来的东西，会挂到 app.serviceClasses 上面，


### 特点
loadService里面调用了this.loadToContext(servicePaths, 'service', opt); 

- 加载出来的东西，会放入到context里面；这样的话，调用middleware的时候，ctx.service 直接可以访问到

- service的属性，既可以是方法，也可以是对象

- 加载的时候，搜索了this.getLoadUnits() 的目录，所以plugin、framework、app 的app/service文件夹 都会覆盖
