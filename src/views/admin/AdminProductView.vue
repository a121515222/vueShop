<script setup>
import PaginationComponent from '../../components/PaginationComponent.vue'
import AdminProductModal from '../../components/admin/AdminProductModal.vue'
import { mapActions } from 'pinia'
import apiAdminProducts from '../../assets/adminAPI/apiAdminProduct.js'
import { onMounted, ref } from 'vue';
import { useInfoStore } from '../../stores/useInfoStore'

const { getAdminProducts, addAdminProduct, editAdminProduct, deleteAdminProduct } = apiAdminProducts;

const infoStore = useInfoStore();
const { addMessage } = infoStore;

const isLoading = ref(false);
const products = ref([]);
const productTemp = ref({});
const pageInfo = ref({});
const isNew = ref(false);
const postId = ref('');
const inputProductOut = ref({
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


async function getProducts(page) {
  isLoading.value = true;
  const res = await getAdminProducts(page);
  products.value = res.data.products;
  pageInfo.value = res.data.pagination;
  isLoading.value = false;
}
async function changeAdminProduct(product) {
  if(isNew.value) {
    const res = await addAdminProduct({ data: product });
    isNew.value = false;
    addMessage(
      {
        title: `${res.data?.success === true? '新增商品成功':'新增商品失敗'}`,
        style: `${res.data?.success === true? 'success':'danger'}`,
        content: `${res.data?.success === true? res.data.message : res.response.data.message.join()}`
      }
    );
  } else{
    const res = await editAdminProduct(postId.value ,{ data: product });
    addMessage(
      {
        title: '編輯商品結果',
        style: `${res.data?.success === true? 'success':'danger'}`,
        content: `${res.data?.success === true? res.data.message : res.response.data.message}`
      }
    );
    postId.value = '';
  }
  inputProductOut.value = {
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
  getProducts();
  adminProductModalRef.value.modalClose();

}
async function deleteProduct(id) {
  isLoading.value = true;
  const res = await deleteAdminProduct(id);
  addMessage(
      {
        title: '刪除商品結果',
        style: `${res.data?.success === true? 'success':'danger'}`,
        content: `${res.data?.success === true? res.data.message : res.response.data.message}`
      }
    );
  getProducts();
}

function openAdminModal(product) {
  adminProductModalRef.value.modalOpen();
  if( isNew.value !== true) {
    Object.keys(inputProductOut.value).forEach(key => {
      inputProductOut.value[key] = product[key];
    });
    console.log(inputProductOut.value);
  } else {
    adminProductModalRef.value.modalOpen();
  }
}
function showProduct (product) {
  productTemp.value = product;
}

function productStatus (data) {
  switch (data) {
    case 0: 
    return '未上架'
    case 1: 
    return '已上架'
    case 2: 
    return '缺貨中'
    case 3: 
    return '補貨中'
    case 4:
    return '促銷中'
    case 5: 
    return '待下架'
  };
}
const adminProductModalRef = ref(null);

onMounted(()=>{
  getProducts();
})
</script>

<template>
  <div class="container">
    <VueLoading :active="isLoading" :z-index="1060"/>
    <div class="row py-5">
      <h2>產品列表</h2>
      <div class="d-flex justify-content-end">
        <!-- Button trigger modal -->
        <button class="btn btn-primary" type="button"
        @click="isNew = true;openAdminModal();">
          增加商品
        </button>
      </div>
      <div class="col-12 py-3">
        <div class="border rounded">
          <table class="table table-hover ">
            <tr>
              <th>產品名稱</th>
              <th>原價</th>
              <th>售價</th>
              <th>單位</th>
              <th>是否啟用</th>
              <th>查看細節</th>
              <th></th>
              <th></th>
            </tr>
            <tr v-for="(item,index) in products" :key="item.id+index">
              <td>{{item.title}}</td>
              <td>{{item.origin_price}}</td>
              <td>{{item.price}}</td>
              <td>{{item.unit}}</td>
              <td>{{productStatus(item.is_enabled)}}
              </td>
              <td>
                <button class="btn btn-outline-primary" type="button"
                :data-index="index"
                @click="showProduct(item)"
                >
                  查看細節
                </button>
              </td>
              <td>
                <button class="btn btn-outline-success"  type="button"
                :data-index="index"
                @click="postId = item.id;isNew= false;openAdminModal(item);"
                :disabled="isLoading === true"
                :class="{'buttonDisabledCursor' : isLoading === true}">
                  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"
                  v-if="isLoading"></span>
                  編輯
                </button>
              </td>
              <td>
                <button class="btn btn-outline-danger" type="button"
                :disabled="isLoading === true"
                :class="{'buttonDisabledCursor' : isLoading === true}"
                @click="; deleteProduct(item.id);"
                >
                  <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"
                  v-if="isLoading"></span>
                  刪除
                </button>
              </td>
            </tr>
          </table>
          <p class="px-1">一共有{{products.length}}項產品</p>
        </div>
        <PaginationComponent :pagination="pageInfo" @send-page="getProducts"/>
      </div>
      <h2>單一產品細節</h2>
      <div class="col-8 mx-auto py-3">
        <template v-if="productTemp.id">
          <div class="card">
            <div class="card-body">
              <div class="img">
                <img class="img-fluid"
                :src="productTemp.imageUrl"
                :alt="productTemp.title">
              </div>
              <div class v-on="d-flex">
                <p>
                  {{productTemp.title}}<span class="badge bg-primary">{{productTemp.category}}</span>
                </p>
              </div>
              <h3>商品描述:</h3>
              <p v-html="productTemp.description"></p>
              <p>商品內容:{{productTemp.content}}</p>
              <div class="d-flex">
                <span>{{productTemp.price}}</span>
                <span class="line-through px-2 fw-light text-black-50">{{productTemp.origin_price}}</span>
                <span>元/{{productTemp.unit}}</span>
              </div>
            </div>
          </div>
          <div class="d-flex gap-3 py-3">
            <div class="w-25"
            v-for="(img,index) in productTemp.imagesUrl"
            :key="img+index">
              <img :src="img" :alt="productTemp.title">
            </div>
          </div>
        </template>
        <p v-else>請選擇一個商品查看</p>
      </div>
    </div>
    <!-- Modal -->
    <AdminProductModal  ref="adminProductModalRef"
    :input-product="inputProductOut"
    :is-new="isNew"
    @send-input-data="changeAdminProduct"
    />
  </div>
</template>


