## 加载controller

加载的directory为 path.join(this.options.baseDir, 'app/middleware')

加载出来的东西，会挂到 app.middleware 上面


### 特点
- 加载的时候，搜索了this.getLoadUnits() 的目录，所以plugin、framework、app 的app/service文件夹 都会覆盖

- application 的可以覆盖 framework的，可以覆盖plugin的

- 要使middleware生效，需要在config.js 里面配置exports.middleware 或者 exports.coreMiddleware

  在实际处理过程中，先处理coreMiddleware，后处理middleware，但是两者的名称不能冲突，否则会报错
  
- 可以在config.js里面给middle设置一些匹配条件，例如：
```aidl
exports.status = {
  match(ctx) {
    return ctx.method === 'GET';
  },
};
```
  或者设置ignore条件，例如：
```aidl
exports.status = {
  ignore(ctx) {
    return ctx.method === 'GET';
  },
};
```
  还可以设置disable来禁用它：
```aidl
exports.status = {
  enable: false,
};
```

- 经过前面的加载和过滤之后，最后调用的是：app.use(mw);
