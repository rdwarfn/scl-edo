import Vue from 'vue'
import _ from 'lodash'
import {
  extend,
  setInteractionMode,
  ValidationObserver,
  ValidationProvider
} from 'vee-validate'
import {
  required,
  email,
  numeric
} from 'vee-validate/dist/rules'

setInteractionMode('eager')

extend('required', {
  ...required,
  message: '{_field_} is required.'
})

extend('email', {
  ...email,
  message: 'E-mail is not valid.'
})

extend('numeric', {
  ...numeric,
  message: '{_field_} must be valid numeric.'
})

const components = [{
  name: 'validation-observer',
  component: ValidationObserver
}, {
  name: 'validation-provider',
  component: ValidationProvider
}]

_.each(components, ({ name, component }) => {
  Vue.component(name, component)
})
