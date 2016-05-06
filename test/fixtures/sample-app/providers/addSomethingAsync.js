"use strict";

module.exports = function addSomethingAsync(app, done) {

    setTimeout(function() {
        
        app.something = function() {
            return 'goodbye';
        };
        done();
    }, 1000);
};

