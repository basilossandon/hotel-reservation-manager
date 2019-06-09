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
