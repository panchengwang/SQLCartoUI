const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'login',
        component: () => import('pages/LoginPage.vue'),
      },
      { path: '', name: 'application', component: () => import('pages/ApplicationPage.vue') },

      {
        path: '/:type',
        name: 'register_or_reset_password',
        props: true,
        component: () => import('pages/RegisterOrResetPasswordPage.vue'),
      },
      {
        path: '',
        name: 'reset_password',
        component: () => import('pages/ResetPasswordPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
