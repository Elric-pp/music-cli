'use strict'
var Canvas = require('term-canvas');
var canvas = new Canvas(100, 200);
var ctx = canvas.getContext('2d');
var rp = require('request-promise');
var Player = require('player');
var Promise = require('bluebird');
var inquirer = Promise.promisifyAll(require('inquirer'));

class Menu {
    constructor() {
        this.addPlayList = [{
            type: "input",
            name: 'name',
            message: "请先创建一个播放列表"
        }]
        this.answer = "wo";
    }


    homeMenu() {
        ctx.clear();
        ctx.translate(1, 1);
        ctx.fillText('>', 0, 0);
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
       return  inquirer.promptAsync(question)
    }

    search() {
        var question = [{
            type: "input",
            name: 'name',
            message: "搜索歌曲"
        }];
        return inquirer.promptAsync(question);
    }

    getSong (answer) {
                ctx.clear();
                var option = {
                    uri: "http://apis.baidu.com/geekery/music/query",
                    headers: {
                        apikey: '085d50117c493ec8a1b3d0926f8f493f'
                    },
                    qs: {
                        s: answer.name,
                        limit: '5'
                    }
                }
              return  rp(option).then(rep => {
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
                        ctx.clear();
                        this.operate(answer.songs);
                    })
                })
    }

    operate(choice) {
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
        var question = [{
            type: "list",
            name: 'option',
            message: "操作",
            choices: [],
        }];
        question[0].choices = choices;
        inquirer.promptAsync(question, answer => {
            ctx.clear();
            if (answer.option === 'play') {
                this.play(choice);
            };
        })
    }

    play(obj) {
        var player = new Player(obj.url);
        player.play();
        this.homeMenu()
    }

}


module.exports = Menu;
