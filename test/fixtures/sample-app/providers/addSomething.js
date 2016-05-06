"use strict";

module.exports = function addSomething(app, done) {

    app.something = function() {

        return 'hello';
    };
    done();
};
