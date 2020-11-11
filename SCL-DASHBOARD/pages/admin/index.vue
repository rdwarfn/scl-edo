<template>
</template>
<script>
import _ from 'lodash';
export default {
  middleware ({ store, redirect }) {
    let role = store.state.auth.user.role
    switch (_.upperCase(role)) {
      case 'DOKUMEN':
        return redirect('/dokumen');
      case 'SUPERADMIN':
        return redirect('/superadmin');
      default:
        return redirect('/admin/e-do');
    }
  }
}
</script>
