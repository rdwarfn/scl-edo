<template>
</template>

<script>
import _ from 'lodash';
export default {
  middleware ({ store, redirect, replace }) {
    let role = store.state.auth.user.role;
    switch (_.upperCase(role)) {
      case 'ADMINSPL':
        return redirect('/admin');
      case 'KASIR':
        return redirect('/kasir');
      default:
        return redirect('/logout');
    }
  }
}
</script>

<style>

</style>