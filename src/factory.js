"use strict";

var _isString = require('lodash/isString');
var _isPlainObject = require('lodash/isPlainObject');
var _isFunction = require('lodash/isFunction');
var _get = require('lodash/get');
var _set = require('lodash/set');
var _defaultsDeep = require('lodash/defaultsDeep');

module.exports = function inspirationArchitectFactory(factory_config) {

    var default_factory_config = {
        config_files: {},
        app_config_path: 'config',
        config_env_filename: '.env',
        config_app_filename: 'app',
        config_providers_path: 'providers',
        provider_files: {}
    };

    factory_config = _defaultsDeep(factory_config || {}, default_factory_config);

    return class InspirationArchitect {

        constructor(initial) {
            
            initial = _defaultsDeep(initial, {
                app: {},
                config: {},
                providers: []
            });

            this.app = initial.app;
            this.config = initial.config;
            this.providers = initial.providers;
        }
        
        loadConfig(callback) {

            if (_isString(factory_config.config_files)) {

                var fs = require('fs');
                var path = require('path');

                fs.readdir(factory_config.config_files, (err, files) => {
                    
                    if (err) {
                        return callback(err);
                    }
                    var config_files = {};

                    for (var x = 0; x < files.length; x++) {

                        var file = files[x];
                        config_files[file] = require(path.join(factory_config.config_files, file));
                    }

                    this.useConfigFiles(config_files);
                    callback();
                });
            } else if (_isPlainObject(factory_config.config_files)) {
                
                this.useConfigFiles(factory_config.config_files);
                callback();
            }
            else {
                this.useConfigFiles();
                callback();
            }
        }

        useConfigFiles(config_files) {

            if (!config_files) {
                config_files = {};
            }

            var addtl_config = {};
            var env_config = {};
            var app_config = {};

            for (var file in config_files) {
                if (file.indexOf('.') !== 0 || file == factory_config.config_env_filename) {

                    var value = config_files[file];

                    if (file == factory_config.config_env_filename) {
                        env_config = value;
                    } else if (file == factory_config.config_app_filename) {
                        app_config = value;
                    } else {
                        addtl_config[file] = value;
                    }
                }
            }

            var _config = _defaultsDeep({}, this.config, env_config, app_config, addtl_config);
            //console.log(_config);
            _set(this.app, factory_config.app_config_path, (path, default_value) => {
                return _get(_config, path, default_value);
            });
        }

        loadProviders(callback) {

            var loadProvider = (provider) => {
                return provider;
            };

            if (_isString(factory_config.provider_files)) {

                var path = require('path');

                loadProvider = (provider) => {
                    return require(path.join(factory_config.provider_files, provider));
                }

            } else if (_isPlainObject(factory_config.provider_files)) {

                loadProvider = (provider) => {
                    return factory_config.provider_files[provider];
                };
            }

            var addtl_providers = _get(this.app, factory_config.app_config_path)(factory_config.config_providers_path, []);

            var providers = this.providers.concat(addtl_providers);
            var index = 0;

            var next = (err) => {

                if (err || index === providers.length) {
                    return callback(err);
                }

                var provider = providers[index++];

                if (_isString(provider)) {

                    provider = loadProvider(provider);
                }

                if (!_isFunction(provider)) {
                    return next(new Error(`Provider ${index} is not a function.`));
                }

                try {

                    provider(this.app, next);

                } catch(err) {

                    next(err);
                }

            };

            next();
        }

        
        init(callback) {

            var fns = [
                (next) => {
                    this.loadConfig(next);
                },
                (next)=> {
                    this.loadProviders(next);
                }
            ];

            var index = 0;

            var next = (err) => {

                if (err || index === fns.length) {
                    return callback(err);
                }

                var fn = fns[index++];

                try {

                    fn(next);

                } catch(err) {

                    next(err);
                }
            };

            next();
        }

        static get factory_config() {
            return factory_config;
        }

        static get default_factory_config() {
            return default_factory_config;
        }
    };
};
