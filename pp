#!/usr/bin/env node
var rp = require('request-promise');
var  Player = require('player');
var app = require('commander');
var inquirer = require('inquirer')

var searchList = [];



app
    .version('0.0.1')
    .option('-g, --get <name>', 'get songs')
    .option('-s, --search <name>', 'search songs', search)
    .parse(process.argv)



function search(string) {
    var option = {
        uri: "http://apis.baidu.com/geekery/music/query",
        headers: {apikey: '085d50117c493ec8a1b3d0926f8f493f'},
        qs: {s: string, limit: '5'}
    }
    rp(option).then(function(rep) {
        searchList = JSON.parse(rep).data.data.list;
        var list = [];
        searchList.forEach((item, index) => {
            var obj = {};
            obj.name = item.songName;
            obj.value = {
                index: index,
                url : item.songUrl
            };
            list.push(obj);
        })
        return list;
    }).then(function(list) {
        console.log(list)
        var question = [
            {
                type: "list",
                name: 'songs',
                message: "搜索结果",
                choices: list,
            }
        ]
        inquirer.prompt(question, answer =>{
            operate(answer.songs);
        })
    })
}

function operate(choice) {
        var choices = [
            {name: '添加到播放列表', value: 'add'},
            {name: '播放', value: 'play'},
            {name: '下载', value: 'download'}
        ]

        var question = [
            {
                type: "list",
                name: 'option',
                message: "操作",
                choices: choices,
            }
        ]
        inquirer.prompt(question, answer =>{
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






