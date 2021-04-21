## EggLoader

### 构造方法的options

baseDir、app、logger

### 属性

- pkg，读取options.baseDir 下的package.json，并用JSON.parse解析

- eggPaths，All framework directories.

- serverEnv，值为'unittest'、'prod'或'local'

- appInfo，包括name、baseDir、env、scope、HOME、pkg、root 这些属性

- serverScope

### 只读属性

- FileLoader，返回的是class对象

- ContextLoader，返回的是class对象

### 方法

- getEggPaths()

- getServerEnv()，读取config/env文件的内容，值为'unittest'、'prod'或'local'，赋值给serverEnv
   
- getAppInfo()

- getAppname()，package.json 里面的name

- getHomedir()，Get home directory，值为process.env.EGG_HOME || homedir() || '/home/admin'

- loadFile(filepath, ...inject)，Load single file, will invoke when export is function
       加载的文件，如果export的是个函数，则会调用函数，inject就是给那个函数的参数
       
- getLoadUnits()，Get all loadUnit
      * loadUnit is a directory that can be loaded by EggLoader, it has the same structure.
      * loadUnit has a path and a type(app, framework, plugin).
      *
      * The order of the loadUnits:
      *
      * 1. plugin
      * 2. framework
      * 3. app

- loadToApp(directory, property, opt)，Load files using {@link FileLoader}, inject to {@link Application}

- loadToContext(directory, property, opt)，Load files using {@link ContextLoader}


