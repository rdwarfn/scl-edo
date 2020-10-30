
export default function ({ $axios }) {
  $axios.setBaseURL('https://cors-anywhere.herokuapp.com/https://api-scl.herokuapp.com/');
  $axios.setHeader('Content-Type', 'application/x-www-form-urlencoded', [
    'post', 'put'
  ]);

  // $axios.onError(error => {
  //   console.log('onError', error.response);
  // });

  // $axios.onRequestError(err => {
  //   console.log('onRequestError', err.response);
  // });

  // $axios.onRequestError(err => {
  //   console.log('onResponseError', err.response);
  // })
}
