<template>
  <sidebar-menu :menu="menu" />
</template>

<script lang="ts">
const separator = {
  template: `<hr style="border-color: rgba(0, 0, 0, 0.1); margin: 20px;">`,
};

import Vue from "vue";

export default Vue.extend({
  // middleware: ['check-auth', 'auth'],
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
      selectedTheme: "white-theme",
      isOnMobile: false,
    };
  },
});
</script>