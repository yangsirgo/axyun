export default {
    data() {
        return {
            clientHeight: ""
        }

    },
    computed: {
        watchHeight() {
            const { clientHeight } = this
            const mainHeight = this.$store.state.permission.mainHeight
            return {
                clientHeight,
                mainHeight
            }
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            this.clientHeight = `${document.documentElement.clientHeight}`
            window.onresize = function temp() {
                this.clientHeight = `${document.documentElement.clientHeight}`;
            };
        },
        changeFixed(mainHeight, clientHeight) {
            this.$refs.page.style.height = (clientHeight - mainHeight) + 'px';

            // 请把自己的代码写好在改别人的，dashboard布局都不会吗，这块用indexOf合适吗，改别人代码斟酌好在改 START
            if (window.location.hash.indexOf('dashboard') > -1) {
                // this.$refs.page.style.height = (clientHeight - mainHeight - 50) + 'px';
                //开始进入首页高度问题解决
                if (mainHeight) {
                    this.$refs.page.style.height = (clientHeight - mainHeight) + 'px';
                } else {
                    this.$refs.page.style.height = (clientHeight - mainHeight - 50) + 'px';
                }
            }

            // 请把自己的代码写好在改别人的，dashboard布局都不会吗，这块用indexOf合适吗，改别人代码斟酌好在改  END
        }
    },
    watch: {
        watchHeight: function (val) {
            this.$nextTick(() => {
                this.changeFixed(val.mainHeight, val.clientHeight)
            })
        }
    }
}
