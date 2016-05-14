# inspiration-architect
A thin foundation layer for building applications.

This library provides you with the tools to set up configs for your app, 
and define the series of procedures (called "providers") that should run in order.
This simplistic approach provides the basis for thin, logical, flexible organization of your app.

This library works in both server-side (node.js) and client-side environments.

### What is an app?
In the wild west of JavaScript frameworks, an "app" can mean several things,
from a server-side Express app, to the multitude of client-side solutions like Angular,
React, Meteor, etc.

Several of these technologies utilize an "app" object or concept of some sort.
The goal of this library is not to supplant any of these existing technologies, but
rather to provide a consistent foundation compatible with any app.

To accomplish this, it is necessary to get to the root of what any and all apps should minimally contain: 

1. a variable configuration
2. a series of procedures run in order

For example, think of an Express app: you usually start by defining your routes, 
then listening to a specific port in order to handle requests.  Here, the series of procedures could
include defining the routes then listening, while the variable configuration could include the specific port you listen to.

On the client-side, imagine an app that communicates with several external vendor APIs, 
then displays the data in different types of React components.  Here, the series of procedures could include defining
network call wrapper functions/classes for each vendor's API then mounting the appropriate React component,
while the variable configuration could include the different API base URLs.

### Installation
If in node.js, run `npm install inspiration-architect` and `require` it,
or if in the browser and not using a build process, include `inspiration-architect.min.js` in a script tag.

### Usage
The basis of using this package is to pass an app object (e.g. an `express()` app object, or by default, an empty JavaScript object) 
through a series of functions (called providers) to operate on the `app`, or simply to run bootstrap/setup code.

What goes in a provider function? Anything that can logically be separated out.  
For example, you could have a provider that sets up a database connection:
```
var mongoose = require('mongoose');

module.exports = function mongoProvider(app, done) {

    var uri = app.config('database.mongo.uri');
    var options = app.config('database.mongo.options');

    mongoose.connect(uri, options);

    app.db = mongoose.connection;

    app.db.on('error', function(err) {

        done(err);
    });
    app.db.once('open', function () {
        // yay!
        console.log('MongoDB connection open.');
        done();
    });
};
```
And one that sets up caching:
```
var redis = require('redis');

module.exports = function redisProvider(app, done) {

    var port = app.config('cache.redis.port');
    var host = app.config('cache.redis.host');
    var options = app.config('cache.redis.options');

    app.redis = redis.createClient(port, host, options);

    app.redis.on('error', function(err) {

        done(err);
    });

    app.redis.on('ready', function () {
        // yay!
        console.log('Redis connection ready.');
        done();
    });
};
```

Throughout this entire process, there will be a config function available to allow you to access your config values.
By default, this function is appended to the `app` object via `app.config(path[, default_value])`.

#### Example
Assume the following (very simple) Express.js app:

```
project/
    config/
        app.js
    controllers/
        IndexController.js
    providers/
        controllersProvider.js
        routesProvider.js
    start.js
```
##### project/config/app.js:
```
module.exports = {
    controller_directory: __dirname+'/../controllers/',
    port: 1337,
    providers: [
        'controllersProvider',
        'routesProvider'
    ]
};
```
##### project/controllers/IndexController.js
```
module.exports = {
    getIndex: function(req, res) {
        res.send('hello world.');
    }
};
```
##### project/providers/controllersProvider.js
```
module.exports = function(app, done) {

    var controller_directory = app.config('controller_directory');

    app.getControllerMethod = function(controller, method) {
        
        var controller = require(controller_directory+controller);
        
        return controller[method];
    };  
    
    done();
};
```
##### project/providers/routesProvider.js
```
module.exports = function(app, done) {

    app.get('/', app.getControllerMethod('IndexController', 'getIndex'));
    
    done();
};
```
##### project/start.js
```
var inspirationArchitectFactory = require('inspiration-architect');
var express = require('express');
var app = express();
var path = require('path');

var factory_config = {
    config_files: path.join(__dirname, 'config'),
    provider_files: path.join(__dirname, 'providers')
};

var InspirationArchitect = inspirationArchitectFactory(factory_config);

var architect = new InspirationArchitect({
    app: app
});

architect.init(function(err, app) {

    if (err) {
        return console.error(err);
    }
    var port = app.config('port', 3000);
    
    app.listen(port, function () {
      console.log('Application running.');
    });
});
```
Then, from the `project/` directory, running `node start` will kick things off.

#### Process
The process for use includes:

1. set up the configs
2. set up the providers
3. set up an entry point file, and import the factory function
4. provide the necessary arguments for the factory function to provide you with an `InspirationArchitect` class
5. create a new instance of `InspirationArchitect` with the appropriate initial values
6. call `init()` on the instance

##### 1. set up the configs
Your application should have a directory to store its config files.

In the above example, this corresponds to `project/config/`;

The files will then be merged into a single object, whose values can be accessed via a function assigned to the `app` object.

The config directory should at the very least include an "app.js" file, that exports a plain JavaScript object with config key/value pairs.
There are no restrictions on the structure of this object, and can be arbitrarily complex.  

Other config files added to this directory should likewise export a plain JavaScript object. The contents of these files will be appended to the object in "app.js", using the filename as the key.

Config values can be overwritten using a `.gitignore`'d ".env.js" environment file.

For example, let's say you have an "app.js":
```
module.exports = {
    a_sample: 1,
    b_sample: 'two',
    c_sample: [
        true, {
            d_sample: 4
        }
    ],
    e_sample: {
        f_sample: {
            g_sample: 5
        }
    }
};
```
And another file called "external.js":
```
module.exports = {
    h_sample: 'hello',
    i_sample: 'goodbye'
};
```
And an ".env.js" file:
```
module.exports = {
    a_sample: 'one'
};
```

The contents of these three files will then be automatically merged into a single object at runtime that looks like:
```
{
    a_sample: 'one',
    b_sample: 'two',
    c_sample: [
        true, {
            d_sample: 4
        }
    ],
    e_sample: {
        f_sample: {
            g_sample: 5
        }
    },
    external: {
        h_sample: 'hello',
        i_sample: 'goodbye'
    }
}
```
You can then access these values via `app.config(path[, default_value])`, using lodash's path syntax e.g.
```
var g_sample = app.config('e_sample.f_sample.g_sample');
```
You may also supply a default value when accessing, in case the value is not available:
```
var j_sample = app.config('j_sample', 6);
```
The path used to append the config function to the `app` object can be set in the factory config, by providing your own `app_config_path` key (the default is "config"),
e.g. supplying "my.config.values" as `app_config_path` will make the config function available via `app.my.config.values(path[, default_value])`.


##### 2. set up the providers
Your application should have a directory to store its provider functions.

In the above example, this corresponds to `project/providers/`;

Each file in that directory should export a function that looks like:
```
module.exports = function(app, done) {
    // do some stuff.
    done();
};
```
This function is asynchronous, so you must call `done(err)`, when done. If an `err` is specified, the sequence will be halted, much like Express-style middleware.

Each provider function will then execute in the order specified by the appropriate array in the config values.
By default, the config key is set to `providers`, but that can be changed by providing your own `config_providers_path` key to the factory config object.

For example, in your providers directory, lets say you had files called "someProvider.js", "someOtherProvider.js", and "yourProvider.js",
and each file exported a function as described above.  You can then specify the order of execution of these functions in the config.
e.g. in your "app.js" config file:
```
module.exports = {
    providers: [
        'someOtherProvider',
        'yourProvider',
        'someProvider'
    ]
};
```
This configuration will execute "someOtherProvider" first, "yourProvider" second, and "someProvider" third, with the `app` object flowing through each of these.

##### 3. set up an entry point file, and import the factory function
There should be an entry point file that kicks off your application.

In the above example, this corresponds to `project/start.js`;

In this file, you should set up your initial `app` object (if there is one), and supply the appropriate values to the `inspirationArchitectFactory` function.

##### 4. provide the necessary arguments for the factory function to provide you with an `InspirationArchitect` class.
The factory function takes a `factory_config` plain JavaScript object with the following default values:
```
{
    config_files: {},
    config_files_use_ext: '.js',
    app_config_path: 'config',
    config_env_filename: '.env',
    config_app_filename: 'app',
    config_providers_path: 'providers',
    provider_files: {}
}
```
You may override any of these values with an object of your own.  Usually you'll want to override `config_files` and `provider_files`.
Here's a description of each key:

* `config_files`: can be either a string of the absolute path to a directory where your config files are stored, or an object whose keys map to various objects.
* `config_files_use_ext`: the extension that your config files use.
* `app_config_path`: the path that will be used on the `app` object to create a function that will allow you to access the config values.
* `config_env_filename`: the filename of the environment config file.
* `config_app_filename`: the filename of the main app config file.
* `config_providers_path` the path in the merged config object that will be used to access the list of providers
* `provider_files`: can be either a string of the absolute path to a directory where your provider files are stored, or an object whose keys map to various provider functions.



You can then get the `InspirationArchitect` class by calling the factory function:
```
var InspirationArchitect = inspirationArchitectFactory(factory_config);
```

##### 5. create a new instance of `InspirationArchitect` with the appropriate initial values.
Once you have an `InspirationArchitect` class, you can create an instance of it by supplying some optional initial values.

The default initial values are as follows:
```
{
    app: {},
    config: {},
    providers: []
}
```
You may override any of these values with an object of your own.  Usually you'll want to override `app` with an `app` of your own.
Here's a description of each key:

* `app`: an object to be passed through the providers, e.g. an `express()` object.
* `config`: an object that can override the combined config values (useful for setting up tests).
* `providers`: initial providers that will run before any of the providers specified in the config.


You can then get an instance by calling `new`:
```
var architect = new InspirationArchitect(initial);
```

##### 6. call `init()` on the instance
Once you have an instance of `InspirationArchitect`, you are ready to call `init(callback)`, 
which will load the configs, then iterate through and execute the providers.
Once the final provider has called its `done` method, or an error is passed to a provider's `done` method, the `callback` will be triggered.
The `callback` is of signature `function(err, app){}`.
```
architect.init(function(err, app) {

    if (err) {
        return console.error(err);
    }
    var port = app.config('port', 3000);
    
    app.listen(port, function () {
      console.log('Application running.');
    });
});
```
#### Client-side Examples

The main difference between using this library client-side vs. server-side is that the browser cannot read files from the filesystem,
so you must provide it with a way to do so as part of your build process.  

##### Via Browserify
Here's an example of how to do so via Browserify + 
[require-globify](https://github.com/capaj/require-globify). Compare the Express.js example's `start.js` file to this:
```
var inspirationArchitectFactory = require('inspiration-architect');

var config_files = require('./config/*.js', {mode: 'hash', options: {dot: true}});
var provider_files = require('./providers/*.js', {mode: 'hash'});

var factory_config = {
    config_files: config_files,
    provider_files: provider_files
};

var InspirationArchitect = inspirationArchitectFactory(factory_config);

var architect = new InspirationArchitect();
architect.init(function(err, app) {

    console.log('This is running on the browser!');
});
```
You'd then point Browserify to this entry point file to generate your bundle file to include in your script tag:
```
var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var globify = require('require-globify');

gulp.task('browserify', function() {

    browserify({
        entries: './start.js',
        debug: true,
        standalone: 'browserify'
    })
    .transform(babelify, {presets: ['es2015']}) // npm install --save-dev babel-preset-es2015
    .transform(globify)
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('./'));
});

```

##### Via Webpack
Without any external packages, you can get access to your files like so:
```
var inspirationArchitectFactory = require('../inspiration-architect.min');

function requireAll(r) {

    var hash = {};
    r.keys().forEach(function(key) {
        var pieces = key.split('/');
        hash[pieces[pieces.length - 1]] = r(key);
    });
    return hash;
}

var config_files = requireAll(require.context('./config/', true, /\.js$/));
config_files['.env'] = require('./config/.env');
var provider_files = requireAll(require.context('./providers/', true, /\.js$/));

var factory_config = {
    config_files: config_files,
    provider_files: provider_files
};

var InspirationArchitect = inspirationArchitectFactory(factory_config);

var architect = new InspirationArchitect();
architect.init(function(err, app) {

    console.log('This is running on the browser!');
});
```
Notice that in the above example, we're using `inspiration-architect.min.js`, 
since Webpack does not polyfill the `fs` module by default, which is already polyfilled in the minified version of this library.

### Tests
Run `npm test` to run all tests. 
You may also individually run the Browserify and Webpack tests individually in the browser by opening the
`test/browser/browserify.html` and `test/browser/webpack.html` files in your browser.