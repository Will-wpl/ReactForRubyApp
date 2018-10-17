# README

## Setup system environment

```
install git:
add-apt-repository ppa:git-core/ppa
apt update
apt install git

install nodejs:
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs

install rvm and ruby:
https://github.com/rvm/ubuntu_rvm

install bundle:
gem install bundle

# need postgresql for rails project
install pg dep:
sudo apt-get install libpq-dev

# need `yarn` for webpack
install yarn
npm install --global yarn

# need `chromedriver` for spec/feature_helper.rb
install chromedriver
sudo apt-get install chromium-chromedriver

```

## Setup

```
# install rails external libraries
bundle install -j4

# copy env files from env sample file then update it as you need
cp .env.sample .env.development
cp .env.sample .env.test

# install react of webpacker external library
bundle exec rails webpacker:install:react

# install webpack components
yarn install

# create database - if db not exsit
rake db:create

# migrate db oject to database - if db not exsit
rake db:migrate

# init db data - if db not exsit
rake db:seed
```

## Javascript

It is **highly** recommended that you installed [ESLint](http://eslint.org/) and [Prettier](https://github.com/prettier/prettier) in your own IDEs of choice (Atom, Sublime Text, WebStorm, RubyMine, VSCode, etc). Refer to the links below to install them.


Prettier: <https://github.com/prettier/prettier#editor-integration>

ESlint: <http://eslint.org/docs/user-guide/integrations>


`.eslintrc.json` is included for your eslint plugins to pick up the correct rules for linting.

For Prettier, no configuration is given and we are using the default options provided.


## Generate Scaffold

**Generating Scaffold for Public Resource**

`rails g rails_base_scaffold MODEL_NAME FIELD:TYPE [FIELD:TYPE..]`

**Generating Scaffold for Admin Resource**

`rails g rails_base_scaffold MODEL_NAME FIELD:TYPE [FIELD:TYPE..] --model-name=MODEL_NAME --admin=true`

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

If you want to debug by rubymine, can do:
- In terminal run : `./bin/webpack-dev-server --hot`
- In menu click : Run -> Debug -> Development:reverse-auction
- http://localhost:3000
- bundle exec sidekiq -t 25 -C config/sidekiq.yml



If you want to unit test, can do:
bundle exec rspec spec/controllers/admin/auctions_controller_spec.rb


## For CSI dev team
If out of memory when you run `./bin/webpack-dev-server --hot`, can do:
- `export NODE_OPTIONS=--max-old-space-size=4000`

If you want to install front end package, can do:
- yarn add package-name
