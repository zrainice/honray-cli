const fs = require('fs');
const inquirer = require('inquirer');
const chalk = require('chalk');
const symbols = require('log-symbols');
const path = require('path');

const { tips } = require('../shell/util');

module.exports = () => {
  tips();
  inquirer.prompt([
    {
      name: 'templateName',
      message: '请输入模板名称',
      filter: function (str) {
        return str.replace(/[^a-zA-Z\/\_]/g, '')
      }
    }
  ]).then((answer) => {
    if (!answer.templateName) {
      console.log(symbols.error, chalk.red('请输入要删除的模板'));
    } else {
      let temp = require('../../templates.json');
      if (temp.template[answer.templateName]) {
        inquirer.prompt([
          {
            name: 'confirm',
            type: 'confirm',
            message: '确认删除模板嘛,该操作不可恢复请谨慎操作!'
          }
        ]).then((answerIn) => {
          if (answerIn.confirm) {
            delete temp.template[answer.templateName]
            fs.writeFileSync(path.resolve(__dirname, '../../templates.json'), JSON.stringify(temp))
            console.log(symbols.success, chalk.green('删除模板成功'))
          }
        })
      } else {
        console.log(symbols.info, chalk.yellow('要删除的模板不存在'))
      }
    }
  })
}
