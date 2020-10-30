import jwt_decode from 'jwt-decode';
import qs from 'querystring';

export const state = () => ({
});

export const mutations = {
  setAuth (state, data) {
    const decode = jwt_decode(data.token);
    this.$auth.setUser({...decode, scope: [decode.role], currentPassword: data.password });
  },
}


export const actions = {
  async UserLogin ({ commit }, data) {
    let response = await this.$auth.loginWith('local', { data: qs.stringify(data) });
    commit('setAuth', { token: response.data.id_token, password: data.password });
  }
}