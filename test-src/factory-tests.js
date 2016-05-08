"use strict";

var should = require('should');
var _get = require('lodash/get');
var _set = require('lodash/set');
var globalTests = require('./global-tests');

module.exports = function factoryTests(inspirationArchitectFactory) {
    describe('factory', function() {

        describe('empty factory config', function() {

            var Inspiration = inspirationArchitectFactory();

            globalTests(Inspiration);
        });

        describe('different app config path', function() {

            var factory_config = {
                app_config_path: 'locals.config'
            };

            var Inspiration = inspirationArchitectFactory(factory_config);

            globalTests(Inspiration);

            describe('locals.config', function() {

                it('should be able to access the config at locals.config', function(done) {

                    var inspiration = new Inspiration({
                        config: {
                            greeting: 'hello'
                        }
                    });

                    inspiration.init(function(err) {

                        if (err) {
                            throw err;
                        }

                        should(_get(inspiration.app, factory_config.app_config_path)).not.equal(undefined);
                        inspiration.app.locals.config('greeting').should.equal('hello');
                        done();
                    });
                });
            });
        });

        describe('different config providers path', function() {

            var factory_config = {
                config_providers_path: 'custom.providers'
            };

            var Inspiration = inspirationArchitectFactory(factory_config);

            globalTests(Inspiration);

            describe('custom.providers', function() {

                it('should be able to use custom.providers as the config path to get providers', function(done) {

                    var config = {};
                    _set(config, 'custom.providers', [
                        function(app, done) {
                            app.something = function() {
                                return 'hello';
                            };
                            done();
                        }
                    ]);
                    var inspiration = new Inspiration({
                        config: config
                    });

                    inspiration.init(function(err) {

                        if (err) {
                            throw err;
                        }

                        should(inspiration.app.config('custom.providers')).not.equal(undefined);
                        inspiration.app.something().should.equal('hello');
                        done();
                    });
                });
            });
        });
    });
};