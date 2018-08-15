'use strict';

var Promise = require('bluebird');
var chalk = require('chalk');
var fs = require('fs');
var path = require('path');
var inquirer = require('inquirer');
var fsRename = Promise.promisify(require('fs').rename);
var mkdirp = require('mkdirp');

module.exports = function(args) {

  var input = {
    title: args._ || '',
    from : args.f || args.from || null,
    all  : args.a || args.all  || null, // true or false
  };

  var source_dir = this.source_dir;

  // conner case
  if (typeof(input.from) === 'boolean') {
    console.log(chalk.red('Error: '), 'wrong usage of "-f|--from" flag. go to "hexo help" for usage.');
    return;
  }

  var originDir = input.from===null? path.join(source_dir, '_drafts'): path.join(source_dir, input.from);

  this.load()
    .then(function findPosts() {

      if (typeof(input.all) === 'string') {
        return new Promise(function(resolve, reject) {
          return reject('wrong usage of "-a|--all" flag. go to "hexo help" for usage.');
        });
      }

      if (input.title.length !== 0) {
        var regexTitle = input.title.map(function(content) {
          return new RegExp(content, 'i');
        });

        var allPosts = this.locals.get('posts');

        return allPosts.filter(function(post) {
          return regexTitle.every(function(regex) {
            return (regex.test(post.tilte)||regex.test(post.slug))&&post.published;
          });
        });
      } else { // all flag is up
        return this.locals.get('posts').filter(function(post) {
          return post.published;
        });
      }
    }.bind(this))
    .then(function selectPost(posts) {
      var filename = '';
      var source = '';
      var dest = '';
      var passOn = [];

      return new Promise(function(resolve, reject) {
        if (posts.length === 0) {
          return reject('No matched post found!');
        } else if (posts.length === 1) {
          if (posts.data[0].source !== undefined) {
            source = path.join(source_dir, posts.data[0].source);
          }
          if (posts.data[0].dest !== undefined) {
            dest = path.join(source_dir, posts.data[0].origin);
          }
          filename = posts.data[0].source.split('/').pop();
          passOn.push([source, dest, filename]);
          return resolve(passOn);
        } else {
          if (input.all) {
            var pair = posts.map(function(post) {
              source = post.source!==undefined? path.join(source_dir, post.source): '';
              dest = post.origin!==undefined? path.join(source_dir, post.origin): '';
              filename = post.source.split('/').pop();
              passOn.push([source, dest, filename]);
            });
            return resolve(passOn);
          } else {
            var choices = posts.map(function(post) {
              var choice = ['[', chalk.yellow.bgBlack('draft'), '] ', post.title].join('');
              return choice;
            });
            inquirer.prompt([
              {
                type: 'list',
                name: 'post',
                message: 'Select the post you wish to draft.',
                choices: choices,
              },
            ], function getAnswer(answer) {
              var pos  = choices.indexOf(answer.post);
              if (posts.data[pos].source !== undefined) {
                source = path.join(source_dir, posts.data[pos].source);
              }
              if (posts.data[pos].origin !== undefined) {
                dest = path.join(source_dir, posts.data[pos].origin);
              }
              filename = posts.data[pos].source.split('/').pop();
              passOn.push([source, dest, filename]);
              return resolve(passOn);
            });
          }
        }
      });
    })
    .then(function checkFolderOrCreate(passOn) {
      passOn.map(function(post) {
        if (post[1] === '') {
          post[1] = originDir;
        }
        try {
          mkdirp.sync(post[1]);
        } catch(e) {
          console.log(chalk.red('Error: '), 'cannot mkdir for given path');
        }
      });
      return passOn;
    })
    .then(function move(passOn) {
      if (input.title.length===0&&input.all===true) {
        inquirer.prompt([
          {
            type: 'confirm',
            name: 'confirm',
            message: 'Are you sure you want to draft all posts in _posts?\n  Make sure you have checked each individual post having "origin" parameter',
          },
        ], function getAnswer(answer) {
          if (!answer.confirm) {
            console.log('check posts and come back later.');
            return;
          } else {
            passOn.map(function(post) {
              var old_path = post[0];
              var new_path = path.join(post[1], post[2]);
              return fsRename(old_path, new_path).then(function() {
                console.log(old_path+chalk.green(' moved to ')+new_path);
              }).catch(function(err) {
                console.log(old_path+ chalk.red(' could not be moved to ')+new_path+'. the reason is: '+chalk.red(err));
              });
            });
          }
        });
      } else {
        passOn.map(function(post) {
          var old_path = post[0];
          var new_path = path.join(post[1], post[2]);
          return fsRename(old_path, new_path).then(function() {
            console.log(old_path+chalk.green(' moved to ')+new_path);
          }).catch(function(err) {
            console.log(old_path+ chalk.red(' could not be moved to ')+new_path+'. the reason is: '+chalk.red(err));
          });
        });
      }
    })
    .catch(function catchAll(err) {
      console.log(chalk.red('Error: '), err);
    });
};