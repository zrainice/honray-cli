const templates = require('../../templates.json').template;
const fs = require('fs');
const fse = require('fs-extra');
const Git = require("nodegit");
const inquirer = require('inquirer');
const ora = require('ora');
const chalk = require('chalk');
const symbols = require('log-symbols');
const adm_zip = require('adm-zip');
const path = require('path');

const { tips, detailGitUrl } = require('./util');

module.exports = () => {
  tips();
  // 校验更新路径
  if (!fs.existsSync(path.resolve('./package.json'))) {
    console.log(symbols.error, chalk.red('请在项目目录运行此命令(tips: package.json文件丢失!)'));
    return;
  }

  let nowTemplate = fs.existsSync(path.resolve('./honray-version.json')) ? require(path.resolve('./honray-version.json')) : {};
  if (!nowTemplate.nowTemplate || !templates[nowTemplate.nowTemplate]) {
    console.log(symbols.error, chalk.red('当前目录不是项目目录或者模板信息丢失!'))
    inquirer.prompt([
      {
        name: 'confirm',
        type: 'confirm',
        message: '是否手动输入模板名称?'
      },
      {
        name: 'template',
        when: (ans) => ans.confirm,
        message: '请输入当前项目使用的模板名称,默认 web/init '
      }
    ]).then((answers) => {
      if (answers.confirm) {
        nowTemplate = answers.template || 'web/init';
        if (!templates[nowTemplate]) {
          console.log(symbols.error, chalk.red('输入的模板不存在,请检查后重试!'))
        } else {
          update_project(nowTemplate);
        }
      }
    });
  } else {
    nowTemplate = nowTemplate.nowTemplate;
    update_project(nowTemplate);
  }
  function update_project(name) {
    const templateInfo = templates[name];
    const pathName = templateInfo.thirdPath;
    const gitPath = templateInfo.git
    let spinner = ora('正在备份定制代码...');
    spinner.start();
    const zip = new adm_zip();
    let gitZip = '';
    let tempVersion = '';
    // 保存定制代码 替换路径   './src/components/ThirdPart'
    zip.addLocalFolder(path.resolve(pathName));
    // 保存定制代码git信息 替换路径 './src/components/.git'
    if (fs.existsSync(path.resolve(pathName, '../.git'))) {
      gitZip = new adm_zip();
      gitZip.addLocalFolder(path.resolve(pathName, '../.git'));
    }
    // 保存模板信息
    if (fs.existsSync(path.resolve('./honray-version.json'))) {
      tempVersion = new adm_zip();
      tempVersion.addLocalFile(path.resolve('./honray-version.json'));
    }
    spinner.succeed();
    spinner.succeed(chalk.green('备份定制代码成功'));
    spinner = ora('正在更新模板...');
    spinner.start();
    fse.emptyDir(`${path.resolve(process.cwd())}`).then(() => {
      console.log(gitPath, path.resolve('./'), '路径信息')
      const thirdGitInfo = detailGitUrl(gitPath);
      const thirdBranch = thirdGitInfo.branch ? { checkoutBranch: thirdGitInfo.branch } : null;
        Git.Clone(thirdGitInfo.url, path.resolve('./'), thirdBranch).then(() => {
          fse.remove(path.resolve(pathName)).then(() => {
            zip.extractAllTo(path.resolve(pathName));
            if (gitZip) {
              gitZip.extractAllTo(path.resolve(pathName, '../.git'))
            }
            if (tempVersion) {
              tempVersion.extractAllTo(path.resolve('./'))
            }
            spinner.succeed()
            spinner.succeed(chalk.green('模板更新完成'));
          });
          // 是否清除git信息
          if (!templateInfo.isSaveRootGit) {
            fse.remove(path.resolve(process.cwd(), '.git'))
          }
        }).catch((err) => {
          spinner.fail()
          console.log(symbols.error, chalk.red(err));
        });
    })
  }
}
