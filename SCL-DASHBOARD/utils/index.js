import _ from 'lodash';
export { default as Drawer } from './drawer'
export * from './colors'
export {
  HeaderTableTabHistory,
  HeaderTableTabNewEDO,
  HeaderTableUser,
  HeaderTableConsignee,
  HeaderTablePortOfLoading,
  HeaderTablePortOfDischarge,
  HeaderTableFinalDestination
} from './headers';

export const getColorStatus = (params) => {
  switch (_.upperCase (params)) {
    case 'RELEASED':
      return '#BB6BD9';

    case 'REJECTED':
      return '#FF3860';

    case 'UNPAID':
      return '#3273DC';

    case 'REISSUED':
      return '#3273DC';

    case 'PAID':
      return '#00D1B2';

    case 'HOLD ON':
      return '#FFDD57'
  }
}

export const initRole = ['admin', 'dokumen', 'kasir', 'adminspl', 'superadmin'];

export const setDisabledActions = params => {
  return _.upperCase (params) !== "UNPAID"
}

export const validateEmail = (params) => {
  const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return pattern.test(params)
}

export const contextDocumentDetailEdo = (params) => {
  let ctx;
  switch (_.upperCase(params)) {
    case "UNPAID":
      return ctx = {
        print: false,
        edit: false,
        send_to_consigne: false,
      };

    case "REJECTED":
      return ctx = {
        print: false,
        edit: true,
        send_to_consigne: false,
      }

    case "PAID":
      return ctx = {
        print: true,
        edit: false,
        send_to_consigne: true,
      }
  }
}


export const isCanSendToConsignee = (status) => _.upperCase (status) === 'UNPAID';

export const isCanReject = (status) => _.upperCase (status) === 'UNPAID';

export const isCanReissue = (status) => {
  switch (_.upperCase (status)) {
    case 'PAID':
      return true;

    case 'REJECTED':
      return true;

    default:
      return false;
  }
}

// Admin or Document Action
export const isAdminCanPrint = (status) => {
  switch (_.upperCase (status)) {
    case 'PAID':
      return true;

    case 'PAID':
      return true;

    default:
      return false;
  }
}
export const isAdminCanEdit = (status) => _.upperCase (status) === 'REJECTED';
export const isAdminCanDelete = (status) => {
  switch (_.upperCase (status)) {
    case 'REISSUED':
      return false;

    case 'RELEASED':
      return false;

    default:
      return true;
  }
}


export const initialEdo = {
    shipper_name: "",
    consignee_name: "",

    shipper_email: "",
    consignee_email: "",

    shipper_address: "",
    consignee_address: "",

    notify: "",
    house_bl_number: "",

    notify_address: "",
    number_of_quantity: "",

    mbl_number: "",
    house_bl_date: "",

    arrival_date: "",
    place_of_receipt: "",

    container_seal_number: "",
    ocean_vessel: "",

    port_of_loading: "",
    voyage_number: "",

    final_destination: "",
    port_of_discharges: "",

    gross_weight: "",
    package: "",

    number_of_package: "",
    measurment: "",

    description_of_goods: "",
    marks_and_number: "",
}
