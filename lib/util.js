'use strict'

exports.noSuchFile = function(msg) {
    return msg && msg.errno == -2;
}