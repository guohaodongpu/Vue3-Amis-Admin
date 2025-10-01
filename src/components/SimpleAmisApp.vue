<template>
  <div ref="amisContainer" class="simple-amis-app"></div>
</template>

<script>
export default {
  name: 'SimpleAmisApp',
  data() {
    return {
      amisInstance: null,
      debug: false // 调试开关，设置为true可查看详细日志
    };
  },
  mounted() {
    this.initAmis();
  },
  beforeDestroy() {
    if (this.amisInstance) {
      this.amisInstance = null;
    }
  },
  methods: {
    async initAmis() {
      await this.loadAmis();
      this.renderAmis();
    },
    loadAmis() {
      return new Promise((resolve) => {
        if (window.amisRequire) {
          resolve();
          return;
        }
        
        const script = document.createElement('script');
        script.src = 'libs/amis/sdk.js';
        script.onload = resolve;
        document.head.appendChild(script);
      });
    },
    renderAmis() {
      if (!window.amisRequire) return;
      
      const amis = window.amisRequire('amis/embed');
      const match = window.amisRequire('path-to-regexp').match;
      
      // Amis 6.x 使用内置的 history 管理
      // 尝试使用 amisRequire 获取 history
      let history;
      try {
        const HistoryLib = window.amisRequire('history');
        history = HistoryLib.createHashHistory();
        if (this.debug) console.log('✅ 使用 amis 内置的 history');
      } catch (e) {
        // 如果失败，尝试使用全局 History
        if (this.debug) console.log('⚠️ amis 内置 history 不可用，尝试使用全局 History');
        const HistoryLib = window.History || window.HistoryLibrary;
        if (!HistoryLib || !HistoryLib.createHashHistory) {
          console.error('History library not available. Please include history.js');
          return;
        }
        history = HistoryLib.createHashHistory();
      }
      
      if (this.debug) console.log('🚀 开始渲染amis应用...');
      
      const app = {
        type: 'app',
        brandName: 'Amis-Admin+Vue3',
        logo: '/public/logo.svg',
        api: '/pages/example/site.json'
      };
      
      // 参考原始index.html的normalizeLink实现
      const normalizeLink = (to, location = history.location) => {
        to = to || '';

        if (to && to[0] === '#') {
          to = location.pathname + location.search + to;
        } else if (to && to[0] === '?') {
          to = location.pathname + to;
        }

        const idx = to.indexOf('?');
        const idx2 = to.indexOf('#');
        let pathname = ~idx
          ? to.substring(0, idx)
          : ~idx2
          ? to.substring(0, idx2)
          : to;
        let search = ~idx ? to.substring(idx, ~idx2 ? idx2 : undefined) : '';
        let hash = ~idx2 ? to.substring(idx2) : location.hash;

        if (!pathname) {
          pathname = location.pathname;
        } else if (pathname[0] != '/' && !/^https?\:\/\//.test(pathname)) {
          let relativeBase = location.pathname;
          const paths = relativeBase.split('/');
          paths.pop();
          let m;
          while ((m = /^\.\.?\//.exec(pathname))) {
            if (m[0] === '../') {
              paths.pop();
            }
            pathname = pathname.substring(m[0].length);
          }
          pathname = paths.concat(pathname).join('/');
        }

        return pathname + search + hash;
      };
      
      // 参考原始index.html的isCurrentUrl实现
      const isCurrentUrl = (to, ctx) => {
        if (!to) {
          return false;
        }
        const pathname = history.location.pathname;
        const link = normalizeLink(to, {
          ...location,
          pathname,
          hash: ''
        });

        if (!~link.indexOf('http') && ~link.indexOf(':')) {
          let strict = ctx && ctx.strict;
          return match(link, {
            decode: decodeURIComponent,
            strict: typeof strict !== 'undefined' ? strict : true
          })(pathname);
        }

        return decodeURI(pathname) === link;
      };

      this.amisInstance = amis.embed(
        this.$refs.amisContainer,
        app,
        {
          location: history.location,
          data: {},
          context: {
            API_HOST: 'https://3xsw4ap8wah59.cfc-execute.bj.baidubce.com'
          }
        },
        {
          updateLocation: (location, replace) => {
            location = normalizeLink(location);
            if (location === 'goBack') {
              return history.goBack();
              } else if (
              (!/^https?\:\/\//.test(location) &&
                location ===
                  history.location.pathname + history.location.search) ||
              location === history.location.href
            ) {
              // 目标地址和当前地址一样，不处理，免得重复刷新
              if (this.debug) console.log('⏭️ 跳过重复路由:', location);
              return;
            } else if (/^https?\:\/\//.test(location) || !history) {
              return (window.location.href = location);
            }

            if (this.debug) console.log('📍 更新位置:', location);
            history[replace ? 'replace' : 'push'](location);
          },
          jumpTo: (to, action) => {
            if (to === 'goBack') {
              return history.goBack();
            }

            to = normalizeLink(to);

            if (isCurrentUrl(to)) {
              if (this.debug) console.log('⏭️ 已在当前页面:', to);
              return;
            }

            if (action && action.actionType === 'url') {
              action.blank === false
                ? (window.location.href = to)
                : window.open(to, '_blank');
              return;
            } else if (action && action.blank) {
              window.open(to, '_blank');
              return;
            }

            if (/^https?:\/\//.test(to)) {
              window.location.href = to;
            } else if (
              (!/^https?\:\/\//.test(to) &&
                to === history.pathname + history.location.search) ||
              to === history.location.href
            ) {
              // do nothing
              if (this.debug) console.log('⏭️ 跳过重复跳转:', to);
            } else {
              if (this.debug) console.log('🔗 导航到:', to);
              history.push(to);
            }
          },
          isCurrentUrl: isCurrentUrl,
          theme: 'cxd'
        }
      );

      history.listen(state => {
        if (this.debug) console.log('🔄 路由变化:', state.location || state);
        this.amisInstance.updateProps({
          location: state.location || state
        });
      });
      
      if (this.debug) console.log('✨ amis应用初始化完成');
    }
  }
};
</script>

<style scoped>
.simple-amis-app {
  width: 100%;
  height: 100vh;
}
</style>
