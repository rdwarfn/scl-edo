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
  email
} from 'vee-validate/dist/rules'

setInteractionMode('eager')

extend('required',
  {
    ...required,
    message: '{_field_} is required.'
  }
)

extend('email',
  {
    ...email,
    message: 'E-mail is not valid.'
  }
)

const components = [
  {
    name: 'validation-observer',
    component: ValidationObserver
  },
  {
    name: 'validation-provider',
    component: ValidationProvider
  }
]

_.each(components, ({ name, component }) => {
  Vue.component(name, component)
})
