'use strict'
var home = require('home');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs-extra'));
var config = require('./config.js')
var util = require('./util.js');
var inquirer = require('inquirer')
var menu = require('./menu.js').menu;
var rp = require('request-promise');
var Player = require('player');
var exec = require('child_process').exec;


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

        var choices = [{
            name: '播放列表',
            value: 'p'
        }, {
            name: '切换歌单',
            value: 'c'
        }, {
            name: '搜索歌曲',
            value: 's'
        }, {
            name: '新建歌单',
            value: 'n'
        }];
       var question = [{
            type: "list",
            name: 'option',
            message: "菜单",
            choices: choices,
        }]
        inquirer.prompt(question, answer => {
            switch (answer.option) {
                case 's' :
                    var question = [{
                        type: "input",
                        name: 'name',
                        message: "搜索歌曲"
                    }];
                    inquirer.prompt(question, answer => {
                        this.search(answer.name);
                    })
            }
        })

    }

    getPlayList() {
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


    search(string) {
        var option = {
            uri: "http://apis.baidu.com/geekery/music/query",
            headers: {
                apikey: '085d50117c493ec8a1b3d0926f8f493f'
            },
            qs: {
                s: string,
                limit: '5'
            }
        }
        rp(option).then(rep => {
            var searchList = JSON.parse(rep).data.data.list;
            var list = [];
            searchList.forEach((item, index) => {
                var obj = {};
                obj.name = item.songName;
                obj.value = {
                    index: index,
                    url: item.songUrl
                };
                list.push(obj);
            })
            return list;
        }).then(list => {
            var question = [{
                type: "list",
                name: 'songs',
                message: "搜索结果",
                choices: list,
            }]
            inquirer.prompt(question, answer => {
                operate(answer.songs);
            })
        })

        function operate(choice) {
            var choices = [{
                name: '添加到播放列表',
                value: 'add'
            }, {
                name: '播放',
                value: 'play'
            }, {
                name: '下载',
                value: 'download'
            }]
            var question = menu.operate;
            question[0].choices = choices;
            inquirer.prompt(question, answer => {
                if (answer.option === 'play') {
                    play(choice);
                };
            })
        }

        function play(obj) {
            console.log(obj);
            var player = new Player(obj.url);
            player.play();
        }
    }
}

module.exports = PP
