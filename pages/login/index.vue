<template>
  <div class="admin-auth-page">
    <div class="auth-container">
      <form @submit.prevent="onSubmit">
        <AppControlInput
          v-model="username"
          type="text"
        >
          Username
        </AppControlInput>
        <AppControlInput
          v-model="password"
          type="password"
        >
          Password
        </AppControlInput>
        <AppButton type="submit">
          Login
        </AppButton>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'AdminAuthPage',
  layout: 'admin',
  data () {
    return {
      username: '',
      password: '',
      isLogin: true
    }
  },
  methods: {
    onSubmit () {
      (this as any).$store.dispatch('auths/authenticateUser', {
        username: this.username,
        password: this.password
      }).then(() => {
        this.$router.push('/')
      })
    }
  }
})
</script>

<style scoped>
.admin-auth-page {
  padding: 20px;
}

.auth-container {
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 2px #ccc;
  width: 300px;
  margin: auto;
  padding: 10px;
  box-sizing: border-box;
}
</style>
