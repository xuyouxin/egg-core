## 加载controller

加载的directory为 path.join(this.options.baseDir, 'app/controller')

加载出来的东西，会挂到 app.controller 上面

只会加载async function 或者 generator function

### 处理过程

最终可以发现，处理之后得到的结果，有着一样的数据结构

1. 判断如果是普通函数，会先运行（传参是app），得到一个结果

例如这种情况：
```aidl
module.exports = app => {
  return class AdminConfig extends app.Controller {
    * getName() {
      this.ctx.body = this.pathName;
    }

    * getFullPath() {
      this.ctx.body = this.fullPath;
    }
  };
};
```

2. 接着，判断如果是类，会调用wrapClass，得到如下对象，并return
```
{
  getName: [Function: classControllerMiddleware] {
    [Symbol(EGG_LOADER_ITEM_FULLPATH)]: '/Users/travis.xu/work_openSource/egg-core/test/fixtures/controller-app/app/controller/admin/config.js#AdminConfig.getName()'
  },
  getFullPath: [Function: classControllerMiddleware] {
    [Symbol(EGG_LOADER_ITEM_FULLPATH)]: '/Users/travis.xu/work_openSource/egg-core/test/fixtures/controller-app/app/controller/admin/config.js#AdminConfig.getFullPath()'
  }
}
 ```
 
3. 接着，判断如果是object，会调用wrapObject，得到如下对象，并return
```aidl
{
  callGeneratorFunction: [AsyncFunction: objectControllerMiddleware] {
    __cache_names: [],
    [Symbol(EGG_LOADER_ITEM_FULLPATH)]: '/Users/travis.xu/work_openSource/egg-core/test/fixtures/controller-app/app/controller/object.js#subObject.callGeneratorFunction()'
  },
  subSubObject: {
    callGeneratorFunction: [AsyncFunction: objectControllerMiddleware] {
      __cache_names: [],
      [Symbol(EGG_LOADER_ITEM_FULLPATH)]: '/Users/travis.xu/work_openSource/egg-core/test/fixtures/controller-app/app/controller/object.js#subObject.subSubObject.callGeneratorFunction()'
    }
  }
}
```

 如果属性是函数，会把它加载到结果上
 
 如果属性是object，会递归调用wrapObject

4. 接着，判断是is.generatorFunction(obj) || is.asyncFunction(obj)，会调用wrapObject，得到如下对象，并return

```aidl
{
  'module.exports': [AsyncFunction: objectControllerMiddleware] {
    __cache_names: [ 'ctx' ],
    [Symbol(EGG_LOADER_ITEM_FULLPATH)]: '/Users/travis.xu/work_openSource/egg-core/test/fixtures/controller-app/app/controller/generator_function_ctx.js#module.exports()'
  }
}
```
