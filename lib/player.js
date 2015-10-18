'use strict'
var home = require('home');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs-extra'));
var config = require('./config.js')
var util = require('./util.js');
var inquirer = require('inquirer')


 class PP {
    constructor() {
        //Paths
        this.HOMEPATH = home();
        this.path = {};
        this.path.profile = home.resolve('~/music-cli/profile.json');
        this.path.playlist = home.resolve('~/music-cli/playlist.json');

        //config profile
        this.profile = {};
        //get profile
       fs.readJSONAsync(this.path.profile)
           .then(obj => {
               console.log(obj);
               this.profile = obj;
           }).catch(err => {
               console.log(err);
           })

        //playlists
        this.playlists = {};
    }


    init() {


        //get playlist
        fs.readJSONAsync(this.path.playlist)
            .then(obj => {
                this.playlist = obj;
                console.log(obj)
                return obj;
            }).catch(err => {
                if (util.noSuchFile(err)) {
                    var question = [{
                        type: "input",
                        name: 'playlist',
                        message: "请先创建一个播放列表",
                    }]
                    inquirer.prompt(question, answer => {
                        console.log(answer)
                    })
                };
            })


        //  var choices = fs.readJSONAsync()

    }
}

module.exports = PP