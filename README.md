# Gavin 的个人主页

一个使用原生 HTML 和 CSS 的个人主页，支持手机和桌面。无需安装依赖，无需构建。

**当前状态：本地审核稿，尚未创建远端仓库，也未发布到 GitHub Pages。**

计划地址：<https://bowgneo.github.io/>。此地址在审核通过并部署后才是本站的访问地址。

## 预览

双击 `index.html` 即可在浏览器中预览；也可以在本目录运行：

```bash
python3 -m http.server 8847 --bind 127.0.0.1
```

浏览器访问 <http://127.0.0.1:8847/>，按 `Ctrl+C` 停止服务。

## 文件

| 文件 | 用途 |
| --- | --- |
| `index.html` | 页面文字、个人链接和结构 |
| `about.html` | 关于页面 |
| `setup.html` | 可在浏览器里阅读的建站记录 |
| `style.css` | 颜色、字体、布局和移动端适配 |
| `favicon.svg` | 浏览器标签页图标 |
| `.nojekyll` | 告诉 GitHub Pages 直接发布静态文件 |
| `GUIDE.zh-CN.md` | 实施记录和完整的 GitHub 网页操作教程 |

完整步骤见 [GUIDE.zh-CN.md](GUIDE.zh-CN.md)。审核通过后再执行其中的创建仓库、上传和发布步骤。
