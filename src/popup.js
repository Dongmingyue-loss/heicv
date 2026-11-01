/**
 * HEICV popup 逻辑
 * 极简：只有两个动作 —— 打开网站 / 选择文件后跳转
 */
(function () {
  'use strict';

  const SITE = 'https://heicv.pages.dev';
  const VERSION = chrome.runtime.getManifest().version;

  document.getElementById('ver').textContent = 'v' + VERSION;

  // 本地化
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const msg = chrome.i18n.getMessage(key);
    if (msg) el.textContent = msg;
  });

  // 1. 打开转换器
  document.getElementById('open').addEventListener('click', () => {
    chrome.tabs.create({ url: SITE + '/' , index: 0 });
    window.close();
  });

  // 2. 选择文件 —— 用页面内 input（扩展页面无法直接拿 File 传给网站）
  //    方案：打开网站并带上 ?pick=1，由网站自己弹出文件选择器
  //    这样避免了跨上下文传文件的复杂性
  document.getElementById('pick').addEventListener('click', () => {
    chrome.tabs.create({ url: SITE + '/?pick=1', index: 0 }, () => {
      window.close();
    });
  });
})();
