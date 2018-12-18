##安装

####window安装(请使用管理员权限打开命令行)
```
npm install -g honray-cli
```
####linux / mac 安装
```
sudo install -g honray-cli
```

##使用
#### 初始化项目
```
honray init <name> [template]
```
#### 初始化项目示例
```
/* 初始化项目 (假如初始化项目到 project 目录, 
   使用模板 "web/example"[PS: 不输入模板名称默认 web/init]) */
honray init project
/* 接下来你会看到让你输入第三方定制的 git 地址,如果有就输入,如果没有可以空白
   然后安装依赖 */
npm install
/* 运行项目 */
npm run dev
```
#### 可用模板列表
```
honray ls
```
#### 更新项目
```
/* 更新项目  (假如项目需要更新,可以运行此命令,此命令会保留第三方定制部分的代
   码,其余代码请手动备份,友情提示,为了保险起见先提交定制部分代码防止代码丢失哦.) */
honray update
```
#### 添加模板
```
honray add_template
/* 按照提示输入,模板信息,当模板已存在时可选是否替换模板 */
```
#### 删除模板
```
honray delete_template
/* 按照提示输入模板名称 */
```
