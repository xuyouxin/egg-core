## FileLoader

Load files from directory to target object.

### 默认值

- lowercaseFirst: false,
- caseStyle: 'camel',

### 方法

- load()：attach items to target object，先调用parse得到items，然后把它变成target对象的属性

- parse()：Parse files from given directories, then return an items list, each item contains properties and exports.
         EGG_TYPESCRIPT === 'true' 时，会加载js和ts文件（.d.ts文件除外）；否则，加载js文件。
         过滤掉options.ignore 的文件，
         基于options.directory 来扫描文件夹，
         使用options.filter 来过滤文件，
         返回items数组，它有如下属性：{ fullpath, properties, exports }

###parse得到的items

```aidl
[
      {
        fullpath: '/Users/travis.xu/work_openSource/egg-core/test/fixtures/load_dirs/services/foo.js',
        properties: [ 'foo' ],
        exports: { get: [Function] }
      },
      {
        fullpath: '/Users/travis.xu/work_openSource/egg-core/test/fixtures/load_dirs/services/foo_bar_hello.js',
        properties: [ 'fooBarHello' ],
        exports: {}
      },
      {
        fullpath: '/Users/travis.xu/work_openSource/egg-core/test/fixtures/load_dirs/services/foo_service.js',
        properties: [ 'fooService' ],
        exports: { a: 1 }
      },
      {
        fullpath: '/Users/travis.xu/work_openSource/egg-core/test/fixtures/load_dirs/services/userProfile.js',
        properties: [ 'userProfile' ],
        exports: { getByName: [Function] }
      },
      {
        fullpath: '/Users/travis.xu/work_openSource/egg-core/test/fixtures/load_dirs/services/dir/abc.js',
        properties: [ 'dir', 'abc' ],
        exports: {}
      },
      {
        fullpath: '/Users/travis.xu/work_openSource/egg-core/test/fixtures/load_dirs/services/dir/service.js',
        properties: [ 'dir', 'service' ],
        exports: { load: true, app: undefined }
      },
      {
        fullpath: '/Users/travis.xu/work_openSource/egg-core/test/fixtures/load_dirs/services/hyphen-dir/a.js',
        properties: [ 'hyphenDir', 'a' ],
        exports: {}
      },
      {
        fullpath: '/Users/travis.xu/work_openSource/egg-core/test/fixtures/load_dirs/services/underscore_dir/a.js',
        properties: [ 'underscoreDir', 'a' ],
        exports: {}
      }
    ]
```

### load 得到的target

```aidl
{
      foo: {
        get: [Function],
        [Symbol(EGG_LOADER_ITEM_FULLPATH)]: '/Users/travis.xu/work_openSource/egg-core/test/fixtures/load_dirs/services/foo.js',
        [Symbol(EGG_LOADER_ITEM_EXPORTS)]: true
      },
      fooBarHello: {
        [Symbol(EGG_LOADER_ITEM_FULLPATH)]: '/Users/travis.xu/work_openSource/egg-core/test/fixtures/load_dirs/services/foo_bar_hello.js',
        [Symbol(EGG_LOADER_ITEM_EXPORTS)]: true
      },
      fooService: {
        a: 1,
        [Symbol(EGG_LOADER_ITEM_FULLPATH)]: '/Users/travis.xu/work_openSource/egg-core/test/fixtures/load_dirs/services/foo_service.js',
        [Symbol(EGG_LOADER_ITEM_EXPORTS)]: true
      },
      userProfile: {
        getByName: [Function],
        [Symbol(EGG_LOADER_ITEM_FULLPATH)]: '/Users/travis.xu/work_openSource/egg-core/test/fixtures/load_dirs/services/userProfile.js',
        [Symbol(EGG_LOADER_ITEM_EXPORTS)]: true
      },
      dir: {
        abc: {
          [Symbol(EGG_LOADER_ITEM_FULLPATH)]: '/Users/travis.xu/work_openSource/egg-core/test/fixtures/load_dirs/services/dir/abc.js',
          [Symbol(EGG_LOADER_ITEM_EXPORTS)]: true
        },
        service: {
          load: true,
          app: undefined,
          [Symbol(EGG_LOADER_ITEM_FULLPATH)]: '/Users/travis.xu/work_openSource/egg-core/test/fixtures/load_dirs/services/dir/service.js',
          [Symbol(EGG_LOADER_ITEM_EXPORTS)]: true
        }
      },
      hyphenDir: {
        a: {
          [Symbol(EGG_LOADER_ITEM_FULLPATH)]: '/Users/travis.xu/work_openSource/egg-core/test/fixtures/load_dirs/services/hyphen-dir/a.js',
          [Symbol(EGG_LOADER_ITEM_EXPORTS)]: true
        }
      },
      underscoreDir: {
        a: {
          [Symbol(EGG_LOADER_ITEM_FULLPATH)]: '/Users/travis.xu/work_openSource/egg-core/test/fixtures/load_dirs/services/underscore_dir/a.js',
          [Symbol(EGG_LOADER_ITEM_EXPORTS)]: true
        }
      }
    }

```
