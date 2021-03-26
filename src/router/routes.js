import Channels from 'pages/Home/Channels';
import Chats from 'pages/Home/Chats';
import Contacts from 'pages/Home/Contacts';
import Groups from 'pages/Home/Groups';
import Search from 'pages/Home/Search';

import Error404 from 'pages/Error404';
import Home from 'pages/Home/Index';
import Auth from 'pages/Auth';

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'init', redirect: 'login' },
      { path: 'login', name: 'Login', component: Auth },
      {
        path: 'home',
        name: 'Home',
        component: Home,
        children: [
          { path: 'chat', component: Chats },
          { path: 'groups', component: Groups },
          { path: 'contacts', component: Contacts },
          { path: 'channels', component: Channels },
          { path: 'search', component: Search }
        ]
      }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: Error404
  }
];

export default routes;
