<template>
<div class="rack">
    <el-card class="box-card" id="rack-box" v-loading="!rackDataReady">
      <div slot="header" class="clearfix reservations-form__title">
        Rack
      </div>
      <el-row>
        <el-col :span="2">
          <div class="rackSideBar">
            <div class="title">
              Habitacion
              <div class="roomCodes" id="roomCodes" v-on:scroll="syncScrollsBySide()">
              <el-row>
                <el-col class="roomCode" v-bind:id="index" v-bind:key="index" v-for="(room, index) in rooms">
                  <p>
                    {{room.id}}
                  </p>
                </el-col>
              </el-row>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="22">
          <div class="scrolling-wrapper" v-on:scroll="checkLimits()" id="scrollable">
            <div class="date" v-bind:id="index" v-bind:key="index" v-for="(day, index) in days">
              {{format(day)}}
              <div class="roomStates" :id="day" v-on:scroll="syncScrollsByRack(day)">
                <el-row>
                  <el-col class="roomState" v-bind:id="index" v-bind:key="index" v-for="(room, index) in rooms">
                    <p class="busyText" v-if="isBusy(room, day)">ocupada</p>
                    <p class="freeText" v-else>vacante</p>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>
    <ReservationComponent :rackRooms="rooms" :rackReservations="reservations" :rackDictionary="dictionary" :rackReady="rackDataReady" @newReservation="handleReservation"/>
</div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import "moment/locale/es";
import ReservationComponent from './ReservationComponent.vue'

  export default {
    props: [

    ],
    data() {
      return {
          len: 0,
          rackDataReady: false,
          firstItem: 0,
          lastItem: 9,
          returnScroll: 0,
          days: [],
          reservations: [],
          rooms: [],
          dictionary: {}
      }
    },
    components: {
      ReservationComponent
    },
    created() {
      this.setDefaultDaysRack();
      this.updateRackData();
    },
    mounted() {
        document.getElementById('scrollable').scrollLeft =  690;
    },
    methods: {
      handleReservation(reservationData) {
        this.reservations.push(reservationData);
        this.updateDictionary();
      },
      updateRackData() {
          axios.get('http://157.230.12.110:8080/api/rooms').then(response => {
            // this.rooms = response.data
            this.rooms = [
              {"id":"1","capacity":"2","price":"60000","room_type_id":"1","room_id":"0"},
              {"id":"2","capacity":"3","price":"80000","room_type_id":"2","room_id":"0"},
              {"id":"3","capacity":"2","price":"60000","room_type_id":"1","room_id":"0"},
              {"id":"4","capacity":"3","price":"80000","room_type_id":"2","room_id":"0"},
              {"id":"5","capacity":"3","price":"80000","room_type_id":"2","room_id":"0"},
              {"id":"6","capacity":"4","price":"95000","room_type_id":"3","room_id":"0"},
              {"id":"7","capacity":"5","price":"20000","room_type_id":"1","room_id":"0"},
              {"id":"8","capacity":"5","price":"20000","room_type_id":"1","room_id":"0"},
              {"id":"9","capacity":"10","price":"15000","room_type_id":"3","room_id":"0"},
              {"id":"10","capacity":"10","price":"15000","room_type_id":"3","room_id":"0"},
              {"id":"11","capacity":"10","price":"15000","room_type_id":"3","room_id":"0"}
            ];
            axios.get('http://157.230.12.110:8080/api/reservations')
            .then(response => {
              // this.reservations = response.data
              this.reservations = [
                {"id":"83","start":"2019-06-11 04:00:00","end":"2019-06-12 04:00:00","final_price":"0","code":"YROWFMFAPI","document_number":"51266633","checkin_name":"Sebastián Piñera","room_id":"3","type":null,"reservation_id":"0"},
                {"id":"82","start":"2019-06-10 04:00:00","end":"2019-06-10 04:00:00","final_price":"0","code":"PNLLSXY954","document_number":"197535466","checkin_name":"Leandro Pizarro","room_id":"5","type":null,"reservation_id":"0"},
                {"id":"81","start":"2019-06-08 04:00:00","end":"2019-06-08 04:00:00","final_price":"0","code":"59U1HVJDW3","document_number":"197535466","checkin_name":"Gabriel Gaete","room_id":"5","type":null,"reservation_id":"0"},
                {"id":"80","start":"2019-06-07 04:00:00","end":"2019-06-07 04:00:00","final_price":"0","code":"ODJZSJG1F7","document_number":"223387020","checkin_name":"Alcides Quispe","room_id":"4","type":null,"reservation_id":"0"},
                {"id":"79","start":"2019-06-09 04:00:00","end":"2019-06-09 04:00:00","final_price":"0","code":"VSF1LTLYV7","document_number":"190692817","checkin_name":"Bastián Vera","room_id":"3","type":null,"reservation_id":"0"},
                {"id":"78","start":"2019-06-10 04:00:00","end":"2019-06-10 04:00:00","final_price":"0","code":"F83O6E15WG","document_number":"180400581","checkin_name":"Brian Jorquera","room_id":"2","type":null,"reservation_id":"0"},
                {"id":"77","start":"2019-06-08 04:00:00","end":"2019-06-08 04:00:00","final_price":"0","code":"KZN7ISJW11","document_number":"192642264","checkin_name":"Leandro Pizarro","room_id":"1","type":null,"reservation_id":"0"},
              ];
              this.updateDictionary();
              this.formatReservations();
              this.rackDataReady = true;
            });
          });
      },
      updateDictionary() {
        this.reservations.forEach(reservation => {

          let actualDay = moment(reservation.start);
          let finalDay = moment(reservation.end);

          while (actualDay <= finalDay) {
            if (this.dictionary[reservation.room_id] != null) {
              this.dictionary[reservation.room_id][actualDay.format('ddd DD MMMM')] = true;
            }
            else {
              this.dictionary[reservation.room_id] = {};
              this.dictionary[reservation.room_id][actualDay.format('ddd DD MMMM')] = true;
            }
            actualDay.add(1, 'day');
          }
        });
      },
      checkLimits () {
        let a = document.getElementById('scrollable').scrollLeft;
        let b = document.getElementById('scrollable').offsetWidth;
        let c = document.getElementById(9).offsetWidth * this.len;
        
        if (a + b - c >= 0) {
            for(let i=0; i < 10; i++) {
                this.days.push(this.days[this.len-1].clone().add(1,'day'));
                this.len++;
                this.lastItem++;
            }
            if (this.len > 30) {
                this.days = this.days.slice(10);
                this.firstItem += 10;
                this.len = 30;
                let scroll = document.getElementById('scrollable').scrollLeft;
                document.getElementById('scrollable').scrollLeft = scroll - 2200;
            }
        }
        if (a == 0) {
            for(let i=0; i < 10; i++) {
                let previous = this.days[0].clone().add(-1,'day')
                this.len++;
                this.firstItem--;
                this.days = [previous].concat(this.days);
            }
    
            if (this.len > 30) {
                this.days = this.days.slice(0, 30);
                this.lastItem -= 10;
                this.len = 30;
                let scroll = document.getElementById('scrollable').scrollLeft;
                document.getElementById('scrollable').scrollLeft = scroll + 2200;
            }
            else {
                document.getElementById('scrollable').scrollLeft += 2200;
            }
        } 
      },

      syncScrollsBySide() {
        var states = document.getElementsByClassName('roomStates');
        var scroll = document.getElementById('roomCodes').scrollTop;

        for (let i = 0; i < states.length; i++) {
          states[i].scrollTop = scroll;
        }
      },

      syncScrollsByRack(day) {
        var states = document.getElementsByClassName('roomStates');
        var scroll = document.getElementById(day).scrollTop;
        
        document.getElementById('roomCodes').scrollTop = scroll;

        for (let i = 0; i < states.length; i++) {
          states[i].scrollTop = scroll;
        }
      },

      setDefaultDaysRack() {
        let firstDay = moment();
        firstDay = firstDay.clone().add(-5, 'day');

        for (let i = 0; i < 10; i++) {
          this.days.push(firstDay.clone().add(i+1,'day'));
          this.len++;
        }
      },
      

      formatReservations(){
        this.reservations.forEach(reservation => {
          reservation.start = moment(reservation.start).format("ddd DD MMMM");
          reservation.end = moment(reservation.end).format("ddd DD MMMM");
        });
      },

      isBusy(room, date) {
        try {
          let bool = this.dictionary[room.id][date.format('ddd DD MMMM')];
          return bool; 
        } catch (error) {
          return false;
        }
      },
      format(day) {
        return day.format('ddd DD MMMM');
      }
    },
  }
</script>

<style scope>
.scrolling-wrapper {
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
}
.scrolling-wrapper::-webkit-scrollbar {
  display: none;
}
.rackSideBar {
  text-align: center;
  margin-left: -4vw;
  white-space: nowrap;
}
.date, .title {
  display: inline-block;
  text-align: center;
  width: 220px;
  color: #606266;
}
.roomStates, .roomCodes {
  height: 40vh;
  overflow-y: scroll; 
}
.roomStates::-webkit-scrollbar, .roomCodes::-webkit-scrollbar{
  display: none;
}
.busyText {
  color: #F56C6C;
  background-color: #F56C6C;
}
.freeText {
  color: rgb(244, 244, 245);
  background-color: rgb(244, 244, 245);
}
.roomState {
  padding-left: 0% !important;
  padding-right: 0% !important;
}
#rack {
    padding-top: 0px;
    padding-bottom: 10px;
}
#rack-box {
    height: 36vh;
    margin-bottom: 4vh;
}
</style>