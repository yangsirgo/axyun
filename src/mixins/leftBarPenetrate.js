export default {
  data() {
    return {
      currentPenetrate: "",
      showPenetrate: false,
    }
  },
  watch: {
    currentPenetrate: {
      immediate: true,
      handler(v) {
        if (typeof v === "number") {
          this.penetrate(v);
        }
      },
    },
  },
  mounted() {
    this.$nextTick(() => {
      // 监听父级元素滚动事件,来实时跟随位置
      const container = document.getElementById("l-c-penetrate-container");
      const scroller = container.getElementsByClassName("patient-box")[0];
      scroller.addEventListener("scroll", this.scrollPenetrateFunc, false);

      this.$once("hooks:beforeDestory", () => {
        scroller.removeEventListener("scroll", this.scrollPenetrateFunc);
      });
    });
  },
  methods: {
    choosePenetrateItem(index) {
      this.currentPenetrate = index;
    },
    scrollPenetrateFunc() {
      if (typeof this.currentPenetrate === "number") {
        this.penetrate(this.currentPenetrate);
      }
    },
    penetrate(index) {
      // 如果存在clone元素则移除
      const container = document.getElementById("l-c-penetrate-container");
      let cloneDom = container.getElementsByClassName("l-c-penetrate-clone")[0];
      cloneDom && container.removeChild(cloneDom);

      const className = `l-c-penetrate${index}`;
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

      const scroller = container.getElementsByClassName("patient-box")[0];
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
  }
}