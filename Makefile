autod: install
        @./node_modules/.bin/autod -w -e public,view,docs,backup
        @$(MAKE) install
