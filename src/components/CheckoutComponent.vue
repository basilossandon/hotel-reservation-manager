<template>
<div class="checkout">
    <el-row :gutter="20">
        <el-col :span="11">
            <el-card class="card-box">
                <div slot="header" class="clearfix">
                    <span>Búsqueda reserva</span>
                </div>
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="Código reserva">
                        <el-input v-model="code"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" :disabled="!showButton" size="mini" @click="searchReservations()">Buscar reserva</el-button>
                    </el-form-item>
                </el-form>
                <el-collapse-transition>
                    <div class="reservation-info" v-if="reservations.length > 0">
                        <el-main>
                            <div class="reservation-info__title">Información Reserva {{reservations[0].code}}</div>

                            <div style="margin-top:2vh;">Datos Cliente:</div>
                            <ul>
                                <li>Nombre: {{reservations[0].checkInName}}</li>
                                <li>Nº Documento: {{reservations[0].documentNumber}}</li>
                            </ul>

                            <div style="margin-top:2vh;">Habitaciones:</div>
                            <div class="rooms">
                                <ul>
                                    <li v-for="(reservation, index) in reservations" :key="index">
                                        Habitación {{reservation.roomId}} desde el {{format(reservation.start)}} hasta el {{format(reservation.end)}}
                                    </li>
                                </ul>
                            </div>
                        </el-main>
                    </div>
                </el-collapse-transition>
            </el-card>
            <el-collapse-transition>
                <el-card class="card-box searchBill" v-if="reservations.length > 0">
                    <div slot="header" class="clearfix">
                        <span>Búsqueda boleta</span>
                    </div>
                    <el-form :inline="true" class="demo-form-inline">
                        <el-form-item label="Habitación" class="room-selector">
                            <el-select v-model="roomId" :disabled="reservations.length < 1" class="mini">
                                <el-option
                                    v-for="reservation in reservations"
                                    :key="reservation.roomId"
                                    :label="reservation.roomId"
                                    :value="reservation.roomId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" :disabled="!showBillButton" size="mini" @click="searchBill()">Buscar boleta</el-button>
                        </el-form-item>
                        <transition name="el-fade-in-linear">
                            <el-form-item>
                                <div class="members" v-if="!noMembers && reservation != null">
                                    <el-button class="see" type="text" @click="dialogTableVisible = true">ver huéspedes</el-button>
                                </div>
                            </el-form-item>
                        </transition>
                    </el-form>
                    <div class="room-error-text" v-if="noMembers">
                        *Esta habitación aún no cuenta con sus huéspedes registrados*
                    </div>
                </el-card>
            </el-collapse-transition>
        </el-col>
        <el-collapse-transition>
            <el-col :span="13" v-if="bill != null">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>Confirmación pago</span>
                    </div>
                    <div class="bill-info">
                        <el-main>
                            <div class="bill-info__title">
                                Boleta 
                            </div>
                            <el-main>
                                <div class="bill-info_part">
                                    <p>Subtotal habitación: {{getRoom(roomId).price * getDaysReservated(roomId)}} PEN</p>
                                    <p>Subtotal servicios: {{getTotalServices()}} PEN</p>
                                    <p></p>
                                    <p>Total: <span class="green">{{(getRoom(roomId).price * getDaysReservated(roomId)) + getTotalServices()}} PEN</span></p>
                                </div>
                            </el-main>
                        </el-main>
                    </div>
                    <el-main>
                        <div class="deleteForm">
                            <el-checkbox v-model="checked">Confirmo pago por parte de un huésped</el-checkbox>
                            <el-button type="danger" :disabled="!checked" size="mini" @click="open">Finalizar reserva</el-button>
                        </div>
                        <div class="deleteButton">
                        </div>
                    </el-main>
                </el-card>
            </el-col>
        </el-collapse-transition> 
        <el-dialog title="Listado de huéspedes" :visible.sync="dialogTableVisible" v-if="reservation != null" width="80vh">
            <el-row>
                <el-col :span="20" :offset="1">
                    <el-table :data="reservation.members">
                        <el-table-column property="name" label="Nombre" width="140"></el-table-column>
                        <el-table-column property="documentNumber" label="Nº Documento" width="140"></el-table-column>
                        <el-table-column property="country" label="País"  width="120"></el-table-column>
                        <el-table-column property="age" label="Edad"></el-table-column>
                    </el-table>
                </el-col>
            </el-row>
        </el-dialog>
    </el-row>
</div>
</template>

<script>
import axios from 'axios';
import moment from "moment";
import "moment/locale/es";

export default {
    data() {
        return {
            code: null,
            reservations: [],
            reservation: null,
            showButton: false,
            bill: null,
            rooms: [],
            services: [],
            roomId: null,
            showBillButton: false,
            noMembers: false,
            checked: false,
            dialogTableVisible: false
        };
    },
    watch: {
        code: function(value) {
            if (value != null) {
                if (value.length > 7 && value.length < 9) {
                    this.showButton = true;
                }
                else {
                    this.showButton = false;    
                }
            }
            else {
                this.showButton = false;
            }
        },
        roomId: function(value) {
            this.reservations.forEach(reservation => {
                if (reservation.roomId == value) {
                    this.reservation = reservation;
                    if (reservation.members.length == 0) {
                        this.noMembers = true;
                        this.showBillButton = false;
                    }
                    else {
                        this.noMembers = false;
                        this.showBillButton = true;
                    }
                }
            })
        }
    },
    created() {
        axios.get('http://158.170.35.185/api/rooms').then(response => {
            this.rooms = response.data;
            axios.get('http://158.170.35.185/api/services').then(response => {
                this.services = _.orderBy(response.data, ['id'], ['asc']);
            });
        });
    },
    methods: {
        deleteReservation(room) {
            var id = 0;
            this.reservations.forEach(reservation => {
                if (reservation.roomId == room) {
                    id = reservation.id;
                }
            });

            axios({
                method: "POST",
                url: "http://158.170.35.185/api/reservations/" + id + '/delete',
                data: {},
                config: {
                    headers: {
                    "Content-Type": "application/json"
                    }
                }
            })
            .then( response => {
                this.$notify({
                    title: "Finalización exitosa.",
                    message: "La reserva ha sizo finalizada correctamente.",
                    type: "success"
                }); 
                this.roomId = null;
                this.reservation = null;
                this.reservations = [];
                this.bill = null;
                this.code = null;
            })
            .catch( error => {
                this.$notify.error({
                    title: "Error al finalizar reserva.",
                    message: "La reserva no ha podido ser finalizada.",
                });
            });
        },
        searchReservations() {
            this.reservations = [],
            this.roomId = null;
            axios({
                method: "POST",
                url: "http://158.170.35.185/api/reservations/code/" + this.code,
                data: {},
                config: {
                    headers: {
                    "Content-Type": "application/json"
                    }
                }
            })
            .then( response => {
                this.reservations = response.data;
            })
            .catch( error => {
                this.$notify.error({
                    title: "Reservación no encontrada",
                    message: "El código ingresado no existe."
                });
            });
        },
        searchBill() {
            var id = 0;
            this.reservations.forEach(reservation => {
                if (reservation.roomId == this.roomId) {
                    id = reservation.billId;
                }
            });
            axios.get("http://158.170.35.185/api/bills/" + id)
            .then( response => {
                this.bill = response.data;
            })
            .catch( error => {
                this.$notify.error({
                    title: "Boleta no encontrada",
                    message: "Ocurrió un error al buscar la boleta de la reserva. Inténtelo nuevamente",
                });
            });
        },
        format(date) {
            return moment(date.split('T')[0]).format('ddd DD MMMM');
        },
        getRoom(id) {
            return this.rooms[id - this.rooms[0].id];
        },
        getDaysReservated(id) {
            var reservation = null; 
            this.reservations.forEach(res => {
                if (res.roomId == id) {
                    reservation = res;
                }
            });
            var act = moment(reservation.start.split('T')[0]);
            var ent = moment(reservation.end.split('T')[0]);
            var count = 0;
            while(act <= ent) {
                count ++;
                act.add(1, 'day');

            }
            return count;
        },
        getTotalServices() {
            if (this.bill.serviceString != null) {
                var total = 0;
                this.bill.serviceString.split(';').forEach(service => {
                    let index = parseInt(service) - this.services[0].id;
                    total += this.services[index].price;
                });
                return total;
            }
            else {
                return 0;
            }
        },
        open() {
            this.$confirm('Esta operación eliminará de manera definitiva la reserva de la habitación ' + this.roomId + '. ¿Desea continuar?', 'Finalizar reserva', {
                confirmButtonText: 'Confirmar',
                cancelButtonText: 'Cancelar',
            })
            .then(() => {
                this.deleteReservation(this.roomId);
            })
            .catch(() => {
                this.$message({
                    type: 'info',
                    message: 'Operación canceleda.'
                });          
            });
        }
    }

}
</script>

<style scoped>
.checkout {
    height: 90vh !important;
}
.see {
    font-size: 13px;
    margin-left: 4vh;
}
.reservation-info, .bill-info {
    margin-top: 3vh;
    color: #909399;
    border: 1px solid #ebeef5;
    border-radius: 6px;
    font-size: 14px;
}
.reservation-info__title {
    font-weight: bold;
    margin-bottom: 4vh;
}
.rooms {
    height: 10vh;
}
.bill-info__title {
    font-weight: bold;
    margin-bottom: 1vh;
}
.room-price__total {
    color: #67C23A;
    font-weight: bold;
}
.room-error-text {
    margin-left: 2vh;
    color: #F56C6C;
    font-size: 13px;
}
.green {
    font-weight: bold;
    color:#67C23A;
}
.searchBill {
    margin-top: 2vh;
}
.deleteForm {
    float: right;
}
.deleteButton {
    float: right;
}

.el-dialog {
    height: 100%;
}
.el-dialog__header {
    padding: 20px 20px 10px;
}
</style>
