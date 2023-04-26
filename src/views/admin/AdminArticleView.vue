<script setup>
import PaginationComponent from '../../components/PaginationComponent.vue'
import AdminArticleModal from '../../components/admin/AdminArticleModal.vue'
import readTime from '../../assets/methods/ReadTime.js'
import apiAdminArticles from '../../assets/adminAPI/apiAdminArticle.js'
import { onMounted, ref } from 'vue'
import { useInfoStore } from '../../stores/useInfoStore'

const { getAdminArticles, getAdminSingleArticles, addAdminArticle, editAdminArticle, deleteAdminArticle } = apiAdminArticles;
// import toastStore from '@/stores/toast'

const { getTime:showTime } = readTime;

const infoStore = useInfoStore();
const { addMessage } = infoStore;

const articles = ref([]);
const tempArticle = ref(
  {
    title: '',
    description: '',
    image: '',
    tag: [],
    create_at: null,
    author: '',
    isPublic: false,
    content: ''
  }
);
const pagination = ref({});
const isLoading = ref(false);
const postId = ref('');
const isNew = ref(false);
const adminArticleModalRef = ref(null);
async function getArticles() {
  const res = await getAdminArticles();
  articles.value = res.data.articles;
  pagination.value = res.data.pagination
  console.log(articles.value)
}
function articleStatus (info) {
  return info === false? '不公開' : '公開'
}
function openAdminArticleModal() {
  adminArticleModalRef.value.modalOpen();
}
function closeAdminArticleModal() {
  adminArticleModalRef.value.modalClose();
}
async function changeAdminArticle(article) {
  article.create_at = Math.floor(new Date(article.create_at) / 1000);
  console.log('sendArticle',article);
  isLoading.value = true;
  if(isNew.value) {
    const res = await addAdminArticle({data: article});
    isLoading.value = false;
    addMessage(
      {
        title: `${res.data?.success === true? '新增文章成功':'新增文章失敗'}`,
        style: `${res.data?.success === true? 'success':'danger'}`,
        content: `${res.data?.success === true? res.data.message : res.response.data.message.join()}`
      }
    );
    isNew.value = false
  } else {
    const res = await editAdminArticle(postId.value, {data: article});
    isLoading.value = false;
    addMessage(
      {
        title: '編輯文章結果',
        style: `${res.data?.success === true? 'success':'danger'}`,
        content: `${res.data?.success === true? res.data.message : res.response.data.message}`
      }
    );
    postId.value = '';
  }
  getArticles();
  tempArticle.value = {
    title: '',
    description: '',
    image: '',
    tag: [],
    create_at: null,
    author: '',
    isPublic: false,
    content: ''
  }
}
async function getSingleArticle(id) {
  isLoading.value = true;
  const res = await getAdminSingleArticles(id);
  tempArticle.value = res.data.article;
  console.log('single',tempArticle.value)
  openAdminArticleModal();
  isLoading.value = false;
}
async function deleteArticle(id) {
  const checked = confirm('確定刪除文章?')
  isLoading.value = true;
  if(checked) {
    const res = await deleteAdminArticle(id);
  console.log(res)
  addMessage(
    {
    title: '刪除文章結果',
    style: `${res.data?.success === true? 'success':'danger'}`,
    content: `${res.data?.success === true? res.data.message : res.response.data.message}`
    }
  );
  getArticles();
  }
  
  isLoading.value = false;
}
onMounted(()=>{
  getArticles();
})
</script>


<template>
  <div class="container">
    <VueLoading :active="isLoadingPage" :z-index="1060"/>
    <div class="row">
      <div class="from-group d-flex justify-content-end">
        <button class="btn btn-primary" type="button"
        @click="isNew = true; openAdminArticleModal()">
          新增文章
        </button>
      </div>
      <div class="col-12">
        <div class="card">
          <div class="card-header bg-primary text-light">
            <h3>文章列表</h3>
          </div>
          <div class="card-body">
            <table class="table">
              <thead>
                <tr>
                  <th>發布日期</th>
                  <th>文章標題</th>
                  <th>作者</th>
                  <th>是否公開</th>
                  <th>標籤</th>
                  <th>編輯與詳細內容</th>
                  <th>刪除</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for= "(item) in articles" :key="item.id">
                  <td>{{showTime(item.create_at | 0)}}</td>
                  <td>{{item.title}}</td>
                  <td>{{item.author}}</td>
                  <td :class="{ 'text-success': item.isPublic, 'text-danger': item.isPublic === false? true: false}">
                    {{articleStatus(item.isPublic)}}
                  </td>
                  <td><span v-for="(i, index) in item.tag" :key="i + index" class="badge bg-primary mx-1">{{i}}</span></td>
                  <td>
                    <button class="btn btn-outline-secondary" type="button"
                    @click="postId = item.id ; isNew = false ; getSingleArticle(item.id)">
                      <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      編輯文章
                    </button>
                </td>
                  <td>
                    <button  class="btn btn-outline-dark" type="button"
                    @click="postId = item.id ; deleteArticle(item.id)">
                      <span v-if="isLoading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      刪除文章
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <PaginationComponent :pagination= "pagination"/>
      </div>
    </div>
  <!-- Modal -->
    <AdminArticleModal ref="adminArticleModalRef"
    :input-article="tempArticle"
    :is-new="isNew"
    @send-article="changeAdminArticle"
    />
  </div>
</template>

