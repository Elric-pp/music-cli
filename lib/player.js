'use strict'
var home = require('home');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs-extra'));
var config = require('./config.js')
var util = require('./util.js');
var inquirer = require('inquirer')
var menu = require('./menu.js').menu;
var Menu = require('./menu.js');
var menu = new Menu();

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
                this.profile = obj;
            }).catch(err => {
                if (util.noSuchFile(err)) {
                    fs.writeJSON(this.path.profile, config);
                    fs.mkdirs(this.HOMEPATH + config.default.downLoadDir);
                }
            })


        //playlists
        this.playlists = {};

    }


    init() {
        menu.homeMenu()
        .catch(answer=>{
            if (answer.option == 's') {
                this.search();
            };
        })
    }

    search () {
        menu.search().catch(answer => {
            console.log('getSong' +answer)
            menu.getSong(answer)
        })
    }

    getPlayList(answer) {
        //get playlist
        fs.readJSONAsync(this.path.playlist)
            .then(obj => {
                this.playlist = obj;
                this.playlist.forEach(list)
            }).catch(err => {
                if (util.noSuchFile(err)) {
                    var question = menu.addPlayList;
                    inquirer.prompt(question, answer => {
                        var playlist = [{
                            name: answer.name,
                            list: [],
                            id: 1
                        }]
                        fs.writeJSONAsync(this.path.playlist, playlist).then(() => {
                            this.init();
                        })
                    })
                };
            })
    }

}

module.exports = PP
