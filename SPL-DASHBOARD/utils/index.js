import _ from 'lodash';
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
  }
}