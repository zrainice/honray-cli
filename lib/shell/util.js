const chalk = require('chalk');
const symbols = require('log-symbols');
const templates = require('../../templates.json').template;

// 创建字符串
function createStr(num) {
  let str = '';
  for (let i = num; i > 0; i --) {
    str += ' ';
  }
  return str;
}
// 提示信息
function tips() {
  console.log('\n');
  console.log(symbols.info, chalk.yellow('如出现错误建议使用管理员权限运行该命令\n'));
  console.log(symbols.info, chalk.yellow('linux / mac 用户在命令前加上 sudo 标记管理员权限运行\n'));
  console.log(symbols.info, chalk.yellow('windows 用户打开命令行或者 powershell 的时候用管理员权限打开\n'))
}
// 检查模板
function checkTemplate(template) {
  template = template || 'web/init';
  if (!templates[template] || !templates[template].git) {
    console.log(symbols.error, chalk.red('当前模板模板不存在,请确认之后重新执行命令.'))
    return false;
  }
  return true;
}
// 处理 git 的url,分离地址与分支
function detailGitUrl(url) {
  if (url && url.includes('#')) {
    const temp = url.split('#');
    return {
      url: temp[0],
      branch: temp[1]
    }
  } else {
    return {
      url
    }
  }
}
// 过滤空数据

module.exports = { createStr, tips, checkTemplate, detailGitUrl }
