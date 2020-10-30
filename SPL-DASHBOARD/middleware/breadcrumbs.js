export default function ({ route, store }) {
  const defaultRouteName = route.name === 'kasir' ? 'Dashboard': route.name === 'admin' ? 'Dashboard': route.name .replace(/\-/g, '');

  const default_beadcrumb = [{
    to: route.path,
    disabled: true,
    text: defaultRouteName || admin_route
  }]

  const result = route.meta.reduce ((crumbs, meta) => meta.crumbs || crumbs, default_beadcrumb)
  store.commit('breadcrumbs/setBreadcrumbs', result)
}