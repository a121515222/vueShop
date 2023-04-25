<script setup>
import BsModal from 'bootstrap/js/dist/modal'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { onMounted, ref, watch } from 'vue';
import apiUploadPicture from '../../assets/adminAPI/apiAdminUploadPicture.js'
import { useInfoStore } from '../../stores/useInfoStore';

const { pictureUpload } = apiUploadPicture;
const { addMessage } = useInfoStore();


const props = defineProps(['inputProduct', 'isNew']);
const emits = defineEmits(['sendInputData']);
const productAdminModalRef = ref(null);
const upLoadFileRef = ref(null);
const bsModal = ref(null);
const isLoading = ref(false);

const editor = ClassicEditor;
const editorConfig = {
  toolbar: ['heading', 'bold', 'italic', '|', 'link']
}

const inputData = ref({
  title: '',
  category: '',
  origin_price: null,
  price: null,
  unit: '',
  description: '',
  content: '',
  is_enabled: '',
  imageUrl: '',
  imagesUrl: []
});

defineExpose({
  modalOpen,
  modalClose
});

watch(()=>props.inputProduct, (newValue, oldValue)=>{
  inputData.value = newValue;
},{deep:true})

function modalOpen(){
  bsModal.value.show();
}
function modalClose(){
  bsModal.value.hide();
}
function sendProductInput() {
  emits('sendInputData',inputData.value);
  inputData.value = {
  title: '',
  category: '',
  origin_price: null,
  price: null,
  unit: '',
  description: '',
  content: '',
  is_enabled: '',
  imageUrl: '',
  imagesUrl: []
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
    console.log('test')
    if(inputData.value.imageUrl === '') {
      inputData.value.imageUrl = res.data.imageUrl;
    } else if(inputData.value.imagesUrl.length< 6) {
      inputData.value.imagesUrl.push(res.data.imageUrl);
    }
    isLoading.value = false;
  }
}
function addImg() {
  inputData.value.imagesUrl.push('');
}
function deleteImg() {
  inputData.value.imagesUrl.length === 0 ?   inputData.value.imageUrl = '' : inputData.value.imagesUrl.pop() ;
}
onMounted(()=>{
  bsModal.value = new BsModal(productAdminModalRef.value);
})
</script>
<template>
  <div class="modal fade" id="modalInputData" tabindex="-1"  aria-hidden="true" ref="productAdminModalRef">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">{{isNew?"新增產品":"編輯產品"}}</h5>
          <button class="btn-close" type="button"
          @click="modalClose()">
          </button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-4 my-3">
              <div class="from-group my-3">
                <label class="form-label w-100" for="productImageUrl">
                圖片上傳
                  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"
                  v-if="isLoading"
                  >
                  </span>
                </label>
                <input class="form-control" type="file" name="file-to-upload" ref="upLoadFileRef"
                :disabled="isLoading || inputData.imagesUrl?.length === 5 && inputData.imageUrl !== ''"
                @change="uploadImg"
                :class="{buttonDisabledCursor : isLoading || inputData.imagesUrl?.length === 5 && inputData.imageUrl !== ''}"
                >
              </div>
              <div><img class="img-fluid"
              :src="inputData.imageUrl"
              :alt="inputData.title + 'picture'"
              :title="inputData.title"
              >
              </div>
              <div class="from-group my-3">
                <label class="form-label w-100" for="productImageUrl" >
                  主要產品圖片
                </label>
                <input class="form-control" type="text" id="productImageUrl" placeholder="請輸入主要產品圖片網址"
                v-model.trim.lazy="inputData.imageUrl">
              </div>
              <template v-if="inputData.imageUrl">
                <div class="from-group my-3"
                v-for="(item,index) in inputData.imagesUrl"
                :key="item+1">
                  <p>其他圖片{{index+1}}</p>
                  <img class="img-fluid"
                  :src="item"
                  :alt="inputData.title">
                  <label class="form-label w-100" for="productImageUrl" >其他產品圖片{{index+1}}</label>
                  <input class="form-control" type="text" id="productImageUrl" placeholder="請輸其他產品圖片網址"
                  v-model.trim.lazy="inputData.imagesUrl[index]"
                  >
                </div>
              </template>
              <button class="btn btn-outline-success w-100 d-block my-3"
              v-if="inputData.imageUrl"
              :disabled="inputData.imagesUrl?.length===5"
              :class="{buttonDisabledCursor : inputData.imagesUrl?.length===5}"
              @click="addImg() "
              >
                新增圖片
              </button>
              <button class="btn btn-outline-danger w-100 d-block"
              v-if="inputData.imagesUrl?.length >= 1 || inputData.imageUrl !== ''"
              @click="deleteImg()"
              >
                刪除圖片
              </button>
            </div>
            <div class="col-8 my-3" >
              <div class="from-group my-3">
                <label class="form-label w-100" for="productName" >產品名稱</label>
                <input class="form-control" type="text" id="productName" placeholder="請輸入產品名稱"
                v-model.trim="inputData.title"
                >
              </div>
              <div class="from-group my-3">
                <label class="form-label w-100" for="productCategory" >產品分類</label>
                <input class="form-control" type="text" id="productCategory" placeholder="請輸入產品分類"
                v-model.trim="inputData.category"
                >
              </div>
              <div class="from-group my-3">
                <label class="form-label w-100" for="productContent" >產品內容</label>
                  <input class="form-control" type="text" id="productContent" placeholder="請輸入產品內容"
                  v-model.trim="inputData.content"
                  >
              </div>
              <div class="d-flex gap-2">
                <div class="from-group my-3 w-50">
                  <label class="form-label w-100" for="productOrigin_price" >產品原價</label>
                  <input class="form-control" type="number" id="productOrigin_price" placeholder="請輸入產品原價"
                  min=0
                  v-model.number="inputData.origin_price"
                  >
                </div>
                <div class="from-group my-3 w-50">
                  <label class="form-label w-100" for="productPrice" >產品售價</label>
                  <input class="form-control" type="number" id="productPrice" placeholder="請輸入產品售價"
                  min=0
                  v-model.number="inputData.price"
                  >
                </div>
              </div>
              <div class="d-flex gap-2">
                <div class="from-group my-3 w-50">
                  <label for="is_enabled" class=" w-100" style="margin-bottom: 8px;">產品狀態</label>
                  <select class="form-select" name="productStatus" id="is_enabled"
                  v-model.number="inputData.is_enabled"
                  >
                    <option  value="" disabled >請選擇產品狀態</option>
                    <option  value=0>未上架</option>
                    <option  value=1>已上架</option>
                    <option  value=2>缺貨中</option>
                    <option  value=3>補貨中</option>
                    <option  value=4>促銷中</option>
                    <option  value=5>待下架</option>
                  </select>
                </div>
                <div class="from-group my-3 w-50">
                  <label class="form-label w-100" for="productUnit" >產品單位</label>
                  <input class="form-control" type="text" id="productUnit" placeholder="請輸入產品單位"
                  v-model.trim="inputData.unit"
                  >
                </div>
              </div>
              <div class="from-group my-3">
                <label class="form-label w-100" for="productDescription" >產品描述</label>
                <ckeditor
                  :editor="editor"
                  :config="editorConfig"
                  placeholder= "請輸入文章內容"
                  id="productDescription"
                  v-model="inputData.description"
                  >
                </ckeditor>
              </div>
            </div>
          </div>
        </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" type="button"
            @click="close()"
            >
              關閉
            </button>
            <button class="btn btn-primary" type="button"
            @click="sendProductInput()"
            >
              確定
            </button>
          </div>
      </div>
    </div>
  </div>
</template>


