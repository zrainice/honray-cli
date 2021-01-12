#!/usr/bin/env node

const program = require('commander');
const packageInfo = require('../../package.json');
const shellInfo = require('./config'); // 配置信息

program
    .version(packageInfo.version, '-v, --v, --version');

shellInfo.forEach(item => {
    let temp = program;
    Object.entries(item).forEach(([key, value]) => {
        temp = temp[key](value)
    })
});

program.parse(process.argv);

if(!program.args || !program.args.length){
    program.help()
}
