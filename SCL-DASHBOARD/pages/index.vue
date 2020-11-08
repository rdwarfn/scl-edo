<template>
</template>

<script>
import _  from 'lodash';
export default {
  middleware ({ store, redirect }) {
    let role = _.upperCase(store.state.auth.user.role);
    if (!store.state.auth.loggedIn) {
      return redirect ('/login');
    } else if (role === 'ADMIN') {
      return redirect  ('/admin')
    } else if (role === 'DOKUMEN') {
      return redirect ('/dokumen')
    } else if (role === 'SUPERADMIN') {
      return redirect('/superadmin')
    } else {
      return redirect ('/logout')
    }
  }
}
</script>

<style>

</style>
export default {
  middleware ({ store, redirect, replace }) {
    let auth = store.state.auth;
    if (auth.user.role === 'adminspl') {
      return redirect ('/admin')
    }

    if (auth.user.role === 'kasir') {
      return redirect ('/kasir')
    }

    redirect ('/logout')
  }
}