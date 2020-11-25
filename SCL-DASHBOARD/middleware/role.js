import _ from 'lodash'

export default function ({ store, redirect, $auth, $router, route }) {
  let role = _.upperCase($auth.user.role);
  console.log(role);
  switch (role) {
    case 'DOKUMEN':
      if (!_.isEqual(route.path, '/dokumen/e-do'))
        return redirect('/dokumen/e-do');
      break;
    case 'ADMIN':
      if (!_.isEqual(route.path, '/admin/e-do'))
        return redirect('/admin/e-do')
      break;
    case 'SUPERADMIN':
      if (!_.isEqual(route.path, '/superadmin/user-management'))
        return redirect('/superadmin/user-management')
      break;
    default:
      if ($auth.loggedIn)
        return redirect('/logout');
      break;
  }
}
