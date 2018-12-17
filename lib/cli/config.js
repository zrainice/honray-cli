const chalk = require('chalk');
const templates = require('../../templates.json').template;
const { createStr } = require('../shell/util');

// 配置信息
module.exports = [
    {
        command: 'init <name> [template]',
        description: `初始化一个项目\n${createStr(26)}选项说明:\n${createStr(30)}<name>:${createStr(15)}项目名称,必填.\n${createStr(30)}[template]:${createStr(11)}模板名称,非必填,默认 web/init\n${createStr(26)}目前支持的模板:\n${createStr(30)}${Object.entries(templates).map(([key, item]) => `${key}:${createStr(20 - key.length)}${item.desc}`).join(`\n${createStr(30)}`)}\n`,
        alias: 'i',
        action: require('../shell/init')
    },
    {
        command: 'ls',
        description: '可用模板介绍',
        action: () => {
            Object.entries(templates).map(([key, item]) => {
                console.log(chalk.cyan(key), createStr(28 - key.length) , chalk.cyan(item.desc));
            })
        }
    },
    {
        command: 'update',
        description: '更新项目',
        action: require('../shell/update')
    },
    {
        command: 'add_template',
        description: '添加一个模板',
        alias: 'add',
        action: require('../shell/addTemplate')
    },
    {
        command: 'delete_template',
        description: '添加一个模板',
        alias: 'delete',
        action: require('../shell/deleteTemplate')
    }
]

