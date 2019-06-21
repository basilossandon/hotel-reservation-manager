<template>
  <div class="content">
    <el-main class="main-no-padding">
      <div class="reservations" v-if="keyForDisplay == 1">
          <RackComponent/>
      </div>
      <div class="Registro" v-if="keyForDisplay == 2">
          <Registro/>
      </div>
    </el-main>
  </div>
</template>

<script>
import RackComponent from './RackComponent.vue';
import Registro from './Registro.vue';

export default {
  name: 'ContentComponent',
  components: {
    RackComponent,
    Registro
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
  // methods: {
  //   handleDirectReservation(reservation) {
  //     this.lastReservation = reservation;
  //   }
  // }
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

