#!/usr/bin/env node

const program = require('commander');
const packageInfo = require('../../package.json');
const chalk = require('chalk');
const symbols = require('log-symbols');
const shellInfo = require('./config'); // 配置信息

program
    .version(packageInfo.version, '-v, --v, --version');

shellInfo.forEach(item => {
    let temp = program
    Object.entries(item).forEach(([key, value]) => {
        temp = temp[key](value)
    })
})

program.parse(process.argv);

if(!program.args || !program.args.length){
    program.help()
}
if (typeof program.args[program.args.length - 1] === 'string') {
    console.log(symbols.error, chalk.red(`未知命令:  ${program.args[program.args.length - 1]} !!!`))
    program.help()
}
