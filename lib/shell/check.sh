#!/usr/bin/env bash

if["$(uname)"=="Darwin"];then
    echo('mac 操作系统')
    # Mac OS X 操作系统

elif["$(expr substr $(uname -s) 1 5)"=="Linux"];then
    echo('linux 操作系统')
    # GNU/Linux操作系统

elif["$(expr substr $(uname -s) 1 10)"=="MINGW32_NT"];then
    echo('window 操作系统')
    # Windows NT操作系统

fi