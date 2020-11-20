<template>
  <!-- <div class="header-container">
    <header class="the-header">
      <TheSideNavToggle @toggle="$emit('sidenav-toggle')" />
      <div class="logo">
        <nuxt-link to="/">
          Trinity Admin
        </nuxt-link>
      </div>
      <div class="spacer" />
    </header>
  </div> -->
  <!-- <b-navbar type="dark" variant="dark">
    <b-navbar-nav>
      <nuxt-link to="/"> Trinity Admin </nuxt-link>
    </b-navbar-nav>
  </b-navbar> -->
  <div>
    <b-navbar type="dark"  variant="dark">
      <b-navbar-brand>Trinity Admin</b-navbar-brand>

      <b-collapse id="nav-collapse" is-nav>

        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right>
            <template #button-content>
              <em>{{ username }}</em>
            </template>
            <b-dropdown-item @click="onLogout">Log Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import Vue from "vue";
import TheSideNavToggle from "@/components/Navigation/TheSideNavToggle";

export default Vue.extend({
  name: "TheHeader",
  components: {
    TheSideNavToggle,
  },
  computed: {
    username() {
      return this.$store.getters['auths/username'];
    }
  },
  methods: {
    onLogout() {
      this.$store.dispatch('auths/logout');
      this.$router.push('/login');
    }
  }
});
</script>

<style scoped>
.header-container {
  height: 60px;
}

.the-header {
  width: 100%;
  position: fixed;
  height: 60px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: black;
  z-index: 100;
  box-sizing: border-box;
  padding: 0 20px;
}

.logo {
  margin: 0 10px;
  font-size: 1.3rem;
}

.logo a {
  text-decoration: none;
  color: white;
}

.spacer {
  flex: 1;
}

.navigation-items {
  display: none;
}

@media (min-width: 768px) {
  .navigation-items {
    display: block;
  }
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
}

.nav-item {
  margin: 0 10px;
}

.nav-item a {
  text-decoration: none;
  color: white;
}

.nav-item a:hover,
.nav-item a:active,
.nav-item a.nuxt-link-active {
  color: red;
}
</style>
