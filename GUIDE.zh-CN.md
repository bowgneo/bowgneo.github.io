# 个人主页创建与发布指南

首次记录：2026 年 10 月 25 日；最近更新：2026 年 10 月 26 日。适用 GitHub 账号：**bowgneo**。

**当前状态：个人主页仅在本地准备完成，等待你审核。本次没有创建 GitHub 远端仓库，没有上传文件，也没有启用 Pages 或发布网站。** 文中的 GitHub 页面操作是审核通过后的执行教程，不是已经执行的记录。

预计仓库为 `bowgneo/bowgneo.github.io`，预计网址为 **https://bowgneo.github.io/**。此网址只有在完成发布后才用于验收，当前不能把它当作已经上线的成果。

## 1. 本次准备了什么

网站文件位于：

```text
/Users/gqbao/grant/01-learning/bowgneo.github.io/
```

| 文件 | 作用 | 发布时是否需要 |
| --- | --- | --- |
| `index.html` | 主页文字、导航、个人介绍和链接，也是网站入口。 | 需要 |
| `about.html` | 独立的关于页面。 | 需要 |
| `setup.html` | 浏览器里可阅读的建站记录与图形操作步骤。 | 需要 |
| `style.css` | 颜色、字体、阅读宽度和手机布局。 | 需要 |
| `favicon.svg` | 浏览器标签页中的小图标。 | 需要 |
| `.nojekyll` | 告诉 GitHub Pages 直接发布静态文件，跳过默认的 Jekyll 处理。 | 按本指南保留 |
| `GUIDE.zh-CN.md` | 本文，记录当前状态和完整操作过程。 | 可选，可以只保留在本地 |

这份主页使用本地 HTML、CSS 和 SVG 文件，以文章目录为首页，提供独立的关于页和建站记录页；不需要安装项目依赖或运行构建命令。

## 2. 先在本地审核

### 用 Finder 和浏览器打开

1. 打开 macOS **Finder（访达）**。
2. 按 **⌘⇧G**，或选择菜单 **前往 → 前往文件夹**。
3. 粘贴 `/Users/gqbao/grant/01-learning/bowgneo.github.io/`，按回车。
4. 双击 `index.html`。若没有用浏览器打开，右键文件，选择 **打开方式 → Safari 或 Google Chrome**。
5. 检查整页，再缩窄浏览器窗口，查看接近手机宽度的布局。点击“文章”“关于”和页脚“建站记录”，确认页面切换正常。

直接打开本地文件就能检查本版页面。文章目录目前如实留空，没有虚构文章。首页 GitHub 链接指向已经存在的个人账号。

### 审核项目

- 显示名 `Gavin`、账号 `bowgneo` 是否正确。
- 问候语、个人介绍、页面颜色和排版是否符合你的偏好。
- 手机宽度下文字是否完整，页面是否出现横向滚动。
- GitHub 链接是否指向你的账号，浏览器标签页名称和图标是否正确。

**你确认页面后，再执行第 3 至第 6 节。当前停在本地审核阶段。**

### 可选：通过本地网址预览

如果电脑已安装 Python 3，也可以在“终端”运行下面这一条命令。此操作只在本机提供预览，不会上传或发布网站。

```sh
python3 -m http.server 8847 --bind 127.0.0.1 --directory /Users/gqbao/grant/01-learning/bowgneo.github.io
```

浏览器打开 `http://127.0.0.1:8847/`。预览结束后，在该终端窗口按 **Control+C** 停止。首次发布和后续更新都可以使用下文的网页操作，不需要 Git 命令。

## 3. 审核通过后：在 GitHub 创建仓库

1. 在浏览器打开 [GitHub](https://github.com/)，登录 **bowgneo**。
2. 点击右上角 **＋ → New repository**；也可以直接进入 [新建仓库页面](https://github.com/new)。
3. 按下表填写。

| 页面字段 | 填写内容 |
| --- | --- |
| Owner | `bowgneo` |
| Repository name | `bowgneo.github.io` |
| Description | 可填写“我的个人主页”。 |
| Visibility | **Public** |
| Add README | 打开或勾选，便于直接进入有文件列表的仓库页面。 |
| Add .gitignore / Choose a license | 本次可保持默认。 |

4. 核对仓库全名为 `bowgneo/bowgneo.github.io`，点击 **Create repository**。
5. 在仓库 **Code** 页面确认分支下拉框显示 `main`。后文以 `main` 为发布分支；如果账号设置了其他默认分支，发布时必须选择实际存放网站文件的分支。

个人站点的仓库名必须为“用户名.github.io”。GitHub Free 可通过公开仓库使用 Pages，因此本次选择 Public。[官方说明：创建 GitHub Pages 网站](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)

## 4. 用网页上传文件

### 上传网页、样式和图标

1. 在仓库 **Code** 页面，确认当前分支为 `main`，并处于仓库最外层。
2. 点击文件列表上方 **Add file → Upload files**。
3. 点击 **choose your files**，进入本地 `/Users/gqbao/grant/01-learning/bowgneo.github.io/` 文件夹。
4. 按住 **⌘** 选中 `index.html`、`about.html`、`setup.html`、`style.css`、`favicon.svg`，点击打开；也可以从 Finder 将这五个文件拖到上传区域。
5. 确认上传列表里的文件名直接是上述五个名称，前面没有额外文件夹。不要把整个 `bowgneo.github.io` 文件夹套在仓库里面。
6. 在 **Commit changes** 区域填写提交说明，例如 `Add personal homepage`。
7. 选择 **Commit directly to the main branch**，再点击 **Commit changes**。如果页面先显示同名按钮，再在弹窗里填写说明并确认即可。
8. 返回文件列表，确认五个文件和 `README.md` 同级。

这里的“commit”是保存一次带记录的修改。本指南使用个人仓库直接提交到 `main` 的简单流程。[官方说明：上传文件](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)

### 创建 .nojekyll

以点开头的文件在 Finder 中通常隐藏，因此使用 GitHub 网页单独创建更容易核对。

1. 在仓库根目录点击 **Add file → Create new file**。
2. 在文件名输入框输入 **`.nojekyll`**，前面保留英文句点，后面不要增加扩展名。
3. 正文留空。若界面不允许提交空内容，在编辑区按一次回车，保留一行空白即可；本次只需要这个文件存在。
4. 点击 **Commit changes…**，填写 `Disable Jekyll processing`，选择直接提交到 `main`，再确认 **Commit changes**。
5. 返回根目录，确认 `index.html`、`about.html`、`setup.html`、`style.css`、`favicon.svg`、`.nojekyll` 位于同一层。

GitHub Pages 从分支发布时默认使用 Jekyll；发布源根目录中的 `.nojekyll` 用来跳过它。[官方说明：静态文件与 .nojekyll](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)；[官方说明：网页新建文件](https://docs.github.com/en/repositories/working-with-files/managing-files/creating-new-files)

## 5. 开启 GitHub Pages

1. 在仓库顶部点击 **Settings**。窗口较窄时，先展开顶部的更多菜单。
2. 在左侧菜单找到 **Pages**。
3. 在 **Build and deployment** 区域，把 **Source** 设为 **Deploy from a branch**。
4. 在 **Branch** 中选择 **main**。
5. 在旁边的文件夹下拉框选择 **/(root)**。
6. 点击 **Save**。

**`/(root)` 指仓库根目录，不是名叫 `root` 的文件夹。** 本版的 `index.html` 就放在该根目录。以后向这个分支保存修改，GitHub 会自动重新发布。[官方说明：配置发布来源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## 6. 查看部署、HTTPS 和线上效果

1. 点击仓库顶部 **Actions**。
2. 打开最新一次 Pages 部署任务，名称通常包含 **pages build and deployment**。即使选择的是“从分支发布”，GitHub 仍使用 Actions 完成部署。
3. 等待任务完成并显示绿色成功标记。若显示红色失败，点击任务名称，再展开失败步骤查看提示。
4. 返回 **Settings → Pages**，查看页面上方公布的网站地址，并点击 **Visit site**。
5. 打开 **https://bowgneo.github.io/**，检查与本地审核版是否一致。
6. 在 **Settings → Pages** 查看 **Enforce HTTPS**：若已勾选或由系统强制启用，保持即可；若可以勾选，则勾选它。使用 `github.io` 域名的新站点会自动通过 HTTPS 提供访问。

GitHub 提示，保存并推送更改后，网站发布最多可能需要约 10 分钟。不要把暂时没有显示最新内容立即当作发布失败。[官方说明：查看发布结果](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)；[官方说明：HTTPS](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)

线上验收时，再检查首页标题、文字、图标、导航、外部链接和手机布局。确认成功后，将文末记录表中的实际执行时间和结果补齐。

## 7. 以后怎样用网页更新

### 修改一句介绍或一个链接

1. 打开仓库 **Code** 页面，选择 `main`，点击 `index.html`。
2. 点击文件右上方的铅笔图标 **Edit this file**。
3. 在编辑器中找到原文字，只修改需要调整的文字或链接地址。
4. 点击 **Commit changes…**，填写说明，例如 `Update introduction`，选择直接提交到 `main`，再确认。
5. 打开 **Actions**，等最新一次 Pages 部署成功，再刷新正式网址。

调整颜色和布局时编辑 `style.css`；更换图标时上传同名 `favicon.svg`。GitHub 文件编辑器的 **Preview** 主要用于预览支持的文件内容，不能代替浏览器里整页效果的检查。[官方说明：网页编辑文件](https://docs.github.com/en/repositories/working-with-files/managing-files/editing-files)

### 用本地新文件覆盖旧文件

如果一次修改较多，先修改本地文件并按第 2 节查看。确认后在仓库根目录使用 **Add file → Upload files** 上传同名文件，查看修改内容，再提交到 `main`。同时保存最新版本到本地，方便下一次继续修改。

## 8. 改错后怎样恢复旧版本

GitHub 会保留每次提交。可以通过 **History** 找回旧内容，再把它保存为一次新的提交；这一过程保留历史记录。

1. 打开需要恢复的文件，例如 `index.html`，点击文件页上的 **History**。若按钮折叠，查看文件标题旁的时钟或更多菜单。
2. 在历史记录中找到修改前确认正常的提交，点击该提交进入详情。
3. 使用提交页面的 **Browse files**，打开那个时间点的文件，再点击 `index.html`。如果差异页提供 **… → View file**，也可以从这里进入对应文件。
4. 点击 **Raw**，复制旧版文件的完整内容。复制前确认你选的是正常版本，而不是发生错误的提交。
5. 回到仓库 **Code → main → index.html → Edit this file**，用旧内容替换当前内容。
6. 保存一次新的提交，例如 `Restore previous homepage`，然后等待 Actions 重新部署。

若一次改动同时涉及 `index.html` 和 `style.css`，应恢复同一时间点的相关文件，再检查整页效果。只打开历史版本不会改变线上网站，必须把恢复后的内容保存回 `main` 才会重新发布。[官方说明：查看历史与原始文件](https://docs.github.com/en/repositories/working-with-files/using-files/viewing-and-understanding-files)

## 9. 常见问题

| 现象 | 检查和处理 |
| --- | --- |
| 网址返回 404 | 确认已完成发布，而不只是创建仓库。核对仓库名是 `bowgneo.github.io`，Pages 来源为 `main` 和 `/(root)`，Actions 已成功。 |
| 已部署但仍 404 | 确认入口文件叫小写 `index.html`，并位于发布源根目录。`Index.html`、`index.HTML` 或多套一层文件夹都会造成问题。 |
| 页面只有文字，没有样式 | 确认 `style.css` 已上传，名称大小写正确，并且和 `index.html` 同级。 |
| 浏览器标签页没有图标 | 确认 `favicon.svg` 已上传；图标可能被浏览器缓存，尝试关闭标签页后重新打开。 |
| 修改后网站仍是旧内容 | 先检查 Actions 是否完成，再等待发布更新。可用无痕窗口重新打开网站，排除浏览器缓存。 |
| 页面里的某个链接打不开 | 打开 `index.html` 检查链接地址；本地页面链接需要对应的 HTML 文件已上传。 |
| 不能直接提交到 main | 仓库可能配置了分支保护。按页面提示新建分支、创建 Pull Request，再合并到 `main`；如果该规则刚添加，可先检查它是否符合你的使用方式。 |

404 的官方排查还包括 GitHub 服务状态和自定义域名配置。本次直接使用 `github.io`，不需要购买域名或配置域名 DNS。[官方说明：排查 404](https://docs.github.com/en/pages/getting-started-with-github-pages/troubleshooting-404-errors-for-github-pages-sites)

## 10. 执行记录

下面将本地准备与网页发布分开记录。网页部分目前均未执行；之后每完成一步，再填写时间和结果。

| 阶段 | 当前记录 | 实际执行时间 / 结果 |
| --- | --- | --- |
| 本地页面准备 | 已准备首页、关于页、建站记录页、样式、图标和 `.nojekyll`。 | 2026-10-25，本地文件。 |
| 完整步骤记录 | 已准备本指南，并查证 GitHub 官方文档。 | 2026-10-25，本地文档。 |
| 用户审核页面 | 待审核。 | 待填写。 |
| 网页创建远端仓库 | 未执行；审核通过后按第 3 节操作。 | 待填写。 |
| 网页上传与提交 | 未执行；按第 4 节操作。 | 待填写。 |
| 网页启用 Pages | 未执行；按第 5 节操作。 | 待填写。 |
| Actions 部署检查 | 未执行；按第 6 节操作。 | 待填写。 |
| HTTPS 与线上验收 | 未执行；正式网址尚未作为发布成果验收。 | 待填写。 |

发布后可以在这里补充仓库链接、最终网站链接、首次部署成功时间，以及必要的页面截图。当前教程根据官方文档整理，未将未执行的 GitHub 点击操作写成已完成记录。


## 11. 页面修改记录与设计参考

| 版本 | 变更与审核状态 |
| --- | --- |
| 第一版 | 个人展示页，包含较大标题和装饰名片。用户认为过于像 AI 生成的模板，未通过审核。 |
| 第二版 | 按真实技术博客的阅读方式重做：白底、窄栏、普通字号、简短导航、文章目录；去除口号和装饰卡片。不设技术方向标签，不编造文章和个人履历。用户认为简介不够专业、排版仍需改进，未通过审核。 |

参考了 [Julia Evans](https://jvns.ca/) 的文章索引、[antirez](https://antirez.com/) 的简洁文章结构，以及[阮一峰的网络日志](https://www.ruanyifeng.com/blog/)的内容组织。只借鉴结构和阅读习惯，没有复制文章、个人资料或图片。

用户已确认文章列表留空。后续添加内容时，每篇应有实际存在的页面和准确的发布日期，再将标题加入首页。此项不影响本指南的图形发布操作。

### 第三版修改（2026-10-26）

- 根据用户明确要求，将显示名统一修正为 **Gavin**，覆盖首页、关于页、标题、页脚、图标及文档。
- GitHub 账号仍为 `bowgneo`，对应仓库名与网址保持 `bowgneo.github.io`；显示名与 GitHub 账号是不同信息。
- 重写简介，说明技术文章、实践笔记与阅读记录的用途，不补写未经确认的职位或履历。
- 桌面使用个人介绍与文章区分栏，手机按阅读顺序纵向排列；调整字体、阅读宽度、导航和留白。
- 文章列表按用户确认保持空白。当前仍在本地审核，未创建远端仓库或发布。


### 第四版修改（2026-10-26）

- 按用户要求删除“写作从具体问题出发……”及首页同类描述，未用近义口号替换。
- 用户已明确确认简介正文暂时保持空白，页面仅保留姓名 Gavin 和 GitHub 账号 bowgneo。后续由用户决定何时补充。
- 重新查阅 [Anthony Fu](https://antfu.me/)、[Lee Robinson](https://leerob.com/) 和 [Bytemash](https://bytemash.net/) 的当前首页。排版主要参考前两者的简短导航、单栏内容与文字层级。
- 收窄主栏，统一无衬线字体，取消个人介绍与空文章目录的左右分栏，精简空状态，统一图标和页脚。
- 文章列表继续留空。仍仅本地审核，未创建远端仓库、上传或发布。
