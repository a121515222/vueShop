<script setup>
const props = defineProps(['pagination']);
const emits = defineEmits(['sendPage']);
function sendPage(page){
  emits('sendPage', page);
}
</script>
<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination">
      <li class="page-item" :class="{disabled: !pagination?.has_pre}">
        <a class="page-link" href="#" aria-label="Previous"
        @click.prevent="sendPage(pagination.current_page - 1)" >
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      <li class="page-item"
      v-for="p in pagination?.total_pages"
      :key="p + 'page'"
      :class="{active: p === pagination.current_page}">
        <a class="page-link"  href="#"
        @click.prevent="sendPage(p)"
        >
          {{p}}
        </a>
      </li>
      <li class="page-item" :class="{disabled: !pagination?.has_next}">
        <a class="page-link" href="#" aria-label="Next"
        @click.prevent="sendPage(pagination.current_page + 1)">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    </ul>
  </nav>
</template>


