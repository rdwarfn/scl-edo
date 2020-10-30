<template>
</template>
<script>
export default {
  middleware ({ store, redirect }) {
    let role = store.state.auth.user.role
    if (role !== 'dokumen' && role === 'admin') {
      redirect ('/admin')
    }
    return redirect ('/dokumen/e-do')
  }
}
</script>
