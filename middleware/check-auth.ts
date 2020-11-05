export default function (context: any) {
  // console.log('[Middleware] Check Auth');
  context.store.dispatch('auths/initAuth')
}
