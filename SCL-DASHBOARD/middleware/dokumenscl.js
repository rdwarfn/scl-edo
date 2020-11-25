import _ from 'lodash'

export default function ({ store, redirect }) {
  let role = _.upperCase(store.state.auth.user.role)
  if (!_.isEqual(role, 'DOKUMEN')) {
    switch (role) {
      case 'ADMIN':
        return redirect('/admin');
      case 'SUPERADMIN':
        return redirect('/superadmin')
    }
  }
}
