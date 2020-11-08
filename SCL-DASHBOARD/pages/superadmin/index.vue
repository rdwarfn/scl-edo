<template>
</template>
<script>
export default {
  middleware ({ store, redirect }) {

    let role = store.state.auth.user.role
    if (role !== 'superadmin' && role !== 'admin' && role === 'dokumen')
      return redirect ('/dokumen')
    if (role !== 'superadmin' && role !== 'dokumen' && role === 'admin')
      return redirect ('/admin')
    return redirect ('/admin/data-master')
  }
}
</script>
