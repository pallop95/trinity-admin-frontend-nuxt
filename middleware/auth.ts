export default function (context: any) {
  // console.log('[Middleware] Just Auth');
  if (!context.store.getters['auths/isAuthenticated']) {
    context.redirect('/login')
  }
}
