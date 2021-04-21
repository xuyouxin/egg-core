## 加载config

app.loader.loadConfig()：配置的数据，读取出来之后，会赋值给 loader.config

### 顺序（略去了scope的使用）

- plugin config.default
- framework config.default
- app config.default

- plugin config.{env}
- framework config.{env}
- app config.{env}


config.default.js，config.{env}.js（默认值是local）这个顺序来自于 EggLoader的 getTypeFiles
（没config.default.js这个文件的话，会尝试找config.js）

plugin、framework、app 这个顺序来自于 EggLoader的 getLoadUnits


还可以通过process.env.EGG_APP_CONFIG 来指定配置

### options的属性
