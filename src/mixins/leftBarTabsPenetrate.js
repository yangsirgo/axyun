// 含有tabs的穿透
export default {
  data() {
    return {
      currentPenetrate: "",
      showPenetrate: false
    }
  },
  watch: {
    currentPenetrate: {
      immediate: true,
      handler(v) {
        if (v) {
          this.penetrate(v);
        }
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      // 监听父级元素滚动事件,来实时跟随位置
      const container = document.getElementById("l-c-penetrate-tabs-container");
      const scroller = container.getElementsByClassName("patient-box");

      for (let i = 0; i < scroller.length; i++) {
        const dom = scroller[i];
        dom.addEventListener("scroll", this.scrollFunc, false);
      }

      this.$once("hooks:beforeDestory", () => {
        for (let i = 0; i < scroller.length; i++) {
          const dom = scroller[i];
          dom.removeEventListener("scroll", this.scrollFunc);
        }
      });
    });
  },
  methods: {
    choosePenetrateItem(name, index) {
      this.currentPenetrate = `${name}-${index}`;
    },
    scrollFunc() {
      if (this.currentPenetrate) {
        this.penetrate(this.currentPenetrate);
      }
    },
    penetrate(data) {
      // 如果存在clone元素则移除
      const container = document.getElementById("l-c-penetrate-tabs-container");
      let cloneDom = container.getElementsByClassName("l-c-penetrate-clone")[0];
      cloneDom && container.removeChild(cloneDom);

      const className = `l-c-penetrate-${data}`;
      const dom = container.getElementsByClassName(className)[0];
      if (!dom) {
        return;
      }
      let newDom = dom.cloneNode(true);
      newDom.className += " l-c-penetrate-clone is-active";

      const width = window.getComputedStyle(dom).getPropertyValue("width");
      const height = window.getComputedStyle(dom).getPropertyValue("height");
      newDom.style.width = width;
      newDom.style.height = height;

      // 父容器距离浏览器窗口顶部距离
      const pTop = container.getBoundingClientRect().top;
      // 当前容器距离浏览器窗口顶部距离
      const cTop = dom.getBoundingClientRect().top;

      const name = data.split("-")[0];

      const scroller = container.getElementsByClassName(
        `l-c-patient-box${name}`
      )[0];

      const scrollerTop = scroller.getBoundingClientRect().top - pTop;
      let scrollerHeight = window
        .getComputedStyle(scroller)
        .getPropertyValue("height");
      scrollerHeight = parseFloat(scrollerHeight);

      const moveTop = cTop - pTop;
      newDom.style.top = moveTop + "px";

      const scrollerDis = scrollerTop + scrollerHeight;
      const cloneDis = moveTop + parseFloat(height);
      /**
       * clone的div需要在滚动范围内部,滚到外面时隐藏
       */
      if (scrollerTop > moveTop || cloneDis > scrollerDis) {
        this.showPenetrate = false;
        newDom.remove();
        newDom = null;
      } else {
        this.showPenetrate = true;
        container.appendChild(newDom);
      }
    },
    tabPenetrateClick(tab) {
      // 超出的部分不属于当前tab则隐藏
      const container = document.getElementById("l-c-penetrate-tabs-container");
      let cloneDom = container.getElementsByClassName("l-c-penetrate-clone")[0];
      if (cloneDom) {
        const name = this.currentPenetrate.split("-")[0];
        const tabName = tab.name;
        if (name === tabName) {
          cloneDom.style.display = "block";
        } else {
          cloneDom.style.display = "none";
        }
      }
    }
  }
}