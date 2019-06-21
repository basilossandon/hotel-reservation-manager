<template>
<el-row>
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
                        <el-col :span="10">
                            <div class="postRoomsInfo">
                                <el-main>
                                    <div class="reservationInfo__title">
                                        Resumen:
                                    </div>
                                    <div class="reservationInfo__description">
                                        {{reservationInfo}}
                                    </div>
                                    <div class="reservationInfo__rooms">
                                        <div v-for="(room, index) in postRooms" :key="index">
                                            <el-main class="reservationInfo__rooms-text">
                                                <el-tag
                                                :key="room"
                                                closable
                                                :disable-transitions="false"
                                                @close="handleAlertClose(room)">
                                                {{roomsInfo[index]}}
                                                </el-tag>
                                            </el-main>
                                        </div>
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
    },
    computed: {
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
                this.rackRooms.forEach(room => {
                    var isTaken = false;
                    var date = moment(this.start);
                    var end = moment(this.end);
                    while (date <= end) {
                        try {
                            isTaken = this.rackDictionary[room.id][this.format(date)];
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
                var check = this.email.split("@");
                if (check.length > 1) {
                    var secondCheck = check[1].split(".");
                    if (secondCheck.length > 1) {
                        this.postRooms.push(this.roomId);
                        this.postRooms = this.postRooms.sort();
                        this.postDates.push([this.start, this.end]);
                        this.roomId = null;
                    }
                    else {
                        this.$message({
                    showClose: true,
                    message: 'Debe ingresar un correo válido',
                    type: 'error'
                }); 
                    }
                }
                else {
                    this.$message({
                    showClose: true,
                    message: 'Debe ingresar un correo válido',
                    type: 'error'
                }); 
                }
            }
            else {
                this.$message({
                    showClose: true,
                    message: 'Debe ingresar los datos personales del cliente',
                    type: 'error'
                });
            }
        },
        addRoomsGrouped(room) {
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
            this.roomsGrouped[index].rooms.push(room.id);
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
                        this.checkInName = '';
                        this.documentNumber = '';
                        this.email = '';
                        this.start = null;
                        this.postRooms = [];
                        this.postDates = [];
                        this.showButton = false;
                        this.$emit('newReservation', response.data);
                    })
                    .catch(error => {
                        this.$notify.error({
                            title: "Error",
                            message: "Ha ocurrido el siguiente error al intentar reservar."
                        });
                    });
                }
        },
        format(date){
            return moment(date).format("ddd DD MMMM");
        },
        formatAll(date){
            return moment(date).format("dddd DD MMMM");
        },
        handleAlertClose(room) {
            let index = this.postRooms.indexOf(room);
            this.postRooms.splice( index, 1 );
            this.postDates.splice( index, 1 );
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
.reservationButton {
    margin-top: 1vh;
}
.postRoomsInfo {
    background-color: #F5F7FA;
    color: #909399;
    border-radius: 6px;
    font-size: 14px;
    height: 32vh;
}
.reservationInfo__title {
    font-weight: bold;
    margin-bottom: 1em;
}
.reservationInfo__rooms {
    height: 15vh;
    overflow-y: scroll;
}
.reservationInfo__description {
    margin-bottom: 1em;
}
.reservationInfo__rooms-text {
    padding-top: 5px;
    padding-bottom: 0px;
}
</style>