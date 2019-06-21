<template>
<div class="register">
  <el-main>
    <el-row :gutter="20">
      <el-col :span="7">
        <el-card class="card-box form-size">
          <div slot="header">
            Reserva
          </div>
          <el-form class="code-form">
            <el-row>
              <el-col :span="14">
                <span class="input-label-color">
                  Utilizar un código de reserva
                </span>
              </el-col>
              <el-col :span="3" :offset="7">
                <el-switch v-model="form.switch"></el-switch>
              </el-col>
            </el-row>
          </el-form>
          <el-form label-position="left" label-width="120px" class="myForm">
            <el-row>
              <el-col v-if="form.switch" :span="24">
                  <el-form-item label="Código">
                    <el-input v-model="code" size="small"></el-input>
                  </el-form-item>
                  <el-button class="switchButton" :disabled="!showBB" type="success" size="small" @click="searchReservations()" icon="el-icon-check">Confirmar</el-button>
              </el-col>
              <el-col v-if="!form.switch" :span="24">
                <el-form-item label="Nombre">
                    <el-input v-model="checkInName" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="Nª Documento">
                    <el-input v-model="documentNumber" size="mini"></el-input>
                </el-form-item>
                <el-form-item label="Inicio">
                  <el-date-picker
                  id="startPicker"
                  v-model="start"
                  :editable="false"
                  type="date"
                  format="MM/dd/yyyy"
                  :picker-options="startPickerOptions"
                  size="mini">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="Término">
                  <el-date-picker
                      v-model="end"
                      :editable="false"
                      type="date"
                      format="MM/dd/yyyy"
                      :disabled="start == null"
                      :picker-options="endPickerOptions"
                      size="mini">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="Habitación" class="room-selector">
                  <el-select v-model="roomId" :disabled="end == null" class="mini">
                      <el-option-group
                      v-for="group in roomsGrouped"
                      :key="group.label"
                      :label="group.label">
                          <el-option
                              v-for="room in group.rooms"
                              :key="room"
                              :label="room"
                              :value="room">
                          </el-option>
                      </el-option-group>
                  </el-select>
                </el-form-item>
                <el-button class="reservationButton" type="primary" plain size="small" @click="addRoom()" icon="el-icon-circle-plus" :disabled="roomId == null">Añadir Habitación</el-button>
                <el-button class="reservationButton" type="success" size="small" @click="postReservation()" icon="el-icon-check" :disabled="postRooms.length == 0">Confirmar reserva</el-button>
              </el-col>
            </el-row>
          </el-form>
          <el-row>
            <el-col class="reservationTable">
              <div v-if="formatedReservations.length > 0" class="tableTitle">
                Reserva <span> {{codeReservations[0].code}}</span> a nombre de <span> {{codeReservations[0].checkInName}}</span>
              </div>
              <el-table
              v-if="formatedReservations.length > 0"
                :data="formatedReservations"
                height="150"
                style="width: 100%">
                <el-table-column
                  prop="roomId"
                  label="Habitación"
                  width="110">
                </el-table-column>
                <el-table-column
                  prop="start"
                  label="Inicio"
                  width="120">
                </el-table-column>
                <el-table-column
                  prop="end"
                  label="Término"
                  width="110">
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="17">
        <el-card class="card-box form-size">
          <div slot="header">
            Registro
          </div>
          <el-main v-if="showMembersForm">
            <el-row>
              <el-col v-for="(reservation, index) in codeReservations" :key="index">
                <el-collapse v-model="activeName" accordion @change="setShowButtons()">
                  <el-collapse-item :title="getTitle(reservation)" :name="index" v-if="reservation.members.length == 0">
                    <div>
                      Reservada desde el {{format(reservation.start)}} al {{format(reservation.end)}}
                    </div>
                    <el-card class="box-card">
                      <div slot="header">
                        Datos personales de los huéspedes
                        <el-button v-if="showConfirm" style="float: right; padding: 3px 0px 0px 0px; margin-left: 15px; color: #67C23A" type="text" @click="postMembers(reservation)">Confirmar</el-button>
                        <el-button style="float: right; padding: 3px 0" type="text" :disabled="showConfirm" @click="setShowConfirm()">Editar</el-button>
                      </div>
                      <div class="membersPersonalDataForm">
                        <el-form class="mebers-form" label-position="left" label-width="106px">
                          <el-tabs type="card">
                            <el-tab-pane label="Huésped #1">
                              <div class="first">
                                <div>
                                  <el-row>
                                    <el-col :span="12">
                                      <el-form-item label="Nombre">
                                        <el-input :disabled="!showConfirm" v-model="names.first" size="mini"></el-input>
                                      </el-form-item>
                                      <el-form-item label="Nº Documento">
                                        <el-input :disabled="!showConfirm" v-model="documents.first" size="mini"></el-input>
                                      </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                    <el-form-item label="País">
                                      <el-select :disabled="!showConfirm" v-model="countries.first">
                                        <el-option
                                          v-for="item in nations"
                                          :key="item.origen"
                                          :label="item.name"
                                          :value="item.name"
                                        ></el-option>
                                      </el-select>
                                    </el-form-item>
                                    <el-form-item label="Edad">
                                      <el-input :disabled="!showConfirm" v-model="ages.first" size="mini"></el-input>
                                    </el-form-item>
                                    </el-col>
                                  </el-row>
                                </div>
                              </div>
                            </el-tab-pane>
                            <el-tab-pane label="Huésped #2" v-if="getRoomCapacity(reservation.roomId) > 1">
                              <div>
                                <el-row>
                                    <el-col :span="12">
                                      <el-form-item label="Nombre">
                                        <el-input :disabled="!showConfirm" v-model="names.second" size="mini"></el-input>
                                      </el-form-item>
                                      <el-form-item label="Nº Documento">
                                        <el-input :disabled="!showConfirm" v-model="documents.second" size="mini"></el-input>
                                      </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                    <el-form-item label="País">
                                      <el-select :disabled="!showConfirm" v-model="countries.second">
                                        <el-option
                                          v-for="item in nations"
                                          :key="item.origen"
                                          :label="item.name"
                                          :value="item.name"
                                        ></el-option>
                                      </el-select>
                                    </el-form-item>
                                    <el-form-item label="Edad">
                                      <el-input :disabled="!showConfirm" v-model="ages.second" size="mini"></el-input>
                                    </el-form-item>
                                    </el-col>
                                  </el-row>
                              </div>
                            </el-tab-pane>
                            <el-tab-pane label="Huésped #3" v-if="getRoomCapacity(reservation.roomId) > 2">
                              <div>
                                <el-row>
                                    <el-col :span="12">
                                      <el-form-item label="Nombre">
                                        <el-input :disabled="!showConfirm" v-model="names.third" size="mini"></el-input>
                                      </el-form-item>
                                      <el-form-item label="Nº Documento">
                                        <el-input :disabled="!showConfirm" v-model="documents.third" size="mini"></el-input>
                                      </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                    <el-form-item label="País">
                                      <el-select :disabled="!showConfirm" v-model="countries.third">
                                        <el-option
                                          v-for="item in nations"
                                          :key="item.origen"
                                          :label="item.name"
                                          :value="item.name"
                                        ></el-option>
                                      </el-select>
                                    </el-form-item>
                                    <el-form-item label="Edad">
                                      <el-input :disabled="!showConfirm" v-model="ages.third" size="mini"></el-input>
                                    </el-form-item>
                                    </el-col>
                                  </el-row>
                              </div>
                            </el-tab-pane>
                          </el-tabs>
                        </el-form>
                      </div>
                    </el-card>
                  </el-collapse-item>
                  <el-collapse-item :title="getTitle(reservation)" v-else>
                    <el-table
                      :data="reservation.members"
                      style="width: 100%">
                      <el-table-column
                        prop="name"
                        label="Nombre"
                        width="180">
                      </el-table-column>
                      <el-table-column
                        prop="documentNumber"
                        label="Nº Documento"
                        width="180">
                      </el-table-column>
                      <el-table-column
                        prop="age"
                        width="120"
                        label="Edad">
                      </el-table-column>
                      <el-table-column
                        prop="country"
                        label="País">
                      </el-table-column>
                    </el-table>
                  </el-collapse-item>
                </el-collapse>
              </el-col>
            </el-row>
          </el-main>
        </el-card>
      </el-col>
    </el-row>
  </el-main>
</div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import "moment/locale/es";
import json from "../assets/json/nacionalidad.json";
import { read } from 'fs';

export default {
  data() {
    return {
      rooms: [],
      reservations: [],
      dictionary: {},
      postRooms: [],
      postDates: [],
      codeReservations: [],


      code: '',
      checkInName: '',
      documentNumber: '',
      start: null,
      end: null,
      roomId: null,


      names: {
        first: '',
        second: '',
        third: ''
      },

      documents: {
        first: '',
        second: '',
        third: ''
      },

      countries: {
        first: '',
        second: '',
        third: ''
      },

      ages: {
        first: '',
        second: '',
        third: ''
      },


      showMembersForm: false,
      showConfirm: false,
      activeName: '1',
      membersReady: -1,
      showBB: false,

      nations: json,
      capacidad: [],
      habitacion: null,
      anuncio: "",
      id_reservation: null,
      country: "",
      documentType: "",
      room_id: null,
      age: null,
      name: "",
      registro: "",
      code: null,
      codigo: null,
      form: {
        switch: false
      },
      showButton: false,
      opcionDocumento: [
        {
          valor: "Cedula",
          etiqueta: "Cedula"
        },
        {
          valor: "Pasaporte",
          etiqueta: "Pasaporte"
        },
        {
          valor: "Otro",
          etiqueta: "otro"
        }
      ],
      startPickerOptions: {
        disabledDate(time) {
          const date = moment(time.getTime());
          const today = moment(Date.now()).add(-1, "day");
          return date < today;
        }
      },
      endPickerOptions: {
        disabledDate(time) {
          var date = new Date(time.getTime());
          var start = new Date(document.getElementById("startPicker").value);
          const dateSelected = moment(date);
          const dateLimit = moment(start);
          return dateSelected < dateLimit;
        }
      }
    };
  },
  mounted() {
    axios.get('http://157.230.12.110:8080/api/rooms').then(response => {
      this.rooms = response.data
      axios.get('http://157.230.12.110:8080/api/reservations/')
      .then(response => {
        this.reservations = _.reverse(response.data);
        this.updateDictionary();
        this.formatReservations();
      });
    });
  },
  watch: {
    membersReady: function(value) {
      if (value == 0) {
          console.log("all ready");
          this.$notify({
              title: "Huéspedes asignados",
              message: "Se han asignado correctamente los huéspedes a la reservación",
              type: "success"
          });
          this.searchReservations();
          this.showConfirm = false;
          this.membersReady = -1;
          
          this.names = {
            first: '',
            second: '',
            third: ''
          };

          this.code = null;

          this.documents = {
            first: '',
            second: '',
            third: ''
          };

          this.countries = {
            first: '',
            second: '',
            third: ''
          };

          this.ages = {
            first: '',
            second: '',
            third: ''
          };
      }
    },
    start: function (value) {
        if (value == null) {
            this.end = null;
        }
        else {
            if (this.end != null) {
                if (moment(this.end) < moment(this.start)) {
                    this.end = null;
                }
            }
        }
    },
    end: function (value) {
        if (value == null) {
            this.roomId = null;
        }
    },
    code: function(value) {
      if (value != null) {
        if (value.length < 10) {
          this.showBB = false;
        }
        if (value.length > 9) {
          this.showBB = true;
        }
      }
    },
  },
  computed: {
    formatedReservations: function() {
      var res = [];
      this.codeReservations.forEach(reservation => {
        let temp = null;
        temp = reservation;
        temp.start = this.format(temp.start);
        temp.end = this.format(temp.end);
        res.push(temp);
      });
      return res;
    },
        roomsGrouped: function() {
            let rooms = [
                {
                    label: 'Simple',
                    rooms: []
                },
                {
                    label: 'Doble',
                    rooms: []
                },
                {
                    label: 'Triple',
                    rooms: []
                },
                {
                    label: 'Matrimonial',
                    rooms: []
                }
            ];
            if (this.start && this.end) {
                this.rooms.forEach(room => {
                    var isTaken = false;
                    var date = moment(this.start);
                    var end = moment(this.end);
                    while (date <= end) {
                        try {
                            isTaken = this.dictionary[room.id][this.format(date)];
                            if (isTaken) {
                                break;
                            }
                        }
                        catch (error) {
                            isTaken = false;
                        }
                        date = date.clone().add(1,'day');
                    }
    
                    if (!isTaken) {
                        let isReservated = false;
                        this.postRooms.forEach(postRoom => {
                            if (room.id == postRoom) {
                                isReservated = true;
                            }
                        });
                        if (!isReservated) {
                            let index = 0;
                            if (room.type[0] == 'D') {
                                index = 1;
                            }
                            if (room.type[0] == 'T') {
                                index = 2;
                            }
                            if (room.type[0] == 'M') {
                                index = 3;
                            }
                            rooms[index].rooms.push(room.id);
                        }
                    }
                });
            }
            return rooms;
        },
  },
  methods: {
    formatReservations() {
      this.codeReservations.forEach(reservation => {
        reservation.start = this.format(reservation.start);
        reservation.end = this.format(reservation.end);
      });
    },
    updateReservations() {
      axios.get('http://157.230.12.110:8080/api/reservations/')
      .then(response => {
        this.reservations = _.reverse(response.data);
        this.updateDictionary();
        this.formatReservations();
      });
    },
    checkMemberInputs(capacity) {
      if (this.names.first && this.documents.first && this.countries.first && this.ages.first) {
        if (capacity > 1) {
          if (this.names.second && this.documents.second && this.countries.second && this.ages.second) {
            if (capacity > 2) {
              if (this.names.third && this.documents.third && this.countries.third && this.ages.third) {
                return true;
              }
              else {
                return false;
              }
            }
            else {
              return true;
            }
          }
          else {
            return false;
          }
        }
        else {
          return true;
        }
      }
      else {
        return false
      }
    },
    postMembers(reservation) {
      if (this.checkMemberInputs(this.getRoomCapacity(reservation.roomId))) {
        var names = Object.values(this.names);
        var documents = Object.values(this.documents);
        var countries = Object.values(this.countries);
        var ages = Object.values(this.ages);

        this.membersReady = this.getRoomCapacity(reservation.roomId);

        for (let i = 0; i < this.getRoomCapacity(reservation.roomId); i++) {
          axios({
            method: "POST",
            url: "http://157.230.12.110:8080/api/members",
            data: {
              age: ages[i],
              country: countries[i],
              documentNumber: documents[i],
              name: names[i],
              reservationId: reservation.id
            },
            config: {
              headers: {
                "Content-Type": "application/json"
              }
            }
          })
          .then(response => {
            this.membersReady --;
          })
          .catch(error => {});
        }
      }
      else {
        this.$message({
            showClose: true,
            message: 'Debe ingresar los datos personales de todos los huéspedes.',
            type: 'error'
        });
      }

    },
    setShowButtons() {
      this.showConfirm= false;
    },
    setShowConfirm() {
      this.showConfirm = true;
    },
    getLabel(number) {
      return 'Huésped #' + number;
    },
    getRoomCapacity(roomId) {
      if (this.rooms[roomId - 1].type[0] == 'S') {
        return 1;
      }
      else if (this.rooms[roomId - 1].type[0] == 'D' || this.rooms[roomId - 1].type[0] == 'M') {
        return 2;
      }
      else {
        return 3;
      }
    },
    getTitle(reservation) {
      var text = 'Habitación ' + reservation.roomId + " (" + this.rooms[reservation.roomId - 1].type + ")"
      // text += " desde el " + this.format(reservation.start) + " al " + this.format(reservation.end)
      return text;
    },
    searchReservations() {
      axios({
          method: "POST",
          url: "http://157.230.12.110:8080/api/reservations/code/" + this.code,
          data: {},
          config: {
            headers: {
              "Content-Type": "application/json"
            }
          }
        })
        .then( response => {
          this.codeReservations = response.data;
          this.showMembersForm = true;
          console.log('new reservations');
          console.log(response.data);
        })
        .catch( error => {
          this.$notify({
              title: "Reservación no encontrada",
              message: "El código ingresado no existe",
              type: "error"
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
            actualDay.add(1, 'day');
          }
        });
    },
    formatReservations(){
        this.reservations.forEach(reservation => {
          reservation.start = moment(reservation.start).format("ddd DD MMMM");
          reservation.end = moment(reservation.end).format("ddd DD MMMM");
        });
    },

    format(date) {
      return moment(date).format("ddd DD MMMM");
    },

    formatAll(date) {
      return moment(date).format("dddd DD MMMM");
    },
  addRoom() {
            if (this.checkInName && this.documentNumber) {
                this.postRooms.push(this.roomId);
                this.postRooms = this.postRooms.sort();
                this.postDates.push([this.start, this.end]);
                this.roomId = null;
            }
            else {
                this.$message({
                    showClose: true,
                    message: 'Debe ingresar los datos personales del cliente',
                    type: 'error'
                });
            }
    },
    postReservation() {
            var code = this.makeid(10);
            for (let i = 0; i < this.postRooms.length; i++) {
                let start = moment(this.postDates[i][0]);
                let end = moment(this.postDates[i][1]);
                axios({
                    method: "POST",
                    url: "http://157.230.12.110:8080/api/reservations/",
                    data: {
                        start: start,
                        end: end,
                        checkInName: this.checkInName,
                        lastName: this.lastName,
                        documentNumber: this.documentNumber,
                        code: code,
                        email: 'mailNoIngresado@reservadirecta.checkin',
                        roomId: this.postRooms[i]
                    },
                    config: {
                        headers: {
                            "Content-Type": "application/json"
                            }
                    }
                    })
                    .then(response => {
                        this.$notify({
                            title: "Reservación Creada",
                            message: "Se ha generado la reserva. Su código es: " + response.data.code + ".",
                            type: "success"
                        });
                        this.checkInName = '';
                        this.documentNumber = '';
                        this.start = null;
                        this.postRooms = [];
                        this.postDates = [];
                        this.showButton = false;
                        this.code = response.data.code;
                        this.searchCode = true;
                        // this.$emit('newReservation', response.data);
                    })
                    .catch(error => {
                        this.$notify.error({
                            title: "Error",
                            message: "Ha ocurrido el siguiente error al intentar reservar."
                        });
                    });
                }
    },
    makeid(length) {
        var result = ''
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
        var charactersLength = characters.length
        for (var i = 0; i < length; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * charactersLength)
            )
        }
        return result
    },
  }
};

function makeid(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
</script>


<style>
.el-notification,
.right {
  font-family: "Avenir", Helvetica, Arial, sans-serif !important;
}
.el-alert{
    width: 64vh;
}
.registro-table,
.registro-form {
  height: 90vh;
}
.registro-table > .el-card__body {
  padding-top: 0px;
}
.registro-form > .el-card__body {
  padding-top: 0px;
}
.el-table__empty-text {
  display: none;
}
.form-title {
  margin-bottom: 2vh;
}
.el-input__inner {
  width: 220px;
}


.tableTitle {
  margin-bottom: 2vh;
}
.tableTitle > span {
  font-weight: bold;
}
.reservationTable {
  margin-top: 10vh;
}
.form-size {
  height: 85vh;
}
.reservationButton {
  margin-top:2vh;
  margin-left:2vh;
}
/* .membersPersonalDataForm {
  height: 30vh;
} */
.grid-display {
  display: grid;
}
.auto-margin {
  margin: auto;
}
.code-form {
  margin-bottom: 3vh;
}
.input-label-color {
  font-size: 14px;
  color: #909399;
}
.el-input__inner {
  height: 32px !important;
}
.guest {
  margin-bottom: 2vh;
}
.el-form-item {
  margin-bottom: 5px !important;
}
.switchButton {
  margin-left: 28.2vh;
  margin-top:2vh;
}
</style>