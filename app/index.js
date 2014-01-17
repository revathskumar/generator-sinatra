'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var shelljs = require('shelljs');
var spawn = require('child_process').spawn;


var SinatraGenerator = module.exports = function SinatraGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  // Exit if Ruby dependencies aren't installed
  var dependenciesInstalled = ['bundle', 'ruby'].every(function (depend) {
    return shelljs.which(depend);
  });

  if (!dependenciesInstalled) {
    console.log('Looks like you\'re missing some dependencies.' +
      '\nMake sure ' + 'Ruby'.white + ' and the ' + 'Bundler gem'.white + ' are installed, then run again.');
    shelljs.exit(1);
  }

  this.on('end', function () {
    if(!options['skip-install']){
      shelljs.exec('bundle install --path vendor/bundle');
    }

    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(SinatraGenerator, yeoman.generators.Base);

// SinatraGenerator.prototype.askFor = function askFor() {
//   var cb = this.async();

//   // have Yeoman greet the user
//   console.log(this.yeoman);

//   // replace it with a short and sweet description of your generator
//   console.log(chalk.magenta('You\'re using the fantastic Sinatra generator.'));

//   var prompts = [{
//     type: 'confirm',
//     name: 'someOption',
//     message: 'Would you like to enable this option?',
//     default: true
//   }];

//   this.prompt(prompts, function (props) {
//     this.someOption = props.someOption;

//     cb();
//   }.bind(this));
// };

SinatraGenerator.prototype.app = function app() {
  this.mkdir('templates');
  this.mkdir('spec');
  this.mkdir('lib');
  this.mkdir('log');
  this.mkdir('public');

  this.template('Gemfile', 'Gemfile');
  this.template('config.ru', 'config.ru');
  this.template('_package.json', 'package.json');
  this.copy('Procfile', 'Procfile');
  this.copy('ruby-version', '.ruby-version');
};

SinatraGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
};

SinatraGenerator.prototype.bower = function bower() {
  this.copy('_bower.json', 'bower.json');
  this.copy('bowerrc', '.bowerrc');
};

SinatraGenerator.prototype.git = function git() {
  this.copy('gitignore', '.gitignore');
};

SinatraGenerator.prototype.readme = function readme() {
  this.copy('License', 'License');
  this.copy('README.md', 'README.md');
};

SinatraGenerator.prototype.index = function index() {
  this.template('template.rb', 'lib/' + this.appname + '.rb');
  this.write('templates/index.erb', 'Hello World!!');
};
