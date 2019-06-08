<template>
  <div class="content">
    <el-row>
      <div class="reservations" v-if="keyForDisplay == 1">
        <el-col :span="24">
          <RackComponent/>
        </el-col>
      </div>
    </el-row>
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