<template>
  <div class="sidenav-container">
    <div v-if="show" class="sidenav-backdrop" @click="$emit('close')" />
    <transition name="slide-side">
      <div v-if="show" class="sidenav">
        <sidebar-menu :menu="menu" />
      </div>
      <!-- <div v-if="show" class="sidenav">
        <ul class="nav-list" @click="$emit('close')">
          <li class="nav-item">
            Device Manage Management
            <ul class="sub-nav-list">
              <li>
                <nuxt-link to="/device-manage-management/import-sn">
                  Import S/N
                </nuxt-link>
              </li>
              <li>
                <nuxt-link to="/device-manage-management/download-qr">
                  Download QR
                </nuxt-link>
              </li>
            </ul>
          </li>
          <li class="nav-item">
            User Management
            <ul class="sub-nav-list">
              <li>
                <nuxt-link to="/user-management/user-list">
                  User List
                </nuxt-link>
              </li>
              <li>
                <nuxt-link to="/user-management/business-units">
                  Business Units
                </nuxt-link>
              </li>
              <li>
                <nuxt-link to="/user-management/roles"> Roles </nuxt-link>
              </li>
            </ul>
          </li>
          <li class="nav-item">
            Master Management
            <ul class="sub-nav-list">
              <li>
                <nuxt-link to="/master-management/firmware">
                  Firmware
                </nuxt-link>
              </li>
              <li>
                <nuxt-link to="/master-management/sensor-model">
                  Sensor Model
                </nuxt-link>
              </li>
              <li>
                <nuxt-link to="/master-management/sensor-type">
                  Sensor Type
                </nuxt-link>
              </li>
            </ul>
          </li>
          <li class="nav-item">Dashboard</li>
        </ul>
      </div> -->
    </transition>
  </div>
</template>

<script>
const separator = {
  template: `<hr style="border-color: rgba(0, 0, 0, 0.1); margin: 20px;">`,
};

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
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
          icon: "fa fa-download",
        },
        {
          href: "/device-manage-management/download-qr",
          title: "Download QR",
          icon: "fa fa-code",
        },
        {
          header: true,
          title: "User Management",
          hiddenOnCollapse: true,
        },
        {
          href: "/user-management/user-list",
          title: "User List",
          icon: "fa fa-download",
        },
        {
          href: "/user-management/business-units",
          title: "Business Units",
          icon: "fa fa-download",
        },
        {
          href: "/user-management/roles",
          title: "Roles",
          icon: "fa fa-download",
        },
        {
          header: true,
          title: "Master Management",
          hiddenOnCollapse: true,
        },
        {
          href: "/master-management/firmware",
          title: "Firmware",
          icon: "fa fa-download",
        },
        {
          href: "/master-management/sensor-model",
          title: "Sensor Model",
          icon: "fa fa-download",
        },
        {
          href: "/master-management/sensor-type",
          title: "Sensor Type",
          icon: "fa fa-download",
        },
        {
          header: true,
          title: "Dashboard",
          hiddenOnCollapse: true,
        },
        /*{
          href: "/props",
          title: "Props",
          icon: "fa fa-cogs",
        },
        {
          href: "/events",
          title: "Events",
          icon: "fa fa-bell",
        },
        {
          href: "/styling",
          title: "Styling",
          icon: "fa fa-palette",
        },*/
        {
          component: separator,
        },
        // {
        //   header: true,
        //   title: "Example",
        //   hiddenOnCollapse: true,
        // },
        // {
        //   href: "/disabled",
        //   title: "Disabled page",
        //   icon: "fa fa-lock",
        //   disabled: true,
        // },
        // {
        //   title: "Badge",
        //   icon: "fa fa-cog",
        //   badge: {
        //     text: "new",
        //     class: "vsm--badge_default",
        //   },
        // },
        // {
        //   href: "/page",
        //   title: "Dropdown Page",
        //   icon: "fa fa-list-ul",
        //   child: [
        //     {
        //       href: "/page/sub-page-1",
        //       title: "Sub Page 01",
        //       icon: "fa fa-file-alt",
        //     },
        //     {
        //       href: "/page/sub-page-2",
        //       title: "Sub Page 02",
        //       icon: "fa fa-file-alt",
        //     },
        //   ],
        // },
        // {
        //   title: "Multiple Level",
        //   icon: "fa fa-list-alt",
        //   child: [
        //     {
        //       title: "page",
        //     },
        //     {
        //       title: "Level 2 ",
        //       child: [
        //         {
        //           title: "page",
        //         },
        //         {
        //           title: "Page",
        //         },
        //       ],
        //     },
        //     {
        //       title: "Page",
        //     },
        //     {
        //       title: "Another Level 2",
        //       child: [
        //         {
        //           title: "Level 3",
        //           child: [
        //             {
        //               title: "Page",
        //             },
        //             {
        //               title: "Page",
        //             },
        //           ],
        //         },
        //       ],
        //     },
        //   ],
        // },
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
      selectedTheme: "white-theme",
      isOnMobile: false,
    };
  },
};
</script>

<style>
.sidenav-container {
  height: 100%;
  width: 100%;
}

.sidenav-backdrop {
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  position: fixed;
  top: 0;
  left: 0;
}

.sidenav {
  height: 100%;
  width: 300px;
  background-color: white;
  z-index: 10000;
  position: fixed;
  top: 0;
  left: 0;
  box-sizing: border-box;
  padding: 30px;
}

.slide-side-enter-active,
.slide-side-leave-active {
  transition: all 0.3s ease-out;
}
.slide-side-enter,
.slide-side-leave-to {
  transform: translateX(-100%);
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sub-nav-list {
  list-style: none;
  padding: 0;
  margin: 0 0 0 20px;
  color: #304455;
}

.nav-item {
  margin: 20px 0;
}

.nav-item a {
  text-decoration: none;
  color: black;
  font-size: 1.5rem;
}

.nav-item a:hover,
.nav-item a:active {
  color: red;
}
</style>
