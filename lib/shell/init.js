const inquirer = require('inquirer');
const symbols = require('log-symbols');
const fse = require('fs-extra');
const fs = require('fs');
const ora = require('ora');
const chalk = require('chalk');
const path = require('path');
const Git = require("nodegit");

const { tips, checkTemplate, detailGitUrl } = require('./util');
const templates = require('../../templates.json').template;

// 默认模板名称
const initTemplate = 'web/init';

module.exports = (name, template = initTemplate) => {
  // 提示信息
  tips();
  // 检查模板
  if (!checkTemplate(template)) return;
  if (!name || !fs.existsSync(name)) {
    inquirer.prompt([
      {
        name: 'gitlab',
        message: '请输入定制项目地址(仅支持 http 不支持 SSH ,为空不拉取定制项目代码)'
      }
    ]).then((answers) => {
      let spinner = ora('正在下载模板...');
      spinner.start();
      // 模板信息
      const templateInfo = templates[template];
      // node-git 版本
      const gitInfo = detailGitUrl(templateInfo.git);
      const branch = gitInfo.branch ? { checkoutBranch: gitInfo.branch } : null;
      // 下载模板
      Git.Clone(gitInfo.url, path.resolve(process.cwd(), name), branch).then(() => {
        spinner.succeed();
        spinner.succeed(chalk.green('项目初始化完成'));
        if (answers.gitlab) {
          spinner = ora('正在下载定制项目...')
          spinner.start()
          const thirdPath = path.resolve(`./${name}`, templateInfo.thirdPath);
          fse.remove(thirdPath).then(() => {
            const thirdGitInfo = detailGitUrl(answers.gitlab);
            const thirdBranch = thirdGitInfo.branch ? { checkoutBranch: thirdGitInfo.branch } : null;
            Git.Clone(thirdGitInfo.url, path.resolve(thirdPath, '../../ThirdPart'), thirdBranch).then(() => {
              // 复制定制代码
              fse.copy(`${path.resolve(thirdPath, '../../ThirdPart')}`, path.resolve(thirdPath, '../'), { overwrite: true }).then(() => {
                spinner.succeed();
                spinner.succeed(chalk.green('拉取定制项目成功'));
                console.log(symbols.success, chalk.green(`提示: \n        1, 定制项目只需要提交 /src/component/ThirtPart 部分代码到项目对应的 gitlab 中. \n        2, 如果要更新项目请运行 superview update, 更新前记得提交定制部分的代码防止代码丢失哦.`))
              }).then(() => {
                // 删除备份文件
                fse.remove(`${path.resolve(thirdPath, '../../ThirdPart')}`)
              });
              // 保存版本信息
              const temp = { nowTemplate: template };
              fs.writeFileSync(path.resolve(`./${name}/honray-version.json`), JSON.stringify(temp), { flag: 'w+' })
            }).catch(err => {
              console.log(symbols.error, chalk.red(err));
              spinner.fail();
            })
          }).catch(err => {
            console.log(symbols.error, chalk.red(err));
            spinner.fail();
          })
        }
        // 是否保留根項目 git 信息
        if (!templateInfo.isSaveRootGit) {
          fse.remove(path.resolve(process.cwd(), name, '.git'))
        }
      }).catch(err => {
        console.log(symbols.error, chalk.red(err));
        spinner.fail();
      });
    });
  } else {
    console.log(symbols.error, chalk.red('项目已经存在!'));
  }
}
