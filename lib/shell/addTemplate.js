const fs = require('fs');
const inquirer = require('inquirer');
const chalk = require('chalk');
const symbols = require('log-symbols');
const path = require('path');

const { tips } = require('../shell/util');

module.exports = () => {
  const admin = {
    name: 'admin',
    pass: 'honray2018'
  }
  tips();
  inquirer.prompt([
    {
      name: 'name',
      message: '请输入管理员账号'
    },
    {
      name: 'pass',
      type: 'password',
      message: '请输入管理员密码'
    }
  ]).then((ans) => {
    if (ans.name === admin.name && ans.pass === admin.pass) {
      inquirer.prompt([
        {
          name: 'templateName',
          message: '请输入模板名称',
          filter: function (str) {
            return str.replace(/[^a-zA-Z\/\_]/g, '')
          }
        },
        {
          name: 'templateGit',
          message: '请输入模板的git地址(PS: 仅支持 http 不支持 SSH)'
        },
        {
          name: 'isSaveRootGit',
          type: 'confirm',
          message: '是否保留模板 git 信息(默认 不保留)?'
        },
        {
          name: 'thirdPath',
          message: '请输入定制代码位置(默认 ./src/components/ThirdPart )'
        },
        {
          name: 'templateDesc',
          message: '请输入模板描述'
        }
      ]).then((answer) => {
        if (!answer.templateName || !answer.templateGit) {
          console.log(symbols.error, chalk.red('模板名称与git地址为必填项,请输入完整'));
        } else {
          let temp = require('../../templates.json');
          if (temp.template[answer.templateName]) {
            inquirer.prompt([
              {
                name: 'confirm',
                type: 'confirm',
                message: '当前模板已经存在,是否更新模板'
              }
            ]).then((answerIn) => {
              if (answerIn.confirm) {
                temp.template[answer.templateName] = {
                  title: answer.templateName,
                  git: answer.templateGit,
                  desc: answer.templateDesc,
                  thirdPath: answer.thirdPath,
                  isSaveRootGit: answer.isSaveRootGit
                }
                fs.writeFileSync(path.resolve(__dirname, '../../templates.json'), JSON.stringify(temp))
                console.log(symbols.success, chalk.green('修改模板成功'))
              }
            })
          } else {
            temp.template[answer.templateName] = {
              title: answer.templateName,
              git: answer.templateGit,
              desc: answer.templateDesc,
              thirdPath: answer.thirdPath,
              isSaveRootGit: answer.isSaveRootGit
            };
            fs.writeFileSync(path.resolve(__dirname, '../../templates.json'), JSON.stringify(temp))
            console.log(symbols.success, chalk.green('添加模板成功'))
          }
        }
      })
    } else {
      console.log(symbols.error, chalk.red('管理员账号或者密码错误,请重新运行该命令'));
    }
  });
}
