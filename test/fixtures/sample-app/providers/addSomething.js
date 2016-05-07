"use strict";

module.exports = function addSomething(app, done) {

    app.doSomething = function() {

        return 2;
    };
    done();
};
