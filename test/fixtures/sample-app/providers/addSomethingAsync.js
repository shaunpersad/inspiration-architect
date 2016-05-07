"use strict";

module.exports = function addSomethingAsync(app, done) {

    setTimeout(function() {
        
        app.doSomethingAsync = function() {
            return 1;
        };
        done();
    }, 100);
};

