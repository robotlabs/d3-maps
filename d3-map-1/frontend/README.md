# Platform Frontend ESSENTIALS

## SETUP
if running the script for the first time

```shell
npm install -g webpack
make setup
```

then run one of the following:
### DEVELOPMENT and WATCH
- dev, with standard bundling: `make dev`
- just build dev: `make build-dev` (check out the results on backend server)

### backend
(make dev and make devhot open the local server, but if you need to separate, just commend ss in Makefile)
cd root/output (!important cd in output, otherwise devhot won't work)
python -m SimpleHTTPServer

### PRODUCTION
- debug production: `make prod`
- just build prod: `make build-prod` (check out the results on backend server)
- just build release `make build-release` (check out the results on backend server)

### IMAGES
to add a new image, copy your original source in src/assets/images/orig-img/
run
`make image-opt`
build as usual and you can access the image in `static/img/`

## Notes

### watch tasks

`watch-devhot` runs a node server with webpack-hot-middleware and webpack-dev-middleware.
This way we can use HMR (hot module replacement), to have inline changes for js and css.

`watch-dev` usez a classic bundle structure, but we loose css injection.

`watch-prod` and release just makes optimizations for production
