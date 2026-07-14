import { render, h } from "vue";
import { Loading } from "@varlet/ui";

/**
 * 函数式调用Loading组件
 */
const showLoading = (options = {}) => {
  const divElement = document.createElement("div");
  divElement.className = "szd-loading-container";
  divElement.style.cssText = `
    position: fixed !important;  
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    background: rgba(0, 0, 0, 0.2) !important;
    z-index: 99999 !important;
  `;
  const loadingVNode = h(Loading, options);
  render(loadingVNode, divElement);
  document.body.appendChild(divElement);
  // 返回关闭方法
  return {
    close: () => {
      // 卸载组件 移除DOM元素
      render(null, divElement);
      if (divElement.parentNode) {
        divElement.parentNode.removeChild(divElement);
      }
    }
  };
};

const szdLoading = {
  loading: null,
  show: function (timeout) {
    if (!this.loading) {
      this.loading = showLoading({ loading: true, type: "circle", description: "loading..." });
      if (timeout > 0) {
        setTimeout(() => {
          if (this.loading) {
            this.loading.close();
          }
        }, timeout);
      }
    }
  },
  close: function () {
    if (this.loading) {
      this.loading.close();
      this.loading = null;
    }
  }
};

export default szdLoading;
