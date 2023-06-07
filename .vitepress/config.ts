import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "clouldNative_Frontend",
  description: "clouldNative and frontend skills, Rust,Golang,Typescript; ",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: nav(),

    sidebar: {
      "/rust/": sidebarRust(),
      "/fe": sidebarFE(),
      "/k8s/": sidebarK8s(),
    },

    socialLinks: [
      { icon: "github", link: "https://github.com/vuejs/vitepress" },
    ],
  },
});

function nav() {
  return [
    { text: "Rust", link: "/rust/introduction", activeMatch: "/rust/" },
    { text: "FE", link: "/fe/introduction", activeMatch: "/fe/" },
    { text: "k8s", link: "/k8s/introduction", activeMatch: "/k8s/" },
  ];
}

function sidebarRust() {
  return [
    {
      text: "项目介绍",
      collapsed: false,
      items: [{ text: "介绍", link: "/rust/introduction" }],
    },
    {
      text: "项目手册",
      collapsed: false,
      items: [
        { text: "介绍1", link: "/rust/introduction" },
        { text: "介绍2", link: "/rust/introduction" },
      ],
    },
  ];
}

function sidebarFE() {
  return [
    {
      text: "项目介绍",
      collapsed: false,
      items: [
        { text: "介绍1", link: "/fe/introduction" },
        { text: "介绍2", link: "/fe/introduction" },
        { text: "介绍3", link: "/fe/introduction" },
      ],
    },
  ];
}

function sidebarK8s() {
  return [
    {
      text: "好活当赏",
      collapsed: false,
      items: [
        { text: "概览", link: "/k8s/jicao1" },
        { text: "API", link: "/k8s/introduction" },
      ],
    },
    {
      text: "项目手册",
      collapsed: false,
      items: [
        { text: "项目介绍", link: "/k8s/introduction" },
        { text: "项目介绍", link: "/k8s/introduction" },
      ],
    },
  ];
}
