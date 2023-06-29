import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue';
import AccountPage from '../views/Account/AccountPage.vue';
import ChatPage from '../views/Chat/ChatPage.vue'
import ConfigurationPage from '../views/Configuration/ConfigurationPage.vue';
import ConversationPage from '../views/Conversation/ConversationPage.vue';
import ProfilePage from '../views/Profile/ProfilePage.vue';
import GroupsPage from '../views/Groups/GroupsPage.vue';
import WelcomePage from '../views/Welcome/WelcomePage.vue';
import EnterCodePage from '../views/EnterCode/EnterCodePage.vue';
import EnterPassPage from '../views/EnterPass/EnterPassPage.vue';
import ObtainCodePage from '../views/ObtainCode/ObtainCodePage.vue';
import NewGroupPage from '../views/NewGroup/NewGroupPage.vue';
import NewGroupPage1 from '../views/NewGroup1/NewGroup1Page.vue';
import MainViewGroup from '../views/MainViewGroup/MainViewGroupPage.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/welcome'
  },
  
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/Chat/ChatPage.vue')
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2Page.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/Groups/GroupsPage.vue')
      },
      {
        path: 'tab4',
        component: () => import('@/views/Configuration/ConfigurationPage.vue')
      }
    ]
  },
  {
    path: '/account',
    name: 'account',
    component: AccountPage
  },
  {
    path: '/chat',
    name: 'chat',
    component: ChatPage
  },
  {
    path: '/conversation',
    name: 'conversation',
    component: ConversationPage
  },

  {
    path: '/configuration',
    name: 'configuration',
    component: ConfigurationPage
  },
  {
    path: '/entercode',
    name: 'entercode',
    component:EnterCodePage
  },

  {
    path: '/enterpass',
    name: 'enterpass',
    component:EnterPassPage
  },

  {
    path: '/groups',
    name: 'groups',
    component: GroupsPage
  },
  {
    path: '/newgroup',
    name: 'newgroup',
    component: NewGroupPage
  },
  
  {
    path: '/newgroup1',
    name: 'newgroup1',
    component: NewGroupPage1
  },
  
  {
    path: '/mainviewgroup',
    name: 'mainviewgroup',
    component: MainViewGroup
  },
  {
    path: '/obtaincode',
    name: 'obtaincode',
    component: ObtainCodePage
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfilePage
  },
  {
    path: '/welcome',
    name: 'welcome',
    component: WelcomePage
  },
  
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
