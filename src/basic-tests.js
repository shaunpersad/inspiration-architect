var should = require('should');
var _get = require('lodash/get');
var _set = require('lodash/set');
var inspirationArchitectFactory = require('../src/factory');


function basicTests(Inspiration) {

    var app_config_path = Inspiration.factory_config.app_config_path;

    describe('with no initials', function() {

        it('should create a new inspiration class, then a new instance, with a config function.', function(done) {

            var inspiration = new Inspiration();

            inspiration.init(function(err) {

                if (err) {
                    throw err;
                }
                should(_get(inspiration.app, app_config_path)).not.equal(undefined);
                done();
            });
        });
    });

    describe('with an initial app', function() {

        var app = {
            name: 'My Cool App'
        };


        it('should create a new inspiration class, then a new instance with the initial app.', function(done) {

            var inspiration = new Inspiration({app: app});
            inspiration.app.should.equal(app);
            inspiration.app.should.have.property('name', app.name);

            inspiration.init(function(err) {

                if (err) {
                    throw err;
                }
                should(_get(inspiration.app, app_config_path)).not.equal(undefined);
                done();
            });
        });

    });

    describe('with an initial config', function() {

        var config = {
            a: 'hola',
            b: {
                c: 'aloha'
            }
        };

        it('should create a new inspiration class, then a new instance.', function(done) {

            var inspiration = new Inspiration({config: config});
            inspiration.config.should.equal(config);
            inspiration.init(function(err) {

                if (err) {
                    throw err;
                }

                should(_get(inspiration.app, app_config_path)).not.equal(undefined);
                _get(inspiration.app, app_config_path)('a').should.equal(config.a);
                _get(inspiration.app, app_config_path)('b.c').should.equal(config.b.c);
                done();
            });
        });
    });

    describe('with an initial app and an initial config', function() {

        var app = {
            name: 'My Cool App'
        };

        var config = {
            a: 'hola',
            b: {
                c: 'aloha'
            }
        };

        it('should create a new inspiration class, then a new instance.', function(done) {

            var inspiration = new Inspiration({app: app, config: config});
            inspiration.config.should.equal(config);
            inspiration.init(function(err) {

                if (err) {
                    throw err;
                }
                inspiration.app.should.equal(app);
                inspiration.app.should.have.property('name', app.name);
                should(_get(inspiration.app, app_config_path)).not.equal(undefined);
                _get(inspiration.app, app_config_path)('a').should.equal(config.a);
                _get(inspiration.app, app_config_path)('b.c').should.equal(config.b.c);

                done();
            });
        });
    });


    describe('with an initial set of providers', function() {

        var providers = [
            function(app, done) {
                app.something = function() {
                    return 1;
                };
                done();
            },
            function(app, done) {

                setTimeout(function() {

                    app.somethingAsync = function() {
                        return 2;
                    };
                    done();
                }, 100);
            }
        ];

        it('should create a new inspiration class, then a new instance.', function(done) {

            var inspiration = new Inspiration({providers: providers});
            inspiration.providers.should.equal(providers);
            inspiration.init(function(err) {

                if (err) {
                    throw err;
                }
                inspiration.app.should.have.property('something');
                inspiration.app.something().should.equal(1);
                inspiration.app.should.have.property('somethingAsync');
                inspiration.app.somethingAsync().should.equal(2);
                done();
            });
        });
    });

    describe('with an initial app, an initial config, and an initial set of providers', function() {

        var app = {
            name: 'My Cool App'
        };

        var config = {
            a: 'hola',
            b: {
                c: 'aloha'
            }
        };
        _set(config, Inspiration.factory_config.config_providers_path, [
            function(app, done) {
                app.somethingElse = function() {

                    return 3;
                };
                done();
            }
        ]);

        var providers = [
            function(app, done) {
                app.something = function() {
                    return 1;
                };
                done();
            },
            function(app, done) {

                setTimeout(function() {

                    app.somethingAsync = function() {
                        return 2;
                    };
                    done();
                }, 100);
            }
        ];

        it('should create a new inspiration class, then a new instance.', function(done) {

            var inspiration = new Inspiration({app: app, config: config, providers: providers});
            inspiration.config.should.equal(config);
            inspiration.init(function(err) {

                if (err) {
                    throw err;
                }
                inspiration.app.should.equal(app);
                inspiration.app.should.have.property('name', app.name);
                should(_get(inspiration.app, app_config_path)).not.equal(undefined);
                _get(inspiration.app, app_config_path)('a').should.equal(config.a);
                _get(inspiration.app, app_config_path)('b.c').should.equal(config.b.c);
                inspiration.app.should.have.property('something');
                inspiration.app.something().should.equal(1);
                inspiration.app.should.have.property('somethingAsync');
                inspiration.app.somethingAsync().should.equal(2);
                inspiration.app.should.have.property('somethingElse');
                inspiration.app.somethingElse().should.equal(3);
                done();
            });
        });
    });
}
describe('factory', function() {

    describe('empty factory config', function() {

        var Inspiration = inspirationArchitectFactory();

        basicTests(Inspiration);
    });

    describe('different app config path', function() {

        var factory_config = {
            app_config_path: 'locals.config'
        };

        var Inspiration = inspirationArchitectFactory(factory_config);

        basicTests(Inspiration);

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

        basicTests(Inspiration);

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
module.exports = basicTests;