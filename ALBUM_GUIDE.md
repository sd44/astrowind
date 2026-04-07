# 相册使用指南

## 概述

本项目的相册功能基于 `astro-lightgallery` 构建，支持两种使用方式：

1. **简单模式**：只需在 YAML 中定义 title、description 和 cover，自动加载目录中的图片
2. **进阶模式**：在 YAML 中为每张图片添加详细说明（说明、日期、地点等）

---

## 快速开始

### 方式一：简单模式（推荐快速使用）

1. 在 `src/content/albums/` 目录下创建一个新的 `.yml` 文件：

```yaml
# my-album.yml
title: 我的相册
description: 这是相册的描述
cover: ./my-album/cover.jpg
```

2. 在同级目录创建子文件夹并放入图片：

```
src/content/albums/
├── my-album.yml          # 相册配置文件
└── my-album/             # 相册图片目录
    ├── cover.jpg         # 封面图片
    ├── 1.jpg
    ├── 2.jpg
    └── 3.png
```

3. 系统会自动加载子文件夹中的所有图片（支持 `.jpg`、`.jpeg`、`.png`、`.gif`、`.webp`）

---

### 方式二：进阶模式（推荐需要详细说明的场景）

在 YAML 中为每张图片添加详细信息：

```yaml
# travel-album.yml
title: 2024欧洲之旅
description: 巴黎、伦敦、罗马的旅行记录
cover: ./travel-album/cover.jpg

# 为每张图片添加详细说明
images:
  - src: ./travel-album/01-paris.jpg
    alt: "巴黎埃菲尔铁塔"
    caption: "埃菲尔铁塔夜景"
    date: 2024-06-15
    location: "巴黎, 法国"
    loading: "eager"  # 优先加载（适合首屏图片）
    
  - src: ./travel-album/02-london.jpg
    alt: "伦敦大本钟"
    caption: "大本钟和议会大厦"
    date: 2024-06-18
    location: "伦敦, 英国"
    loading: "lazy"   # 延迟加载（默认值）
    
  - src: ./travel-album/03-rome.jpg
    alt: "罗马斗兽场"
    caption: "古老的斗兽场遗址"
    date: 2024-06-22
    location: "罗马, 意大利"
```

---

## YAML 配置字段说明

### 必需字段

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `title` | `string` | 相册标题 | `"我的相册"` |
| `cover` | `image` | 封面图片路径 | `./my-album/cover.jpg` |

### 可选字段（相册级别）

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `description` | `string` | 相册描述 | `"2024年旅行照片"` |
| `images` | `ImageItem[]` | 图片详细配置 | 见下方 ImageItem 说明 |

### ImageItem 类型（images 数组中的对象）

| 字段 | 类型 | 必需 | 说明 | 示例 |
|------|------|------|------|------|
| `src` | `string` | ✅ | 图片路径（相对于 YAML 文件） | `./album/photo.jpg` |
| `alt` | `string` | ❌ | 图片替代文本（无障碍） | `"海边日落"` |
| `caption` | `string` | ❌ | 图片说明文字（自动生成 subHtml） | `"埃菲尔铁塔夜景"` |
| `date` | `date` | ❌ | 拍摄日期 | `2024-06-15` |
| `location` | `string` | ❌ | 拍摄地点 | `"巴黎, 法国"` |
| `subHtml` | `string` | ❌ | 自定义 HTML 说明（优先级最高，覆盖 caption/date/location） | `"<h4>标题</h4><p>说明</p>"` |
| `loading` | `"lazy" \| "eager"` | ❌ | 加载策略 | `"eager"` |
| `srcThumb` | `string` | ❌ | 缩略图路径（不设置则使用 src） | `./album/thumb.jpg` |

---

## subHtml 自动生成规则

如果未手动设置 `subHtml`，系统会根据以下字段自动生成：

```yaml
# 输入
- src: ./photo.jpg
  caption: "美丽的风景"
  date: 2024-06-15
  location: "桂林, 中国"

# 自动生成的 subHtml
# <h4>美丽的风景</h4><p>📅 2024-06-15 · 📍 桂林, 中国</p>
```

如果设置了 `subHtml`，则完全使用自定义内容，忽略 `caption`、`date`、`location`。

---

## lightGallery 配置选项

在 `[id].astro` 文件中，可以通过 `options` 配置 lightGallery 的行为：

### 常用选项

```astro
<LightGallery
  layout={{ ... }}
  options={{
    // 功能插件
    thumbnail: true,        // 显示缩略图导航
    zoom: true,             // 启用缩放
    fullScreen: true,       // 启用全屏
    download: true,         // 显示下载按钮
    
    // 进阶插件（默认未启用）
    // autoplay: false,     // 自动播放
    // hash: false,         // URL hash 导航
    // share: false,        // 分享按钮
    // rotate: false,       // 旋转功能
    // video: true,         // 视频支持
    // comment: false,      // 评论功能
    
    // 行为配置
    loop: true,             // 循环播放
    speed: 500,             // 过渡动画速度（毫秒）
    thumbWidth: 100,        // 缩略图宽度（像素）
    thumbHeight: '80px',    // 缩略图高度
    
    // 显示控制
    hideBarsDelay: 3500,    // 隐藏控制栏延迟（毫秒）
    showBarsOn: 'click',    // 显示控制栏的触发方式
    
    // 移动端优化
    swipeThreshold: 50,     // 滑动手势阈值
    enableDrag: true,       // 启用鼠标拖拽
    enableSwipe: true,      // 启用触摸滑动
  }}
/>
```

### 完整选项列表

参考 [lightGallery 官方文档](https://www.lightgalleryjs.com/docs/settings/)

---

## 图片组织最佳实践

### 推荐的目录结构

```
src/content/albums/
├── travel-2024.yml              # 相册 1
├── travel-2024/                 # 图片目录 1
│   ├── cover.jpg               # 封面
│   ├── 01-paris.jpg
│   ├── 02-london.jpg
│   └── 03-rome.jpg
├── wedding.yml                 # 相册 2
└── wedding/                    # 图片目录 2
    ├── cover.jpg
    ├── ceremony.jpg
    └── reception.jpg
```

### 图片命名建议

- 使用有意义的名称：`paris-eiffel-tower.jpg` 而非 `IMG_001.jpg`
- 使用小写字母和连字符（kebab-case）
- 添加序号便于排序：`01-cover.jpg`、`02-paris.jpg`

### 图片优化建议

1. **压缩图片**：上传前使用 TinyPNG 等工具压缩
2. **选择合适的格式**：
   - 照片：使用 JPEG 或 WebP
   - 图形/图标：使用 PNG 或 SVG
   - 动画：使用 GIF 或 WebP
3. **分辨率建议**：
   - 大图：宽度 1200-2000px
   - 缩略图：宽度 200-400px（如使用 `srcThumb`）

---

## 常见问题

### Q: 图片不显示怎么办？

1. **检查目录名称是否匹配**：图片子目录名称应与 YAML 文件名一致
   - `my-album.yml` → `my-album/` ✅
   - `my-album.yml` → `MyAlbum/` ❌（大小写不匹配）

2. **检查图片格式**：确保是支持的格式（`.jpg`、`.png`、`.gif`、`.webp`）

3. **检查路径**：`src` 和 `cover` 字段的路径应相对于 YAML 文件，使用 `./` 开头

### Q: 简单模式和进阶模式可以混用吗？

可以。如果 YAML 中定义了 `images`，则使用进阶模式；否则自动加载目录中的所有图片。

### Q: `subHtml` 和 `caption` 有什么区别？

- `caption`：纯文本，系统会自动生成包含日期和地点的 HTML
- `subHtml`：完全自定义的 HTML，优先级最高

### Q: 如何为单张图片添加更多元数据？

可以编辑 `src/content.config.ts` 中的 schema，添加自定义字段，然后在 `[id].astro` 中使用。

---

## 示例文件

- 进阶模式示例：`src/content/albums/testAlbums.yml` 和对应的 `testAlbums/` 目录

---

## 参考资源

- [astro-lightgallery 文档](https://pascal-brand38.github.io/astro-dev/packages/astro-lightgallery)
- [lightGallery 官方文档](https://www.lightgalleryjs.com/docs/settings/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro 图片优化](https://docs.astro.build/en/guides/images/)
