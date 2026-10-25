# Gavin 的个人主页

一个使用原生 HTML 和 CSS 的个人主页，支持手机和桌面。无需安装依赖，无需构建。

**当前状态：页面已获用户确认，公开仓库已创建，正在配置 GitHub Pages 并部署。**

网站地址：<https://bowgneo.github.io/>（部署验收中）。

源码仓库：<https://github.com/bowgneo/bowgneo.github.io>。

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

完整步骤见 [GUIDE.zh-CN.md](GUIDE.zh-CN.md)。其中保留网页操作教程，并单独记录本次通过 GitHub CLI 与 API 的实际创建过程。
