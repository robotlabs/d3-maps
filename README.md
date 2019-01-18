# Platform Frontend ESSENTIALS

## SETUP

if running the script for the first time

```shell
npm install -g webpack
make setup
```

then run one of the following:

### DEVELOPMENT and WATCH

- react, hot loader: `make devhot`
- dev, with standard bundling: `make dev`
- just build dev: `make build-dev` (check out the results on backend server)

### PRODUCTION

- debug production: `make prod`
- just build prod: `make build-prod` (check out the results on backend server)
- just build release `make build-release` (check out the results on backend server)

## GLOBAL CSS.
global css, that are loaded in site_base, and work across the entire website, share
css globally. to activate a watch use:
`make watch-pure-css`
in a different terminal window. and refresh any page that import site_base.html template
(used for header, body settings, generic buttons, main typography)

The CSS is imported in site_base.html, so it will affect home, cross-page header, and whatever you
want to write globally. (as we are using css modules, the notation for global css is quite annoying, so this is a simple shortcut)

### LINT
install a eslint plugin on your editor and point to .eslintrc, on the root of the project.
You can run your lint using make,
`make lint-js`
this is called everytime you start a dev build (dev and devhot)

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

### css

we use css modules, with postcss (autoprefixer), using webpack loader.
In devhot mode, the styles are imported runtime, while in production (or dev) we
create one css bundle, with unique instance name, to avoid conflicts when merging all css scope modules.

this seems to be a good tutorial, if you not familiar with the process: http://andrewhfarmer.com/css-modules-by-example/

To define a global style (i.e. not related to a component) the syntax is:

`:global(.nameclass){}`

inside these objects you cannot use `composes`, but you can use @value, to use same settings. Global settings, breakpoints, etc. are in `src/apps/app-x/styles-globals/helpers`

Parameters are defined `in helpers/_params` as follows:

```css
@value subtle-shadow: 2px 2px 3px #333333;
```

then create a class:

```css
.c-subtle-shadow {
  box-shadow: subtle-shadow;
}
```

in helpers/effects.css

So `@value` can be used in globals (as the composes won't work) and everywhere in the css modules can be composes directly with `c-subtle-shadow` (or use `@value` all the times) and use `c-` prefix, to indicate a css param that can be composed
