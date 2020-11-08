<template>
</template>
<script>
export default {
  middleware ({ store, redirect }) {
    let role = store.state.auth.user.role
    if (role !== 'dokumen' && role !== 'superadmin' && role === 'admin') {
      redirect ('/admin')
    }
    if (role !== 'dokument' && role !== 'admin' && role == 'superadmin')
      redirect ('/superadmin')
    return redirect ('/dokumen/e-do')
  }
}
</script>
