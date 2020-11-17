<template>
  <div
    id="demo"
    :class="[{'collapsed' : collapsed}, {'onmobile' : isOnMobile}]"
  >
        <TheNewHeader @sidenav-toggle="true" />
    <div class="demo">
      <div>
        <!-- <h1>
          vue-sidebar-menu
          <a
            style="color: #000;text-transform: uppercase;font-size: 14px;font-weight: 400;"
            href="https://github.com/yaminncco/vue-sidebar-menu"
          >
            Github
          </a>
        </h1>
        <p>A vue.js sidebar menu component</p>
        <div>
          Select theme:
          <select v-model="selectedTheme">
            <option
              v-for="(theme, index) in themes"
              :key="index"
              :value="theme.input"
            >
              {{ theme.name }}
            </option>
          </select>
        </div>
        <hr style="margin: 50px 0px;border: 1px solid #e3e3e3;">
        <router-view /> -->
        <Nuxt />
      </div>
      <sidebar-menu
        :menu="menu"
        :collapsed="collapsed"
        :theme="selectedTheme"
        :show-one-child="true"
        @toggle-collapse="onToggleCollapse"
        @item-click="onItemClick"
      />
      <div
        v-if="isOnMobile && !collapsed"
        class="sidebar-overlay"
        @click="collapsed = true"
      />
    </div>
  </div>
</template>

<script>
const separator = {
  template: `<hr style="border-color: rgba(0, 0, 0, 0.1); margin: 20px;">`
}

export default {
  name: 'App',
  data() {
    return {
      menu: [
        {
          header: true,
          title: "Device Manage Management",
          hiddenOnCollapse: true,
        },
        {
          href: "/device-manage-management/import-sn",
          title: "Import S/N",
          icon: "fa fa-file-upload",
        },
        {
          href: "/device-manage-management/download-qr",
          title: "Download QR",
          icon: "fa fa-qrcode",
        },
        {
          header: true,
          title: "User Management",
          hiddenOnCollapse: true,
        },
        {
          href: "/user-management/user-list",
          title: "User List",
          icon: "fa fa-user",
        },
        {
          href: "/user-management/business-units",
          title: "Business Units",
          icon: "fa fa-cube",
        },
        {
          href: "/user-management/roles",
          title: "Roles",
          icon: "fa fa-user-shield",
        },
        {
          header: true,
          title: "Master Management",
          hiddenOnCollapse: true,
        },
        {
          href: "/master-management/firmware",
          title: "Firmware",
          icon: "fa fa-microchip",
        },
        {
          href: "/master-management/sensor-model",
          title: "Sensor Model",
          icon: "fa fa-satellite-dish",
        },
        {
          href: "/master-management/sensor-type",
          title: "Sensor Type",
          icon: "fa fa-wifi",
        },
        {
          header: true,
          title: "Dashboard",
          hiddenOnCollapse: true,
        },
        {
          href: "/test",
          title: "Test",
          icon: "fa fa-wifi",
        },
        {
          component: separator,
        },
      ],
      collapsed: false,
      themes: [
        {
          name: "Default theme",
          input: "",
        },
        {
          name: "White theme",
          input: "white-theme",
        },
      ],
      selectedTheme: "",
      isOnMobile: false,
    };
  },
  mounted () {
    this.onResize()
    window.addEventListener('resize', this.onResize)
  },
  methods: {
    onToggleCollapse (collapsed) {
      console.log(collapsed)
      this.collapsed = collapsed
    },
    onItemClick (event, item, node) {
      console.log('onItemClick')
      // console.log(event)
      // console.log(item)
      // console.log(node)
    },
    onResize () {
      if (window.innerWidth <= 767) {
        this.isOnMobile = true
        this.collapsed = true
      } else {
        this.isOnMobile = false
        this.collapsed = false
      }
    }
  }
}
</script>

<style>

body,
html {
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Source Sans Pro', sans-serif;
  font-size: 18px;
  background-color: #f2f4f7;
  color: #262626;
}

#demo {
  padding-left: 350px;
  transition: 0.3s ease;
}
#demo.collapsed {
  padding-left: 50px;
}
#demo.onmobile {
  padding-left: 50px;
}

.sidebar-overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: #000;
  opacity: 0.5;
  z-index: 900;
}

.demo {
  padding: 50px;
}

.container {
  max-width: 900px;
}

pre {
  font-family: Consolas, monospace;
  color: #000;
  background: #fff;
  border-radius: 2px;
  padding: 15px;
  line-height: 1.5;
  overflow: auto;
}
</style>
