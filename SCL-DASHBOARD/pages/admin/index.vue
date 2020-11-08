<template>
</template>
<script>
export default {
  middleware ({ store, redirect }) {

    let role = store.state.auth.user.role
    if (role !== 'admin' && role !=='superadmin' && role === 'dokumen')
      return redirect ('/dokumen')
    if (role !== 'admin' && role !== 'dokumen' && role === 'superadmin')
      return redirect ('/superadmin')
    return redirect ('/admin/e-do')
  }
}
</script>
