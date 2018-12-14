#!/usr/bin/env node

const child_process = require('child_process');
const path = require('path');
const chalk = require('chalk');

child_process.execFile(path.resolve('./check.sh'), function() {
    console.log('运行完了...')
})
