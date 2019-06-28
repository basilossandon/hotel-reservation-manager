<template>
  <div class="content">
    <el-main class="main-no-padding">
      <div class="reservations" v-if="keyForDisplay == 1">
          <RackComponent/>
      </div>
      <div class="register" v-if="keyForDisplay == 2">
          <RegisterComponent/>
      </div>
      <div class="services" v-if="keyForDisplay == 3">
          <ServiceComponent/>
      </div>
    </el-main>
  </div>
</template>

<script>
import RackComponent from './RackComponent.vue';
import RegisterComponent from './RegisterComponent.vue';
import ServiceComponent from './ServiceComponent.vue';

export default {
  name: 'ContentComponent',
  components: {
    RackComponent,
    RegisterComponent,
    ServiceComponent
  },
  props: [
    'keyForDisplay'
  ],
  data() {
    return {
      lastReservation: null
    }
  },
  created() {

  },
}
</script>

<style>
.content, .reservations {
  background-color: #f9f9f9;
}
.el-card, .el-message {
    border-radius: 6px !important;
}
.main-no-padding {
  padding-bottom: 0px;
}
</style>

