<template>
<div class="rack">
<el-row :gutter="20">
  <el-col :span="18">
        <el-card class="box-card" id="rack-box" v-loading="!rackDataReady">
          <div slot="header" class="clearfix reservations-form__title">
            Rack
          </div> 
          <el-row>
            <el-col :span="3">
              <div class="rackSideBar">
                <div class="title">
                  Habitacion
                  <div class="roomCodes" id="roomCodes" v-on:scroll="syncScrollsBySide()">
                  <el-row>
                    <el-col class="roomCode" v-bind:id="index" v-bind:key="index" v-for="(room, index) in rooms">
                      <p>
                        <el-row>
                          <el-col :span="3" :offset="8" class="text-right">
                            {{room.id}}
                          </el-col>
                          <el-col :span="4" class="text-grey">
                            <sub>
                              {{room.type}}
                            </sub>
                          </el-col>
                        </el-row>
                      </p>
                    </el-col>
                  </el-row>
                  </div>
                </div>
              </div>
            </el-col>
            <el-col :span="21">
              <div class="scrolling-wrapper" v-on:scroll="checkLimits()" id="scrollable">
                <div class="date" v-bind:id="index" v-bind:key="index" v-for="(day, index) in days">
                  {{format(day)}}
                  <div class="roomStates" :id="day" v-on:scroll="syncScrollsByRack(day)">
                    <el-row>
                      <el-col class="roomState" v-bind:id="index" v-bind:key="index" v-for="(room, index) in rooms">
                        <div v-if="isBusy(room, day)">
                          <p class="memberText" v-if="haveMembers(room, day)">
                          <p class="busyText" v-else></p>
                        </div>
                        <p class="freeText" v-else>vacante</p>
                      </el-col>
                    </el-row>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>

  </el-col>
  <el-col :span="6">
    <el-card class="box-card reservations-table">
        <div slot="header" class="clearfix reservations-table__title">
            Últimas reservaciones
        </div>
        <el-table
        v-loading="!rackDataReady"
        :data="reversedReservations"
        row-key="id"
        height="250">
          <el-table-column
          fixed
          prop="code"
          label="Código"
          width="120">
          </el-table-column>
          <el-table-column
          prop="checkInName"
          label="Cliente"
          width="120">
          </el-table-column>
          <el-table-column
            fixed="right"
            width="50">
            <template slot-scope="scope">
              <el-button size="small" icon="el-icon-info" class="reservation-info__button" @click="seeReservationInfo(scope.row.id)"></el-button>
            </template>
          </el-table-column>
        </el-table>
    </el-card>
  </el-col>
</el-row>
<el-dialog
  v-if="dialogVisible"
  :visible.sync="dialogVisible"
  width="27%">
  <p class="reservationSelected-title"><b>Reserva {{reservationSelected.code}}</b></p>
  <ul>
    <li>
      Nombre: {{reservationSelected.checkInName}}
    </li>
    <li>
      Nº Documento: {{reservationSelected.documentNumber}}
    </li>
    <li>
      Habitacion: {{reservationSelected.roomId}} ({{rooms[reservationSelected.roomId - 1].type}})
    </li>
    <li>
      Inicio: {{this.formatAll(reservationSelected.start)}}
    </li>
    <li>
      Término: {{this.formatAll(reservationSelected.end)}}
    </li>
  </ul>
</el-dialog>
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
          dictionary: {},
          members: {},
          reservationSelected: {},
          dialogVisible: false,
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
        document.getElementById('scrollable').scrollLeft =  880;
    },
    computed: {
      reversedReservations: function() {
        return _.orderBy(this.reservations, ['id'], ['desc']);
      }
    },
    methods: {
      seeReservationInfo(id) {
        this.reservations.forEach(reservation => {
          if (reservation.id == id) {
            this.reservationSelected = reservation;
            this.reservationSelected.title = 'Reserva ' + reservation.code;
            this.dialogVisible = true;
            return;
          }
        })
      },
      haveMembers(room, day) {
        try {
          let bool = this.members[room.id][day.format('ddd DD MMMM')];
          return bool; 
        } catch (error) {
          return false;
        }
      },
      handleReservation(reservationData) {
        this.reservations.push(reservationData);
        this.updateDictionary();
      },
      updateRackData() {
        axios.get('localhost:8080/api/rooms').then(response => {
          this.rooms = response.data
          axios.get('localhost:8080/api/reservations/')
          .then(response => {
            this.reservations = response.data;
            this.updateDictionary();
            this.rackDataReady = true;
          });
        });
      },
      updateDictionary() {
        this.reservations.forEach(reservation => {
          let actualDay = moment(reservation.start);
          let finalDay = moment(reservation.end);

          while (actualDay <= finalDay) {
            if (this.dictionary[reservation.roomId] != null) {
              this.dictionary[reservation.roomId][actualDay.format('ddd DD MMMM')] = true;
            }
            else {
              this.dictionary[reservation.roomId] = {};
              this.dictionary[reservation.roomId][actualDay.format('ddd DD MMMM')] = true;
            }
            if (reservation.members.length > 0) {
              if (this.members[reservation.roomId] != null) {
                this.members[reservation.roomId][actualDay.format('ddd DD MMMM')] = true;
              }
              else {
                this.members[reservation.roomId] = {};
                this.members[reservation.roomId][actualDay.format('ddd DD MMMM')] = true;
              }
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
                let previous = this.days[0].clone().add(-1,'day');
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
      },
      formatAll(date){
            return moment(date).format("dddd DD MMMM");
        },
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
  height: 29vh;
  overflow-y: scroll; 
}
.roomStates::-webkit-scrollbar, .roomCodes::-webkit-scrollbar{
  display: none;
}
.busyText {
  height: 19px;
  background: #FDE2E2;
}
.memberText {
  background: #F56C6C;
  height: 19px;
}

.freeText {
  color: rgb(244, 244, 245);
  background-color: rgb(244, 244, 245);
}
.roomState {
  padding-left: 0% !important;
  padding-right: 0% !important;
}
.text-right {
  text-align: right;
  font-size: 13px;
}

.text-grey {
  color: #C0C4CC;
  text-transform: lowercase;
  font-size: 12px;
  text-overflow: clip;
  overflow: hidden;
  white-space: nowrap;
  text-align: left;
  margin-left: 0.2em;
}
.reservation-info__button, .reservation-info__button:hover {
  border: none;
  background: transparent;
}

.reservation-info__button > .el-icon-info:before {
  font-size: 16px !important;
}

.el-dialog__body {
  font-size: 15px;
  margin-left: 5vh;
}

.el-dialog__header {
  padding: 0;
}

.el-dialog__body > ul > li {
  padding-left: 0;
  padding-bottom: 0.5vh;
}

.el-dialog {
  border-radius: 8px;
  height: 28vh;
}
#rack {
    padding-top: 0px;
    padding-bottom: 10px;
}
#rack-box, .reservations-table {
    height: 40vh;
    margin-bottom: 20px;
}
</style>