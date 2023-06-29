<template>
  <ion-page class="newgroup-page">
    <ion-header class="ion-no-border">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="tabs/tab3" mode="ios" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>
          <h3>Nuevo grupo</h3>
          <p>Agrega participantes</p>
        </ion-title>
        <ion-buttons slot="end">
          <ion-button solt="icon-only" @click="toggleSearch">
            <ion-icon aria-hidden="true" :icon="searchOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <div class="avatar-list" v-if="selectedList.length > 0">
        <div class="avatar-holder ion-text-center" v-for="(group, index) in selectedList" :key="index" @click="toggleSelection(group)">
          <ion-avatar>
            <img :src="group.avatar" alt="">
          </ion-avatar>
          <h6>{{ group.name }}</h6>
          <div class="btn ion-activatable flex al-center jc-center ripple-parent">
            <ion-icon aria-hidden="true" :icon="close" />
            <ion-ripple-effect type="bounded"></ion-ripple-effect>
          </div>
        </div>
      </div>

      <ion-searchbar v-show="showSearch" v-model="searchQuery" placeholder="Search" @ionInput="handleInput($event)"></ion-searchbar>
   


      <div class="the-list">
        <ion-item v-for="(group, index) in displayedGroupList" :key="index" @click="toggleSelection(group)">
          <ion-avatar slot="start">
            <img :src="group.avatar" alt="">
          </ion-avatar>
          <ion-label>
            <!-- <ion-icon aria-hidden="true" :icon="call" v-if="group.selected" /> -->
            <h3>{{ group.name }} </h3>
            <p>{{ group.message }}</p>
          </ion-label>
         
        </ion-item>
      </div>
     <ion-fab slot="fixed" vertical="bottom" horizontal="end" @click="goNew">
      <ion-fab-button >
        <ion-icon aria-hidden="true" :icon="arrowForward" />
      </ion-fab-button>
    </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script  setup lang="ts">
import { IonPage, IonHeader, IonToolbar } from '@ionic/vue';
import { arrowForward, call, close, searchOutline, } from 'ionicons/icons';
import './NewGroup1Page.scss';
import { useRouter } from 'vue-router';
import { computed, ref } from 'vue';

interface Group {
  avatar: string;
  name: string;
  message: string;
  selected: boolean;
}


const router = useRouter();

const showSearch = ref(false);


const groupList = ref([
  {
    avatar: 'assets/imgs/user.png',
    name: 'Aaaaaaaa',
    message: 'aaaaaaaa',
    selected: false
  },
  {
    avatar: 'assets/imgs/man.png',
    name: 'Bbbbbbbbbb',
    message: 'bbbbbbbb',
    selected: false
  },
  {
    avatar: 'assets/imgs/bg.png',
    name: 'Ccccccccc',
    message: 'ccccccccccc',
    selected: false

  },
  {
    avatar: 'assets/imgs/img.png',
    name: 'Ddddddddd',
    message: 'ddddddddd',
    selected: false

  }
]);

const displayedGroupList = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (query === '') {
    return groupList.value;
  } else {
    return groupList.value.filter((group) =>
      group.name.toLowerCase().includes(query)
    );
  }
});

const selectedList = ref([] as {
  avatar: string;
  name: string;
  message: string;
  selected: boolean;
}[]);

const searchQuery = ref('');


const filteredGroupList = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (query === '') {
    return groupList.value;
  } else {
    return groupList.value.filter((group) =>
      group.name.toLowerCase().includes(query)
    );
  }
});
const toggleSelection = (group: Group) => {
  if (group.selected) {
    selectedList.value = selectedList.value.filter((item) => item !== group);
  } else {
    selectedList.value.push(group);
  }
  
  group.selected = !group.selected;
};

const handleInput = (event: CustomEvent) => {
  const query = event.detail.value;
  searchQuery.value = query;

  if (query.trim() === '') {
    showSearch.value = false;
  } else {
    showSearch.value = true;
  }
  console.log(searchQuery.value);
};

const toggleSearch = () => {
  showSearch.value = !showSearch.value;
};


const goNew =()  => {
     router.replace('/newgroup');
   }

</script>
