export default function ({ route, store }) {
  const default_beadcrumb = [{
    to: route.path,
    disabled: true,
    text: route.name === 'index' ? 'Dashboard': route.name .replace(/\-/g, '')
  }]

  const result = route.meta.reduce ((crumbs, meta) => meta.crumbs || crumbs, default_beadcrumb)
  store.commit('breadcrumbs/setBreadcrumbs', result)
}