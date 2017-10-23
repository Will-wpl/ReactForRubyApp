# README

## Setup

```
# need `yarn` for webpack
# need `chromedriver` for spec/feature_helper.rb
brew install yarn chromedriver
bundle install  
  
# initialize the application to replace `railsbase` occurences to your project name
#   RailsBase               => MyProjectName
#   railsbase || rails_base => my_project_name
sh initscript.sh MyProjectName
  
# setup Database 
rake db:setup
  
# install webpack components
yarn install
```

## Javascript

It is **highly** recommended that you installed [ESLint](http://eslint.org/) and [Prettier](https://github.com/prettier/prettier) in your own IDEs of choice (Atom, Sublime Text, WebStorm, RubyMine, VSCode, etc). Refer to the links below to install them.


Prettier: <https://github.com/prettier/prettier#editor-integration>

ESlint: <http://eslint.org/docs/user-guide/integrations>


`.eslintrc.json` is included for your eslint plugins to pick up the correct rules for linting.

For Prettier, no configuration is given and we are using the default options provided.


## Generate Scaffold

**Generating Scaffold for Public Resource**

`rails g my_scaffold MODEL_NAME FIELD:TYPE [FIELD:TYPE..]`

**Generating Scaffold for Admin Resource**

`rails g my_scaffold MODEL_NAME FIELD:TYPE [FIELD:TYPE..] --model-name=MODEL_NAME --admin=true`

## WebPack

Webpack is used for javascript & css libraries, as well as our own components.
The webpack supports:

- hot refresh (but not hot reload yet)
- ES6
- management of JS & CSS libraries, via `yarn install [component-name]`

It doesn't include components like React by default; however, if you want, you
can follow the steps here: <https://github.com/rails/webpacker#integrations>

## Yarn/npm scripts (optional)

Yarn can be also used for running cli scripts for task runners like code formating and linting where Webpack fails to deliver.

You can find them in `package.json` under `scripts` in the root project directory.

`prettier-eslint-cli` is the package being used. It formats the code via `prettier` and passes the result to `eslint --fix`.

Two commands are created for your convenience:

Code formatting - `yarn run jsfmt`

Code linting - `yarn run jslint`

## Proxy Setting

Cases has been found that... webpack doesn't work well with our internal proxy.
In this case, please do the above settings:

- in your `.bash_profile`, update the `no_proxy`, by adding `127.0.0.1`
- in your system Network Preference, under `proxy` tab, add: `127.0.0.1, 0.0.0.0`

## Start Up

We need to startup both `rails`, and `webpack`. Therefore, two commands needed:

- `./bin/webpack-dev-server --hot`
- `./bin/rails s`

If you want to use one command, can do:

- `foreman start -f Procfile.dev`

If you wnat to debug by rubymine, can do:
- In terminal run : `./bin/webpack-dev-server --hot`
- In menu click : Run -> Debug -> Development:reverse-auction
- http://localhost:3000