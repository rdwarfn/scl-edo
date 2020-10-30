<template>
</template>

<script>
import _ from 'lodash';
export default {
  middleware ({ store, redirect, replace }) {
    let auth = store.state.auth;
    if (_.upperCase(auth.user.role) === 'ADMINSPL') {
      return redirect ('/admin')
    } else if (_.upperCase(auth.user.role) === 'KASIR') {
      return redirect ('/kasir')
    } else {
      return redirect ('/logout')
    }

  }
}
</script>

<style>

</style>