import Cookies from 'js-cookie';

export default defineNuxtRouteMiddleware(() => {
  const token = Cookies.get('access_token'); // or your actual cookie key

  if (token) {
    return navigateTo('/'); // or '/dashboard', etc.
  }
});
