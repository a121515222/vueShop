<script setup>
import BsModal from 'bootstrap/js/dist/modal';
import SwitchClick from '../SwitchClick.vue';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { onMounted, ref, watch } from 'vue';
import apiUploadPicture from '../../assets/adminAPI/apiAdminUploadPicture.js';
import { useInfoStore } from '../../stores/useInfoStore';
defineExpose({
  modalOpen,
  modalClose
});
const upLoadFileRef = ref(null);
const isLoading = ref(false);
const { pictureUpload } = apiUploadPicture;
const { addMessage } = useInfoStore();
const props = defineProps(['inputArticle', 'isNew']);
const emits = defineEmits(['sendArticle']);
const articleAdminModalRef = ref(null);
const bsModal = ref('');
const article = ref({
  title: '',
  description: '',
  image: '',
  tag: [],
  create_at: getTime(),
  author: '',
  isPublic: false,
  content: ''
});
const editor = ClassicEditor;
const editorConfig = {toolbar: ['heading', 'bold', 'italic', '|', 'link']};
const tempTag = ref('');

watch(()=>props.inputArticle, (newValue, _)=>{
  article.value = newValue;
  if(newValue.create_at === null){
    article.value.create_at = getTime();
  } else if(typeof newValue.create_at === 'number') {
    article.value.create_at = getTime(article.value.create_at);
  }
},{deep:true});

watch(article.value.create_at, (newValue, oldValue)=>{
  if(newValue.create_at === null){
    article.value.create_at = getTime();
  } else if(typeof newValue.create_at === 'number') {
    article.value.create_at = getTime(article.value.create_at);
  }
},{deep:true})


function modalOpen(){
  bsModal.value.show();
}
function modalClose(){
  bsModal.value.hide();
  article.value = {
    title: '',
    description: '',
    image: '',
    tag: [],
    create_at: getTime(),
    author: '',
    isPublic: false,
    content: ''
  }
}
function sendArticle() {
  emits('sendArticle', article.value);
  modalClose();
}
function getActive (data) {
  if (data === 1) {
    article.value.isPublic = true
  } else if (data === 0) {
    article.value.isPublic = false
  }
}
function addTag() {
  if (article.value.tag === '') {
    article.value.tag = [];
    article.value.tag.push(tempTag.value)
  } else {
    article.value.tag.push(tempTag.value)
  }
  tempTag.value = '';
}
function deleteTag(index) {
  this.article.value.tag.splice(index, 1)
}
function getTime(time) {
  console.log('getTime',time)
  switch(typeof time){
    case 'undefined':
    case 'null':
      return new Date().toISOString().split('T')[0]
    case 'number':
      return new Date(time * 1000).toISOString().split('T')[0]  
  }
}
async function uploadImg() {
  isLoading.value = true;
  const uploadFile = upLoadFileRef.value.files[0];
  const formData = new FormData();
  formData.append('file-to-upload', uploadFile);
  const res = await pictureUpload(formData);
  addMessage(
    {
      title: '上傳圖片結果',
      style: `${res.data?.success === true? 'success':'danger'}`,
      content: `${res.data?.success === true? '已成功上傳': res.response.data.message}`
    }
  );
  if(res.data.success) {
    if(article.value.image === '') {
      article.value.image = res.data.imageUrl;
    }
    isLoading.value = false;
  }
}
onMounted(()=>{
  bsModal.value = new BsModal(articleAdminModalRef.value);
})
</script>
<template>
  <div class="modal fade" ref="articleAdminModalRef" id="articleModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" >{{isNew === true? '新增文章':'編輯文章'}}</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="modalClose()"></button>
        </div>
        <div class="modal-body">
          <div class="row row-cols-2">
            <div class="from-group py-2">
              <label for="articleTitle" class="form-label">文章標題</label>
              <input class="form-control" type="text" id="articleTitle" placeholder="請輸入文章標題"
              v-model="article.title" >
            </div>
            <div class="from-group py-2">
              <label for="articleDescription" class="form-label">文章描述</label>
              <input class="form-control" type="text" id="articleDescription" placeholder="請輸入文章描述"
              v-model="article.description">
            </div>
            <div class="from-group py-2">
              <label for="articleAuthor" class="form-label">文章作者</label>
              <input  class="form-control" type="text" id="articleAuthor" placeholder="請輸入作者"
              v-model="article.author">
            </div>
            <div class="from-group py-2">
              <label for="articleDate" class="form-label">文章日期</label>
              <input class="form-control" type="date" id="articleDate" placeholder="請選擇文章日期"
              v-model="article.create_at">
            </div>
            <div class="from-group py-2">
              <label for="articleImg" class="form-label">文章圖片</label>
              <input class="form-control" type="text" id="articleImg" placeholder="請輸入圖片網址"
              v-model="article.image">
            </div>
            <div class="from-group py-2">
              <label for="articleImg" class="form-label">上傳圖片</label>
              <input class="form-control" type="file" id="uploadImg" ref="upLoadFileRef"
              :disabled="article?.image !== ''"
              :class="{buttonDisabledCursor : article?.image !== ''}"
              @change="uploadImg"
              >
            </div>
            <div class="from-group py-2 d-flex gap-3">
              <label for="articleIsEnable" class="form-label">文章發布</label>
              <SwitchClick
              :info="article.id"
              :enabled="article.isPublic === true? 1:0"
              @send-enable="getActive"/>
            </div>
            <div class="from-group py-2">
              <img class="img-fluid"
              :src= "article.image"
              :alt="article.title">
            </div>
          </div>
          <div class="row pt-2">
            <div class="from-group d-flex gap-2">
              <label class="form-label">文章標籤</label>
              <div class="input-group w-15"
              v-for="(item, index) in article.tag"
              :key="index">
                <input class="form-control" type="text"
                v-model= "article.tag[index]">
                <button class="input-group-text" type="button"
                @click="deleteTag(index)"
                :disabled="isLoading === true"
                :class="{'buttonDisabledCursor': isLoading === true}">
                  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"
                  v-if="isLoading === true">
                  </span>
                  刪除
                </button>
              </div>
              <input class="input-group w-10" type="text" placeholder="請輸入標籤"
              v-if="article.tag?.length < 5"
              v-model="tempTag">
              <button class="btn btn-outline-primary" type="button"
              v-if="article.tag?.length < 5"
              @click="addTag">
                增加標籤
              </button>
            </div>
          </div>
          <div class="row pt-2">
            <div class="from-group">
              <label class="form-label" for="articleContent">文章內容</label>
              <ckeditor placeholder= "請輸入文章內容" id="articleContent"
              :editor="editor"
              :config="editorConfig"
              v-model="article.content">
              </ckeditor>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button  class="btn btn-secondary" type="button"
          @click="closeModal()">
            關閉
          </button>
          <button  class="btn btn-primary" type="button"
          @click="sendArticle">
            確定
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


