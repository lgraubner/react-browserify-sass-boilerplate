# Base React, Browserify, SASS project

[![David](https://img.shields.io/david/lgraubner/react-browserify-sass-boilerplate.svg)](https://david-dm.org/lgraubner/react-browserify-sass-boilerplate) [![David Dev](https://img.shields.io/david/dev/lgraubner/react-browserify-sass-boilerplate.svg)](https://david-dm.org/lgraubner/react-browserify-sass-boilerplate#info=devDependencies)

This template is a starting point for the frontend part of your project using React and SASS. You can modify and extend this to your needs.

## Features

The following features will help you to have a great workflow and develop easy and fast.

### Automated building with Gulp

For an easy workflow [Gulp](http://gulpjs.com/) builds automatically right away while your are coding. This includes the following tasks:

- Converting SASS, combining CSS files, minifying styles
- Linting Javscript, combining Javscript files, converting ES2015 features to ES5 and minifying it
- Watching for file changes and refreshing your browser

#### Styles

For this package [SASS](http://sass-lang.com/) is used as CSS preprocessor. Gulp will process your sass files and combine them with other regular CSS files. Autoprefixer takes care of browser specific vendor prefixes, so you don't have to worry about it. All your CSS gets minified to reduce the file size.

#### Javascript

This setup is ES2015 ready! You can write ES2015 code and [Babel](http://babeljs.io/) will compile it to ES5. You can benefit from new features and don't have to worry about browser support. Every change you make on your code will be linted to reveal possible problems. As last step all your Javascript files will be combined and minified to reduce file size and HTTP requests using Browserify.

### Folder structure

You should only work in the `src` folder. All processed files will be placed into `build`. Use this for production and upload it to your live environment, or directly link to it.

```
/src
|-- scss
    |-- components
    |-- ...
    `-- main.scss
`-- js
    |-- components
    `-- main.jsx
```

The `src` folder contains an `scss` and `js` folder. Gulp will search for a `main.scss` as entry point to process, so make sure you include all your SASS components inside it.

All of your Javscript files should be in the `js` folder or subfolders. Get third party plugins via npm and include them right away. `main.jsx` is used as entry point for `browserify`.

## Get started

To get started install the dependencies.

```BASH
$ npm install
```

Start gulp and it will watch for changes and builds right away. Your browser will be refreshed automatically by Browsersync.

```BASH
$ npm run serve
```

To get ready for production use the following command. Sourcemaps will be stripped from the build files.

```BASH
$ npm run build:prod
```

### Full list of commands

#### `npm run clean`

Removes the entire `build` folder.

#### `npm run serve`

Builds everything and starts a browsersync session, watching for your changes.

#### `npm run build`

Builds the project includind sourcemaps for debugging.

#### `npm run build:prod`

Builds the project, ready for production use.

#### `npm run watch`

Watches all file changes and executes the corresponding tasks.
