import Cookies from 'js-cookie';

export default defineNuxtRouteMiddleware(() => {
  const token = Cookies.get('access_token'); 

  if (token) {
    return navigateTo('/'); 
  }
});
