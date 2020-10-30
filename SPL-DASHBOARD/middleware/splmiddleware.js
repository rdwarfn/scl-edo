export default function ({ store, redirect }) {
    if (!store.state.auth || !store.state.auth.user.role !== 'adminspl' || !store.state.auth.user.role !== 'kasir') {
        return redirect ('/login')
    }
};