"use strict";

var inspirationArchitectFactory = require('../src/factory');

var should = require('should');

var _ = require('lodash');

var path = require('path');

var basicTests = require('./basic-tests.min');

describe('server tests', function() {
    
    describe('different config files', function() {

        var config_path = path.join(__dirname, 'fixtures', 'sample-app', 'config');

        var factory_config = {
            config_files: config_path
        };

        var Inspiration = inspirationArchitectFactory(factory_config);

        it('should run the basic tests', function() {

            basicTests(Inspiration);
        });

        it('should honor the server config files', function(done) {

            var inspiration = new Inspiration();

            inspiration.init(function(err) {

                if (err) {
                    throw err;
                }
                should(inspiration.app.config('a_sample')).equal('one');
                should(inspiration.app.config('b_sample')).equal('two');
                should(inspiration.app.config('e_sample.f_sample.g_sample')).equal(5);
                should(inspiration.app.config('external.h_sample')).equal('hello');
                done();
            });
        });

        it('should be able to overwrite server config files', function(done) {

            var config = {
                a_sample: 'overwritten',
                b_sample: 'also overwritten',
                external: {
                    h_sample: 'this is also overwritten'
                }
            };
            var inspiration = new Inspiration({
                config: config
            });

            inspiration.init(function(err) {

                if (err) {
                    throw err;
                }
                should(inspiration.app.config('a_sample')).equal(config.a_sample);
                should(inspiration.app.config('b_sample')).equal(config.b_sample);
                should(inspiration.app.config('external.h_sample')).equal(config.external.h_sample);
                should(inspiration.app.config('external.i_sample')).not.equal(undefined);
                done();
            });
        });
        
    });

    describe('no config files', function() {

        var config_path = path.join(__dirname, 'fixtures', 'empty');

        var factory_config = {
            config_files: config_path
        };

        var Inspiration = inspirationArchitectFactory(factory_config);

        it('should run the basic tests', function() {

            basicTests(Inspiration);
        });

        it('should be able to overwrite empty server config files', function(done) {

            var config = {
                a_sample: 'overwritten',
                b_sample: 'also overwritten',
                external: {
                    h_sample: 'this is also overwritten'
                }
            };
            var inspiration = new Inspiration({
                config: config
            });

            inspiration.init(function(err) {

                if (err) {
                    throw err;
                }
                should(inspiration.app.config('a_sample')).equal(config.a_sample);
                should(inspiration.app.config('b_sample')).equal(config.b_sample);
                should(inspiration.app.config('external.h_sample')).equal(config.external.h_sample);
                done();
            });
        });
    });

    describe('reference server providers', function() {

        var providers_path = path.join(__dirname, 'fixtures', 'sample-app', 'providers');

        var factory_config = {
            provider_files: providers_path
        };

        var Inspiration = inspirationArchitectFactory(factory_config);

        it('should run the server providers based on the config', function(done) {

            var inspiration = new Inspiration({
                config: {
                    providers: [
                        'addSomethingAsync',
                        'addSomething',
                        function(app, done) {
                            app.doSomethingElse = function() {

                                return 3;
                            };
                            done();
                        }
                    ]
                }
            });

            inspiration.init(function(err) {

                if (err) {
                    throw err;
                }

                inspiration.app.doSomethingAsync().should.equal(1);
                inspiration.app.doSomething().should.equal(2);
                inspiration.app.doSomethingElse().should.equal(3);

                done();
            });

        });
    });
    
    describe('no provider files', function() {

        var provider_path = path.join(__dirname, 'fixtures', 'empty');

        var factory_config = {
            provider_files: provider_path
        };

        var Inspiration = inspirationArchitectFactory(factory_config);

        it('should run the basic tests', function() {

            basicTests(Inspiration);
        });
        
        it('should still run initial providers', function(done) {
            
            var inspiration = new Inspiration({
                providers: [
                    function(app, done) {
                        
                        app.something_property = 1;
                        done();
                    },
                    function(app, done) {

                        app.something_other_property = 2;
                        done();
                    }
                ],
                config: {
                    providers: [
                        function(app, done) {
                            app.something_third_property = 3;
                            done();
                        }
                    ]
                }
            });
            
            inspiration.init(function(err) {
                
                if (err) {
                    throw err;
                }
                inspiration.app.something_property.should.equal(1);
                inspiration.app.something_other_property.should.equal(2);
                inspiration.app.something_third_property.should.equal(3);
                done();
            });
            
        });
    });
    
    describe('different factory config values combined', function() {

        var config_env_filename = 'local';
        var config_app_filename = 'application';
        var config_providers_path = 'these.are.my.providers';
        var app_config_path = 'locals.config';
        var providers_path = path.join(__dirname, 'fixtures', 'sample-app', 'providers');

        var factory_config = {
            config_files: {},
            config_env_filename: config_env_filename,
            config_app_filename: config_app_filename,
            config_providers_path: config_providers_path,
            app_config_path: app_config_path,
            provider_files: providers_path
        };
        factory_config.config_files[config_env_filename] = {
            greeting: 'aloha'
        };
        factory_config.config_files[config_app_filename] = {
            greeting: 'hello',
            parting: 'goodbye'
        };
        _.set(factory_config.config_files[config_app_filename], config_providers_path, [
            'addSomething'
        ]);

        var Inspiration = inspirationArchitectFactory(factory_config);
        
        it('should honor the factory config', function(done) {
            
            var inspiration = new Inspiration();
            inspiration.test = true;
            inspiration.init(function(err) {
                
                if (err) {
                    throw err;
                }
                
                var config = _.get(inspiration.app, app_config_path);
                should(config('greeting')).equal('aloha');
                should(config('parting')).equal('goodbye');
                inspiration.app.doSomething().should.equal(2);
                done();
            });
        });
        
    });
    
});
