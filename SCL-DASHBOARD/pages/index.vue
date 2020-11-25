<template>
</template>

<script>
import _  from 'lodash';
export default {
  middleware ({ store, redirect }) {
    let role = _.upperCase(store.state.auth.user.role);
    if (!store.state.auth.loggedIn) {
      return redirect ('/login');
    } else {
      switch (role) {
        case 'DOKUMEN':
          return redirect('/dokumen');
        case 'ADMIN':
          return redirect('/admin')
        case 'SUPERADMIN':
          return redirect('/superadmin')
        default:
          return redirect('/logout');
      }
    }
  }
}
</script>
