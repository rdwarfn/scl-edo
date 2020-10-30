<template>
</template>

<script>
export default {
  beforeMount () {
    this.$nextTick (() => {
      this.$auth.logout()
      .finally (() => {
        window.localStorage.clear();
        this.$router.redirect ('/login')
      })
    })
  }
}
</script>

<style>

</style>