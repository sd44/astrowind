import { getAsset, getBlogPermalink, getPermalink } from './utils/permalinks';

import type { Post } from '~/types';
import { fetchPosts } from '~/utils/blog';

const posts = await fetchPosts();

// 获取所有分类
const categories: Record<string, string> = {};
posts.forEach((post: Post) => {
  if (post.category) {
    categories[post.category.slug] = post.category.title;
  }
});

const categoryLinks = Object.entries(categories).map(([slug, title]) => ({ text: title, href: getPermalink(`/category/${slug}`) }))

export const headerData = {
  links: [
    {
      text: '主页',
      href: getPermalink('/'),
    },
    {
      text: '日志',
      links: [
        {
          text: '全部',
          href: getBlogPermalink(),
        },
        ...categoryLinks,
      ],
    },
    {
      text: '标签',
      links: [
        {
          text: 'Blog List',
          href: getBlogPermalink(),
        },
      ],
    },
    {
      text: '图片墙',
      href: getPermalink('/gallery'),
    },
  ],
  actions: [{ text: 'Download', href: 'https://github.com/onwidget/astrowind', target: '_blank' }],
};

export const footerData = {
  links: [],
  secondaryLinks: [],
  // links: [
  //   {
  //     title: 'Product',
  //     links: [
  //       { text: 'Features', href: '#' },
  //       { text: 'Security', href: '#' },
  //       { text: 'Team', href: '#' },
  //       { text: 'Enterprise', href: '#' },
  //       { text: 'Customer stories', href: '#' },
  //       { text: 'Pricing', href: '#' },
  //       { text: 'Resources', href: '#' },
  //     ],
  //   },
  //   {
  //     title: 'Company',
  //     links: [
  //       { text: 'About', href: '#' },
  //       { text: 'Blog', href: '#' },
  //       { text: 'Careers', href: '#' },
  //       { text: 'Press', href: '#' },
  //       { text: 'Inclusion', href: '#' },
  //       { text: 'Social Impact', href: '#' },
  //       { text: 'Shop', href: '#' },
  //     ],
  //   },
  // ],
  // secondaryLinks: [
  //   { text: 'Terms', href: getPermalink('/terms') },
  //   { text: 'Privacy Policy', href: getPermalink('/privacy') },
  // ],
  socialLinks: [
    // { ariaLabel: 'X', icon: 'tabler:brand-x', href: '#' },
    // { ariaLabel: 'Instagram', icon: 'tabler:brand-instagram', href: '#' },
    // { ariaLabel: 'Facebook', icon: 'tabler:brand-facebook', href: '#' },
    { ariaLabel: 'RSS', icon: 'tabler:rss', href: getAsset('/rss.xml') },
    { ariaLabel: 'Github', icon: 'tabler:brand-github', href: 'https://github.com/sd44' },
  ],
  footNote: `
    <a class="text-blue-600 underline dark:text-muted" href="https://github.com/sd44"> 蛋疼的蛋蛋</a>设计，子韩版权所有  · All rights reserved.
  `,
};
