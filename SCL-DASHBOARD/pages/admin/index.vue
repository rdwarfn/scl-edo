<template>
</template>
<script>
export default {
  middleware ({ store, redirect }) {

    let role = store.state.auth.user.role
    if (role !== 'admin' && role === 'document')
      return redirect ('/document')
    return redirect ('/admin/e-do')
  }
}
</script>
