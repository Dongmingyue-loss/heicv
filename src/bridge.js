/**
 * HEICV 插件 —— bridge.js
 *
 * 职责：仅作为「网站 ↔ 扩展」的桥
 * 不做任何处理逻辑，不加载 wasm，不碰文件内容
 *
 * 为什么这样设计：
 *   1. 插件体积保持极小（< 50KB），审核风险低
 *   2. 处理逻辑全在网站，可随时更新，无需发版
 *   3. 网站端可挂 AdSense 变现
 *   4. 网站端 CSP 宽松，可自由用 wasm / Worker
 */

(function () {
  'use strict';

  const VERSION = chrome.runtime.getManifest().version;

  // 1. 告诉页面：扩展已安装（供落地页判断，避免显示"请安装扩展"）
  document.documentElement.setAttribute('data-heicv-ext', VERSION);

  // 2. 注入一个只读标记，供页面探测
  try {
    window.postMessage({ source: 'heicv-ext', type: 'installed', version: VERSION }, location.origin);
  } catch (_) {}

  // 3. 响应页面的 ping（页面用来确认扩展在线）
  window.addEventListener('message', (e) => {
    if (e.source !== window) return;
    if (!e.data || e.data.source !== 'heicv-page') return;

    if (e.data.type === 'ping') {
      window.postMessage(
        { source: 'heicv-ext', type: 'pong', version: VERSION },
        location.origin,
      );
    }
  }, false);

  // 4. 提供"打开本地文件夹"的能力（仅此一项需要扩展权限）
  //    网页无法直接读取本地目录，这是插件唯一的增值能力
  window.addEventListener('message', (e) => {
    if (e.source !== window) return;
    if (!e.data || e.data.source !== 'heicv-page') return;

    if (e.data.type === 'open-files') {
      openFilePicker(e.data.accept, e.data.multiple);
    }
  }, false);

  function openFilePicker(accept, multiple) {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = multiple !== false;
    if (accept) input.accept = accept;
    input.style.display = 'none';
    document.body.appendChild(input);

    input.addEventListener('change', () => {
      const files = Array.from(input.files || []);
      // 只传元信息给页面，文件内容由页面自己读（同源 objectURL）
      // 注意：扩展的 input 与页面同 document，页面可直接访问 Files
      window.dispatchEvent(new CustomEvent('heicv-files-selected', {
        detail: { files },
      }));
      input.remove();
    });

    input.click();
  }
})();
