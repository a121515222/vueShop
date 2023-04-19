<script setup>
import Wall from '../../components/front/PictureWall.vue'
import { useRouter } from 'vue-router'
const router = useRouter();
function goHomePage(){
  router.push('/');
}
</script>
<template>
  <div class="container-fluid px-0 position-relative">
    <a class="text-white text-nowrap fz-1 position-absolute top-50 start-50 translate-middle" href="#"
    @click.prevent="goHomePage">
      <h2>迷路了嗎?點我帶你回家</h2>
    </a>
    <img src="https://storage.googleapis.com/vue-course-api.appspot.com/chun-chia/1652260099287.jpg?GoogleAccessId=firebase-adminsdk-zzty7%40vue-course-api.iam.gserviceaccount.com&Expires=1742169600&Signature=ZRPB2H%2BL4eMyzETsJo6S9hxSXmiZMwWFS7r9OW5dJ%2BaAFtE59RzAr50pO1rVS3PvUeKaPH4U6sUHlXOzHAJxpBYOgg3rHfmMuyjlg4qUwD%2FS1GhVzxGxfu%2BRmhFRnJFSMjgyvI7Zcx0g3zpvxvgSDWGxO3uSuSYUqOHUKdnvRzvE%2FbYF0iJN82lxr9UG9vcl9O0TNIlLf%2F%2FCFxAqsKTDvNUmumsoH3cVaI8XutbqO%2FMqqN0txbvbKZqT0t%2Bm1c%2FOM78S5O5Ggbksc3k8POKqWBvV7N%2F8MwhD57KgKBGjTw8qtrAxmgvduEaFO%2B8M3CqIEIK0Jw83Md1LHUIwi9I5wA%3D%3D"
    style="max-height:400px; width:100% ;object-fit:cover; object-position:50% 75% ;"
    alt="dogPicture">
  </div>
  <Wall/>
</template>


