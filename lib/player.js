'use strict'
var home = require('home');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs-extra'));
var config = require('./config.js')
var util = require('./util.js');
var inquirer = require('inquirer')


 class PP {
    constructor() {
        this.HOMEPATH = home();
        this.path = {};
        this.path.profile = home.resolve('~/music-cli/profile.json');
        this.profile = fs.readJSONAsync(this.path.profile).catch(err => {
          if (util.noSuchFile(err)) {
                fs.writeJSON(this.path.profile, config);
                fs.mkdirs(this.HOMEPATH + config.default.downLoadDir);
            };
        });
    }

    init() {
        //console.log(this.HOMEPATH);
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
}

module.exports = PP