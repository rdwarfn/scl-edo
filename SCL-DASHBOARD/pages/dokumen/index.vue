<template>
</template>
<script>
import _ from 'lodash';
export default {
  middleware ({ store, redirect }) {
    let role = store.state.auth.user.role
    switch (_.upperCase(role)) {
      case 'ADMIN':
        return redirect('/admin');
      case 'SUPERADMIN':
        return redirect('/superadmin')
      default:
        return redirect('/dokumen/e-do');
    }
  }
}
</script>
