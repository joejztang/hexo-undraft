'use strict';

hexo.extend.console.register('undraft', 'enhanced publish function', {
  desc: 'publish post from _drafts folder to destination that given in posts, or _posts if destination is not given',
  usage: '[title] [-t | --to FOLDER] [-a | --all]',
  arguments: [
    {name: 'title', desc: '(Part of) the title of a post. If more posts match this regex, a menu will be called.'}
  ],
  options: [
    {name: '-t, --to', desc: 'relative folder path to _post'},
    {name: '-a, --all', desc: 'undraft all posts in _drafts'}
  ]
}, require('./lib/undraft'));

hexo.extend.console.register('endraft', 'enhanced publish function', {
  desc: 'draft post from _posts folder to origin that given in posts, or _drafts if origin is not given',
  usage: '[title] [-f | --from FOLDER] [-a | --all]',
  arguments: [
    {name: 'title', desc: '(Part of) the title of a post. If more posts match this regex, a menu will be called.'}
  ],
  options: [
    {name: '-f, --from', desc: 'relative folder path to _drafts'},
    {name: '-a, --all', desc: 'draft all posts in _posts, yes/no question will prompt up.'}
  ]
}, require('./lib/endraft'));