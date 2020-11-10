<template>
  <div class="sidenav-container">
    <div v-if="show" class="sidenav-backdrop" @click="$emit('close')" />
    <transition name="slide-side">
      <div v-if="show" class="sidenav">
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
                <nuxt-link to="/user-management/roles">
                  Roles
                </nuxt-link>
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
          <li class="nav-item">
            Dashboard
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'TheSidenav',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  }
})
</script>

<style scoped>
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
