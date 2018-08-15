Have you ever experienced switch windows to manage your posts between `_drafts` and `_posts`? Have you complaint about `publish` function in `hexo`? If so, just try this plugin called **hexo-undraft**, it brings you enhanced publish experience.

It basically does `mv` command like in the Terminal, but will prompt up and let you choose which one to mv. It will find your posts you want to publish first, then let you select the post you really want to publish and lastly move the post to your customized folder. That easy! Vice versa too.

# Installation

`npm install --save hexo-undraft`

# undraft(like publish but more powerful)

**in posts you write, add a setting called "dest" on the top. If you omit this setting, the plugin will use `<hexo_folder>/source/_posts` as the default path.**

example:

> ---
> title: example is here
> tags:
> dest: \_posts/foo/bar
> ---

`hexo undraft [title] [-t | --to FOLDER] [-a | --all]`

* title: input full or partial title to let it find posts that you want to publish
* -t | --to FOLDER: if you give "dest" setting in the post, it will have higher priority, so that the plugin will omit what you input. Otherwise, the post will be published to designated path.
* -a | --all: if you use this flag, it will publish all posts that the plugin finds(in this case you have to give `title`). If you omit the `title`, it will publish **all** posts after getting your confirmation.

# endraft(a better way to draft posts)

**in posts you have already published, add a setting called "origin" on the top. If you omit this setting, the plugin will use `<hexo_folder>/source/_drafts` as the default path.**

example:

> ---
> title: example is here
> tags:
> origin: \_drafts/foo/bar
> ---

`hexo endraft [title] [-t | --to FOLDER] [-a | --all]`

* title: input full or partial title to let it find posts that you want to draft
* -t | --to FOLDER: if you give "origin" setting in the post, it will have higher priority, so that the plugin will omit what you input. Otherwise, the post will be drafted to designated path.
* -a | --all: if you use this flag, it will draft all posts that the plugin finds(in this case you have to give `title`). If you omit the `title`, it will draft **all** posts after getting your confirmation.

# a few words

* when posts number is really large, the process time will be long because the plugin has to load all posts in order to filter.
* if the path you give either in post settings or terminal input is not existed, the plugin will create for you.
* if using `-t` flag without a given path, the plugin will not run; similarly, if using `-a` flag and giving additional parameter, the plugin will not run too.

# inspired by

[hexo-cli-extras](https://github.com/greg-js/hexo-cli-extras)