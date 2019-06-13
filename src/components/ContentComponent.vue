<template>
  <div class="content">
    <el-main>
      <div class="reservations" v-if="keyForDisplay == 1">
          <RackComponent/>
      </div>
    </el-main>
  </div>
</template>

<script>
import RackComponent from './RackComponent.vue';

export default {
  name: 'ContentComponent',
  components: {
    RackComponent
  },
  props: [
    'keyForDisplay'
  ],
  created() {

  }
}
</script>

<style>
.content, .reservations {
  background-color: #ECEEF7;
  background-color: white;
}
.el-card, .el-message {
    border-radius: 6px !important;
}
</style>

