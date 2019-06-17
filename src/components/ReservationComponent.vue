<template>
<el-row>
    <el-col :span="24">
        <el-card class="box-card reservations-form">
            <div slot="header" class="clearfix">
                <el-row>
                    <el-col :span="10" class="reservations-form__title">
                        Formulario de reservación {{roomId}}
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
            <el-main class="bg">
                <el-form ref="form" label-position="left" label-width="106px" size="small">
                    <el-row>
                        <el-col :span="7" class="bg2">
                            <el-form-item label="Nombre">
                                <el-input v-model="checkInName"></el-input>
                            </el-form-item>
                            <el-form-item label="Nª Documento">
                                <el-input v-model="documentNumber"></el-input>
                            </el-form-item>
                            <el-form-item label="Correo">
                                <el-input v-model="email"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="7" class="bg2">
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
                        <el-col :span="10">
                            <div class="postRoomsInfo">
                                <el-main>
                                    <div class="reservationInfo__title">
                                        Resumen:
                                    </div>
                                    <div class="reservationInfo__description">
                                        {{reservationInfo}}
                                    </div>
                                    <div class="reservationInfo__rooms" v-for="(room, index) in roomsInfo" :key="index">
                                        <el-main class="reservationInfo__rooms-text">
                                            {{room}}
                                        </el-main>
                                    </div>
                                </el-main>
                            </div>
                        </el-col>
                    </el-row>
                </el-form>
            </el-main>
        </el-card>
    </el-col>
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
            email: '',
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
                    if (this.postRooms.length > 0) {
                            text += ' Para las siguientes habitaciones:';
                    }
                } 
            }
            else {
                text += '...';
            }
            return text;
        },
        roomsInfo: function() {
            var texts = [];
            if (this.checkInName && this.documentNumber) {
                if (this.postRooms.length > 0) {
                    for(let i = 0; i < this.postRooms.length; i++) {
                        texts.push("    Habitación " + this.postRooms[i] + ' desde el ' + this.formatAll(this.postDates[i][0]) + ' hasta el ' + this.formatAll(this.postDates[i][1]) + '.');
                    }
                }
            }
            return texts;
        }
    },
    methods: {
        addRoom() {
            if (this.checkInName && this.documentNumber && this.email) {
                this.postRooms.push(this.roomId);
                this.postRooms = this.postRooms.sort();
                this.postDates.push([this.start, this.end]);
                this.availableRooms.splice(this.availableRooms.indexOf(this.roomId), 1);
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
                        checkInName: this.checkInName,
                        lastName: this.lastName,
                        documentNumber: this.documentNumber,
                        code: code,
                        email: this.email,
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
                        this.start = null;
                        this.postRooms = [];
                        this.postDates = [];
                        this.showButton = false;
                        this.$emit('newReservation', response.data);
                    })
                    .catch(error => {
                        this.$notify.error({
                            title: "Error",
                            message: "Ha ocurrido un error al intentar realizar la reserva."
                        });
                    });
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
.reservations-form {
    height: 46vh;
}
.el-notification,
.right {
  font-family: "Avenir", Helvetica, Arial, sans-serif !important;
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
.el-input__inner, .el-input--small {
    width: 300px;
}
.reservationButton {
    margin-top: 1vh;
}
.postRoomsInfo {
    background-color: #f4f4f5;
    color: #909399;
    border-radius: 6px;
    font-size: 14px;
}
.reservationInfo__title {
    font-weight: bold;
    margin-bottom: 1em;
}
.reservationInfo__description {
    margin-bottom: 1em;
}
.reservationInfo__rooms-text {
    padding-top: 5px;
    padding-bottom: 0px;
}
</style>