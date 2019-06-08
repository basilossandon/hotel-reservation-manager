<template>
      <el-card class="box-card">
          <div slot="header" class="clearfix">
              <el-row>
                  <el-col></el-col>
                  <el-col :span="12">
                      <el-alert v-if="showButton"
                        :title="dataAlert"
                        type="success">
                        </el-alert>
                  </el-col>
              </el-row>
          </div>
          <div>
              <el-form ref="form" label-position="left" :model="form" label-width="120px">
                  <el-row>
                      <el-col :span="11">
                        <el-form-item label="Nombre">
                            <el-input placeholder="Ingrese nombre cliente" v-model="form.checkInName"></el-input>
                        </el-form-item>

                        <el-form-item label="Nª Documento">
                            <el-input placeholder="Ingrese número documento" v-model="form.documentNumber"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="13">
                        <el-form-item label="Fechas">
                            <el-date-picker
                            v-model="form.date"
                            type="daterange"
                            range-separator="-"
                            start-placeholder="Inicio"
                            end-placeholder="Término"
                            >
                            </el-date-picker>
                        </el-form-item>

                        <el-form-item label="Habitación">
                            <el-select v-model="form.roomId" placeholder="Seleccione habitación">
                                <el-option
                                v-for="item in rackRooms"
                                :key="item.id"
                                :label="item.id"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-row>
                            <el-button type="primary" plain size="small" @click="addRoom()">Añadir Habitación</el-button>
                            <el-button v-if="showButton" type="success" size="small" @click="postReservation()">Reservar</el-button>
                        </el-row>
                      </el-col>
                  </el-row>
              </el-form>
            </div>
      </el-card>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import "moment/locale/es"

export default {
    props: ['rackRooms', 'rackReservations'],
    data() {
        return {
            form: {
                id: '',
                date: [],
                finalPrice: 0,
                documentNumber: '',
                checkInName: '',
                code: '',
                roomId: null
            },
            date: '',
            value: '',
            postRooms: [],
            postDates: [],
            showButton: false,
            dataAlert: "Habitaciones a reservar:" ,
            load: true
        }
    },
    methods: {
        addRoom() {
            this.showButton = true;
            this.postRooms.push(this.form.roomId);
            this.postDates.push(this.form.date);
            this.dataAlert += (" " + this.form.roomId + ",");
            this.form.roomId = null;
            this.form.date = [];
        },
        postReservation() {
            var code = makeid(10);
            for (let i = 0; i < this.postRooms.length; i++) {
                let start = moment(this.postDates[i][0]);
                let end = moment(this.postDates[i][1]);
                axios({
                    method: "POST",
                    url: "http://157.230.12.110:8080/api/reservations/",
                    data: {
                        start: start,
                        end: end,
                        finalPrice: this.finalPrice,
                        checkInName: this.form.checkInName,
                        lastName: this.lastName,
                        documentNumber: this.form.documentNumber,
                        code: code,
                        roomId: this.postRooms[i],
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
                        this.dataAlert = "Habitaciones a reservar:";
                        this.postRooms = [];
                        this.postDates = [];
                        this.showButton = false;
                        this.$emit('newReservation', response.data);
                    })
                    .catch(error => this.$notify.error({
                        title: "Error",
                        message: "Ha ocurrido un error al intentar realizar la reserva."
                    }));
                }
        },
        removeRoom() {
            if (this.list_rooms.length != 1) {
                this.list_rooms.splice(-1, 1)
            }
        },

        open() {
            const h = this.$createElement

            this.$notify({
                title: 'Reserva realizada',
                message: h('i', { style: 'color: cyan' }, 'This is a reminder'),
            })
        },
        post() {
            let today = moment();
            let tomorrow = today.clone().add(1, 'day');
            axios({
                method: "POST",
                url: "http://157.230.12.110:8080/api/reservations/",
                data: {
                    start: today,
                    end: tomorrow,
                    finalPrice: 100000,
                    documentNumber: '192642264',
                    checkinName: 'Leandro Pizarro',
                    code: 'L0BPJ530HB',
                    roomId: 2
                },
                config: {
                    headers: {
                        "Content-Type": "application/json"
                        }
                }
            })
            .then(response => {
                console.log(response.data);
                this.$notify({
                title: "Reservation Created",
                message: "It's now in the rack.",
                type: "success"
                });
            })
            .catch(error => this.$notify.error({
                title: "Error",
                message: "There was an error trying to create the reservation"
            }));
        }
    },
}

function makeid(length) {
    var result = ''
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    var charactersLength = characters.length
    for (var i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
        )
    }
    return result
}
</script>

<style>
.box-card {
    text-align: left;
    height: 18em;
}
/* .box-card > .el-card__body {
    padding: 0px;
    height: 100%;
} */
.el-card__header {
    padding: 0px !important;
}
.el-notification,
.right {
  font-family: "Avenir", Helvetica, Arial, sans-serif !important;
}
</style>