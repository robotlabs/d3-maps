_help:
	@echo "platform help"
	@echo ""
	@echo "The following commands are available:"
	@echo ""
	@echo "\t make setup - install required node packages"
	@echo "\t make devhot - start watch with hot reload"
	@echo "\t make dev - start watch, no hot reload"
	@echo "\t make prod - start watch with minify"
	@echo "\t make build-dev - build files, no minify"
	@echo "\t make build-prod - build files & minify"
	@echo "\t make build-release - build files & minify++"
	@echo ""

defaut: help

## VARS
# SERVER_PROXY := http://localhost:8000

#js
output-dir-js := ./../output/js/
src-js := ./src/apps/*

#css
output-dir-css := ./../output/css/
src-css-vendor := src/style/css-vendors/*.css
src-pure-css := src/style/pure-css/*.css

#img
src-img-orig := ./src/assets/images/orig-img/*
output-dir-img-opt := ./src/assets/images/opt-img/
output-dir-img := ./../output/imgs/

#fonts
src-fonts := ./src/assets/fonts/*
output-dir-fonts := ./../output/fonts/

# ie libs (e.g. promise)
src-ie-libs := ./src/script-loader/ie/*

#node vars
node_cleancss := node_modules/clean-css-cli/bin/cleancss
eslint := node_modules/eslint/bin/eslint.js
webpack := node_modules/webpack/bin/webpack.js
imagemin := node_modules/imagemin-cli/cli.js

setup:
	npm install

#**********************************************
# ::Watches
#**********************************************

# dev mode, with hot reload for react component
devhot:
	$(MAKE) _prepare-build
	$(MAKE) lint-js
	# launch watch on pure css
	$(MAKE) _global-pure-css &
	#**********************************************
	# ::Webpack watch DEVHOT.
	#**********************************************

	# => empty style.css (avoid 404 on devhot)
	> $(output-dir-css)style.css

	# grep command is just to reduce verbosity. more details in pack/server-devhot
	node pack/server-devhot.js $(SERVER_PROXY)| grep -v \"\\[\\d*\\]\"

dev:
	$(MAKE) _prepare-build
	$(MAKE) lint-js
	# launch watch on pure css
	$(MAKE) _global-pure-css &
	# python -m SimpleHTTPServer
	#**********************************************
	# ::webpack watch DEV.
	#**********************************************
	$(webpack) --config pack/webpack.config.dev.js --env.serverproxy=$(SERVER_PROXY) --watch  --hide-modules true


prod:
	$(MAKE) _prepare-build
	# launch watch on pure css
	_global-pure-css &
	#**********************************************
	# ::webpack watch PROD.
	#**********************************************
	$(webpack) --config pack/webpack.config.vendor.js --progress
	$(webpack) --config pack/webpack.config.prod.js --env.serverproxy=$(SERVER_PROXY) --watch  --progress

#**********************************************
# ::Builds
#**********************************************
build-dev:
	$(MAKE) _prepare-build
	$(MAKE) lint-js

	#**********************************************
	# ::Webpack dev build
	#**********************************************
	$(webpack) --config pack/webpack.config.dev.js --progress

build-prod:
	@$(MAKE) _prepare-build

	@#**********************************************
	@# ::Webpack prod build
	@#**********************************************
	@$(webpack) --config pack/webpack.config.vendor.js --progress --hide-modules true
	@$(webpack) --config pack/webpack.config.prod.js --progress --hide-modules true

build-release:
	@$(MAKE) _prepare-build

	@#**********************************************
	@# ::Webpack release build
	@#**********************************************
	@$(webpack) --config pack/webpack.config.vendor.js --progress --hide-modules true
	@$(webpack) --config pack/webpack.config.release.js --progress --hide-modules true


# UTILS
watch-pure-css:
	npm run pure-css-watch

# Lint
lint-js:
	@#**********************************************
	@# :: Lint
	@#**********************************************
	$(eslint) $(src-js) || exit 0

# Image Opt
image-opt:
	#**********************************************
	# ::Image optimization..
	#**********************************************
	$(imagemin) $(src-img-orig) --out-dir $(output-dir-img-opt)

copy-css:
	@# => css
	@cp $(src-pure-css)* $(output-dir-css)

_prepare-build:
	@$(MAKE) _clean-dirs
	@$(MAKE) _copy-files
	@$(MAKE) _css-vendors

_global-pure-css:
	@nodemon -e css -w src/style/pure-css/app-globals.css -x $(MAKE) copy-css

_clean-dirs:
	@#**********************************************
	@# ::Clean dirs
	@#**********************************************
	@$(MAKE) _clean-dir-js
	@$(MAKE) _clean-dir-css
	@$(MAKE) _clean-dir-fonts
	@$(MAKE) _clean-dir-images

_copy-files:
	@#**********************************************
	@# ::Copy files
	@#**********************************************
	@# => images
	@test -d "$(output-dir-img)" || mkdir -p "$(output-dir-img)" && cp $(output-dir-img-opt)* $(output-dir-img)

	@$(MAKE) copy-css

	@# => fonts
	@cp -a $(src-fonts) $(output-dir-fonts)
	@# cp -a ./src/assets/fonts/* ./../backend/assets/fonts/

	@# => ie libs
	@cp -a $(src-ie-libs) $(output-dir-js)


_concat-css-vendors:


_clean-dir-js:
	@- rm -r $(output-dir-js)
	@mkdir -p $(output-dir-js)

_clean-dir-css:
	@- rm -r $(output-dir-css)
	@mkdir -p $(output-dir-css)

_clean-dir-fonts:
	@- rm -r $(output-dir-fonts)
	@mkdir -p $(output-dir-fonts)
	
_clean-dir-images:
	@- rm -r $(output-dir-img)
	@mkdir -p $(output-dir-img)

_css-vendors:
	@# => concat all css vendors in css-vendors
	@$(node_cleancss) -O0 -o $(output-dir-css)vendor.css $(src-css-vendor)

_hard-mac-server-clean:
	sudo lsof -t -i tcp:8000 | xargs kill -9
	sudo lsof -t -i tcp:3000 | xargs kill -9
