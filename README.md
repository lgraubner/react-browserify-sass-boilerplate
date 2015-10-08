# Base frontend template

This template is a starting point for the frontend part of your project. You can modify and extend this to your needs.

## Features

### Automated building with Gulp

For an easy workflow Gulp builds automatically right away while your are coding. This includes the following tasks:

- Converting SASS, combining CSS files, minifying styles
- Linting Javscript, combining Javscript files, converting ES6 features to ES5 and minifying it
- Optimizing images for the web
- Watching for file changes and refreshing your browser

The `gulpfile.babel.js` is using ES6 syntax.

#### Styles

#### Javascript

#### Images

#### Tests

#### Cache Busting

### Folder structure

You should only work in the `src` folder. All processed files will be placed into `dist`. Use this for production and upload it to your live environment, or directly link to it. The third folder `test` should contain any tests you are running to evaluate your Javascript code.

```
/src
|-- css
|   |-- scss
|   |   |-- components
|   |   |-- modules
|   |   `-- partials
|   `-- vendor
|-- img
`-- js
    `--vendor
```

The `src` folder contains an `css`, `img` and `js` folder. If you are using SASS place it in the `scss` folder. Gulp will search for a `main.scss` file to process it, so make sure you include all your SASS components inside it. Put CSS files in the `css` folder or organize it in subfolders. Third party files should be placed inside the vendor folder.

Place all of your images inside the `img` folder. Gulp will process this files and optimize them.

All of your Javscript files should be in the `js` folder or subfolders. Third party libraries belong inside the `vendor` folder.

Any other folders and files inside the `src` folder will be copied to the `dist` folder without any changes.

## Get started

To get started install the dependencies.

```BASH
$ npm install
```

Start gulp and it will watch for changes and builds right away. Your browser will be refreshed automatically by Browsersync.

```BASH
$ gulp serve
```

## Advanced usage of Gulp tasks

You can also use Gulp tasks directly if you don't want to let Gulp watch your changes or avoid automatically refreshing your browser.

**test**

*This task will not run automatically as it can slow down your working machine and disturb your workflow.*

**watch**

**serve**
