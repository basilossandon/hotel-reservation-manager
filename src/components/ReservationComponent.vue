<template>
<el-row :gutter="20">
    <el-col :span="24">
        <el-card class="box-card reservations-form">
            <div slot="header" class="clearfix">
                <el-row>
                    <el-col :span="10" class="reservations-form__title">
                        Formulario de reservación
                    </el-col>
                    <el-col :span=14>
                        <el-alert
                        v-if="showFieldsError"
                        :title="errorTitle"
                        type="error">
                        </el-alert>
                    </el-col>
                </el-row>
            </div>
            <el-main>
                <el-form ref="form" label-position="left" label-width="106px" size="small">
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item label="Nombre">
                                <el-input v-model="checkInName"></el-input>
                            </el-form-item>
                            <el-form-item label="Nª Documento">
                                <el-input v-model="documentNumber"></el-input>
                            </el-form-item>
                            <el-form-item label="Correo">
                                <el-input v-model="mail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="Inicio">
                                    <el-date-picker
                                    id="startPicker"
                                    v-model="start"
                                    :editable="false"
                                    type="date"
                                    format="MM/dd/yyyy"
                                    :picker-options="startPickerOptions">
                                    </el-date-picker>
                            </el-form-item>
                            <el-form-item label="Término">
                                <el-date-picker
                                    v-model="end"
                                    :editable="false"
                                    type="date"
                                    format="MM/dd/yyyy"
                                    :disabled="start == null"
                                    :picker-options="endPickerOptions">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="Habitación" class="room-selector">
                                <el-select v-model="roomId" :disabled="end == null">
                                    <el-option
                                    v-for="room in availableRooms"
                                    :key="room"
                                    :label="room"
                                    :value="room">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-button class="reservationButton" type="primary" plain size="small" @click="addRoom()" icon="el-icon-circle-plus" :disabled="roomId == null">Añadir Habitación</el-button>
                            <el-button class="reservationButton" type="success" size="small" @click="postReservation()" icon="el-icon-check" :disabled="postRooms.length == 0">Confirmar reserva</el-button>
                        </el-col>
                    </el-row>
                    <el-row>
                            <el-alert
                            class="postRoomsInfo"
                            title="Resumen:"
                            type="info"
                            :description="reservationInfo"
                            :closable="false">
                            </el-alert>
                    </el-row>
                </el-form>
            </el-main>
        </el-card>
    </el-col>
    <el-col :span="24">

    </el-col>
      <!-- <el-col :span="14">
        <el-card class="box-card reservations-form">
            <div slot="header" class="clearfix">
                <el-row>
                    <el-col :span="10" class="reservations-form__title">
                        Formulario de reservación
                    </el-col>
                    <el-col :span=14>
                        <el-alert
                        v-if="showFieldsError"
                        :title="errorTitle"
                        type="error">
                        </el-alert>
                    </el-col>
                </el-row>
            </div>
            <el-main>
                <el-form ref="form" label-position="left" label-width="106px" size="small">
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item label="Nombre">
                                <el-input v-model="checkInName"></el-input>
                            </el-form-item>
                            <el-form-item label="Nª Documento">
                                <el-input v-model="documentNumber"></el-input>
                            </el-form-item>
                            <el-form-item label="Correo">
                                <el-input v-model="mail"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="Inicio">
                                    <el-date-picker
                                    id="startPicker"
                                    v-model="start"
                                    :editable="false"
                                    type="date"
                                    format="MM/dd/yyyy"
                                    :picker-options="startPickerOptions">
                                    </el-date-picker>
                            </el-form-item>
                            <el-form-item label="Término">
                                <el-date-picker
                                    v-model="end"
                                    :editable="false"
                                    type="date"
                                    format="MM/dd/yyyy"
                                    :disabled="start == null"
                                    :picker-options="endPickerOptions">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="Habitación" class="room-selector">
                                <el-select v-model="roomId" :disabled="end == null">
                                    <el-option
                                    v-for="room in availableRooms"
                                    :key="room"
                                    :label="room"
                                    :value="room">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-button class="reservationButton" type="primary" plain size="small" @click="addRoom()" icon="el-icon-circle-plus" :disabled="roomId == null">Añadir Habitación</el-button>
                            <el-button class="reservationButton" type="success" size="small" @click="postReservation()" icon="el-icon-check" :disabled="postRooms.length == 0">Confirmar reserva</el-button>
                        </el-col>
                    </el-row>
                    <el-row>
                            <el-alert
                            class="postRoomsInfo"
                            title="Resumen:"
                            type="info"
                            :description="reservationInfo"
                            :closable="false">
                            </el-alert>
                    </el-row>
                </el-form>
            </el-main>
        </el-card>
      </el-col>
      <el-col :span="10">
          <el-row>
            <el-card class="box-card reservations-table">
                <div slot="header" class="clearfix reservations-table__title">
                    Últimas reservaciones
                </div>
                <el-table
                    v-loading="!rackReady"
                    :data="rackReservations"
                    style="width: 100%"
                    height="300">
                    <el-table-column
                    fixed
                    prop="code"
                    label="Código"
                    width="140">
                    </el-table-column>
                    <el-table-column
                    prop="checkin_name"
                    label="Cliente"
                    width="150">
                    </el-table-column>
                    <el-table-column
                    prop="start"
                    label="Inicio"
                    width="120">
                    </el-table-column>
                    <el-table-column
                    prop="end"
                    label="Término"
                    width="120">
                    </el-table-column>
                </el-table>
            </el-card>
          </el-row>
      </el-col> -->
    </el-row>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import "moment/locale/es"

function isBusy(day, reservations) {
    reservations.forEach(reservation => {
        if (reservation.start == day || reservation.end == day) {
            return true;
        }
    });
    return false;   
}

export default {
    props: ['rackRooms', 'rackReservations', 'rackReady', 'rackDictionary'],
    data() {
        return {
            start: null,
            end: null,
            finalPrice: 0,
            documentNumber: '',
            mail: '',
            checkInName: '',
            roomId: null,
            date: '',
            availableRooms: [],
            postRooms: [],
            postDates: [],
            showButton: false,
            startPickerOptions: {
                disabledDate(time) {
                    const date  = moment(time.getTime());
                    const today = moment(Date.now()).add(-1, 'day');
                    return date < today;
                }
            },
            endPickerOptions: {
                disabledDate(time) {
                    var date = new Date(time.getTime());
                    var start = new Date(document.getElementById('startPicker').value);
                    const dateSelected = moment(date);
                    const dateLimit = moment(start);
                    return dateSelected < dateLimit;
                }
            },
            errorTitle: '',
            showFieldsError: false,
            showReservationInfo: false
        }
    },
    watch: {
        start: function (value) {
            if (value == null) {
                this.end = null;
                this.availableRooms = [];
            }
        },
        end: function (value) {
            if (value != null) {
                this.availableRooms = [];
                this.rackRooms.forEach(room => {
                    let start = false;
                    let end = false;
                    try {
                        start = this.rackDictionary[room.id][this.format(this.start)];
                    } catch (error) {
                        start = false;
                    }

                    try {
                        end = this.rackDictionary[room.id][this.format(this.end)];
                    } catch (error) {
                        end = false;
                    }
                    if (!start && !end) {
                        this.availableRooms.push(room.id);
                    }
                });
            }
            else {
                this.roomId = null;
            }
        },
    },
    computed: {
        reservationInfo: function() {
            var text = '';
            if (this.checkInName) {
                text += 'Reserva a nombre de ' + this.checkInName;
                if (this.documentNumber) {
                    text += ', número de documento ' + this.documentNumber + '.';
                    if (this.start) {
                        text += '. Con inicio el día ' + this.formatAll(this.start);
                        if (this.end) {
                            text += ' y término el día ' + this.formatAll(this.end) + '.'
                            if (this.postRooms.length == 1) {
                                text += ' La habitacion solicitada es la ' + this.postRooms[0] + '.';
                            }
                            if (this.postRooms.length > 1) {
                                text += ' Las habitaciones solicitadas son: '
                                this.postRooms.forEach(room => {
                                    text += ' ' + room;
                                });
                                text += '.';
                            }
                        }
                    }
                } 
            }
            else {
                text += '...';
            }
            return text;
        }
    },
    methods: {
        addRoom() {
            if (this.checkInName && this.documentNumber && this.mail) {
                this.postRooms.push(this.roomId);
                this.postRooms = this.postRooms.sort();
                this.postDates.push([this.start, this.end]);
                this.availableRooms = _.remove(this.availableRooms, function(n) {
                    return n == this.roomId;
                });
                this.roomId = null;
            }
            else {
                this.$message({
                    showClose: true,
                    message: 'Debe ingresar los datos personales del cliente  ',
                    type: 'error'
                });
            }
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
                        checkInName: this.checkInName,
                        lastName: this.lastName,
                        documentNumber: this.documentNumber,
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
        },
        format(date){
            return moment(date).format("ddd DD MMMM");
        },
        formatAll(date){
            return moment(date).format("dddd DD MMMM");
        },
        isInReservations(day) {
            this.rackReservations.forEach(reservation => {
                if (reservation.start == day || reservation.end == day) {
                    return true;
                }
            });
            return false;
        },
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

<style scoped>
.el-notification,
.right {
  font-family: "Avenir", Helvetica, Arial, sans-serif !important;
}
.reservations-table, .reservations-form{
    height: 47.3vh;
}
.reservations-table > .el-card__body {
    padding-top: 0px; 
}
.reservations-form > .el-card__body {
    padding-top: 0px; 
}
.el-table__empty-text {
    display: none;
}
.form-title {
    margin-bottom: 3vh;
}
.el-input__inner {
    width: 220px;
}
.room-selector {
    height: 32px;
}
.reservationButton {
    margin-top: 1vh;
}
.postRoomsInfo {
    margin-top: 1.5em;
}
</style>