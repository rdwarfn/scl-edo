
export default function ({ $axios }) {
  $axios.setBaseURL('https://cors-anywhere.herokuapp.com/https://api-scl.herokuapp.com/');
  $axios.setHeader('Content-Type', 'application/x-www-form-urlencoded', [
    'post', 'put'
  ]);
}
