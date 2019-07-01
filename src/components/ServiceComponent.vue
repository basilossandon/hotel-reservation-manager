<template>
  <div class="service">
        <el-row>
            <el-col :span="8">
                <el-card class="card-box reservation-box">
                    <div slot="header" class="clearfix">
                        <span>Búsqueda habitación</span>
                    </div>
                    <el-form label-position="right" label-width="100px" :inline="true">
                        <el-form-item label="Habitación" class="room-selector">
                            <el-select
                                v-model="roomId"
                                filterable
                                remote
                                reserve-keyword
                                :remote-method="remoteMethod"
                                :loading="loading">
                                <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                                </el-option>
                            </el-select>
                            <el-button type="success" size="small" style="margin-left: 1em;" @click="searchReservationsByRoom()">
                                Buscar
                            </el-button>
                        </el-form-item>
                    </el-form>
                    <el-collapse-transition>
                        <div class="reservation-searched" v-if="reservationSearched != null">
                            <el-main>
                                <el-row>
                                    <el-col class="room-info">
                                        <el-main>
                                            <div class="room-info__title">
                                                <span>Reserva actual de la habitación {{reservationSearched.roomId}}</span>
                                            </div>

                                            <div class="room-info__detail">
                                                Código: {{reservationSearched.code}}
                                            </div>
                                            <div class="room-info__detail">
                                                Cliente: {{reservationSearched.checkInName}}
                                            </div>
                                            <div class="room-info__detail">
                                                Inicio: {{format(reservationSearched.start)}}
                                            </div>
                                            <div class="room-info__detail">
                                                Término: {{format(reservationSearched.end)}}
                                            </div>
                                            <div class="room-info__detail">
                                                <span>Huéspedes Registrados:</span>
                                            </div>
                                            <ul>
                                                <li v-for="(member, index) in reservationSearched.members" :key="index">
                                                    {{member.name}}
                                                </li>
                                            </ul>
                                            <div v-if="reservationSearched.members.length == 0" class="noMembers">
                                                * No hay huéspedes registrados *
                                            </div>
                                        </el-main>
                                    </el-col>
                                </el-row>
                                <div class="ask-for-service-container" v-if="reservationSearched != null">
                                        <el-button type="primary" :disabled="!showButtonService" size="small" @click="handleShowForm()">Solicitar Servicios</el-button>
                                </div>
                            </el-main>
                        </div>
                    </el-collapse-transition>
                </el-card>
            </el-col>
            <el-col class="service-form" v-if="showForm">
                <el-card class="box-card service-form-box">
                    <div slot="header" class="clearfix">
                        <span>Formulario solicitud servicio</span>
                    </div>
                    <el-main>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-collapse accordion>
                                    <el-collapse-item v-for="(group, index) in servicesGrouped" :key="index" :name="index">
                                        <template slot="title">
                                        {{labels[index]}}<i class="header-icon el-icon-information"></i>
                                        </template>
                                        <el-row>
                                            <el-col :span="4" :offset="16" class="price-column-title">Precio</el-col>
                                            <el-col :span="4">Opción</el-col>
                                        </el-row>
                                        <el-row v-for="(service, count) in group" :key="count">
                                            <el-col :span="16" class="services-item">
                                                {{service.name}}
                                            </el-col>
                                            <el-col :span="4">
                                                <span class="service-price">{{service.price}} PEN</span>
                                            </el-col>
                                            <el-col :span="4">
                                                <el-button class="iconButton" type="text" size="mini" @click="addServiceToList(service.id)"> Añadir </el-button>
                                            </el-col>
                                        </el-row>
                                    </el-collapse-item>
                                </el-collapse>
                            </el-col>
                            <el-col :span="11" :offset="1">
                                <div class="summary">
                                    <el-main>
                                        <div class="services-title">
                                            Sevicios solicitados:
                                        </div>
                                        <div class="services-list">
                                            <div v-for="(id, index) in postServicesUnique" :key="index" class="service-list__item"> 
                                                <el-row>
                                                    <el-col :span="14"> {{getService(id)}}</el-col>
                                                    <el-col :span="4">
                                                        (x{{postServicesAmounts[index]}})
                                                    </el-col>
                                                    <el-col :span="6">
                                                        <el-button icon="el-icon-delete" type="text" class="delete-button" @click="removeService(id)">Borrar</el-button>
                                                    </el-col>
                                                </el-row>
                                            </div>
                                            <div class="total-price">
                                                Total: <span>{{total}} PEN</span>
                                            </div>
                                        </div>
                                    </el-main>
                                </div>
                                <div class="post-button">
                                    <el-button type="success" :disabled="postServices.length == 0" size="mini" @click="updateBill()">Confirmar Solicitud</el-button>
                                </div>
                            </el-col>
                        </el-row>
                    </el-main>
                </el-card>
            </el-col>
        </el-row>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import "moment/locale/es";

export default {
    data() {
        return {
            rooms: [],
            reservations: [],
            registers: [],
            services: [],
            currentRow: null,
            search: '',
            bill: null,
            labels: [
                'Sopas y cremas',
                'Entradas',
                'Especialidades saludables',
                'Pescados y mariscos',
                'Pastas y arroces',
                'Carnes',
                'Sándwich y hamburguesas',
                'Menú Infantil',
                'Bebestibles',
            ],

            roomId: null,
            options: [],
            value: [],
            list: [],
            loading: false,
            reservationSearched: null,

            showButtonService: false,
            showForm: false,

            total: 0,
            postServices: [],

        }
    },
    created() {
        axios.get('localhost:8080/api/rooms')
        .then(response => {
            this.rooms = response.data;
            this.list = this.rooms.map(item => {
                return { value: item.id, label: item.id };
            });
            axios.get('localhost:8080/api/reservations/')
            .then(response => {
                axios.get('localhost:8080/api/services/')
                .then(response => {
                    this.services = _.orderBy(response.data, ['id'], ['asc']);
                });
                this.reservations = _.reverse(response.data);
            });
        });
    },
    computed: {
        servicesGrouped: function() {
            var services = [ [],[],[],[],[],[],[],[],[]];
            this.services.forEach(service => {
                var index = 0;
                this.labels.forEach(label => {
                    if (service.category == label) {
                        services[index].push(service);
                    }
                    index++;
                })
            })
            return services;
        },
        postServicesUnique: function() {
            return _.sortedUniq(_.uniq(this.postServices));
        },
        postServicesAmounts: function() {
            var amounts = [];
            this.postServicesUnique.forEach(service => {
                var count = 0;
                this.postServices.forEach(post => {
                    if (post == service) {
                        count ++;
                    }
                })
                amounts.push(count);
            })
            return amounts;
        },
    },
    methods: {
        handleCurrentChange(val) {
            this.currentRow = val;
        },
        remoteMethod(query) {
            this.options = [];
            this.rooms.forEach(room => {
                if (room.id.toString().includes(query)) {
                    this.options.push(
                        {
                            value: room.id,
                            label: room.id
                        }
                    );
                }
            })
        },
        searchReservationsByRoom() {
            this.reservationSearched = null;
            var today = moment().format('YYYY-MM-DD');
            this.reservations.forEach(reservation => {
                if (reservation.roomId == this.roomId) {
                    var start = reservation.start.split('T')[0];
                    var end   = reservation.end.split('T')[0];
                    if (moment(today).isSameOrAfter(start)) {
                        if (moment(today).isSameOrBefore(end)) {
                            if (reservation.members.length > 0) {
                                this.showButtonService = true;
                            }
                            this.reservationSearched = reservation;
                            return;
                        }
                    }
                }
            });
            this.roomId = null;
        },
        handleShowForm() {
            this.showForm = true;
        },
        addServiceToList(id) {
            this.postServices.push(id);
            this.total += this.services[id - this.services[0].id].price;

        },
        removeService(id) {
            this.total -= this.services[id - this.services[0].id].price;
            this.postServices.splice(this.postServices.indexOf(id), 1);
        },
        getService(id) {
            let first = this.services[0].id;
            return this.services[id - first].name;
        },
        updateBill() {
            axios.get('localhost:8080/api/bills/' +  this.reservationSearched.billId)
            .then(response => {
                this.bill = response.data;
                this.postServicesToRoom();
            })
            .catch( error => {
                this.$notify.error({
                    title: "No se ha podido solicitar los servicios.",
                    message: error.message,
                });
            });
                
        },

        postServicesToRoom() {
            if (this.bill.serviceString == null) {
                this.bill.serviceString = '';
            }
            else {
                this.bill.serviceString += ';';
            }
            axios({
                method: "POST",
                url: "localhost:8080/api/reservations/" + this.reservationSearched.id + '/addService',
                data: {
                    serviceString:  this.bill.serviceString + this.postServices.join(";")
                },
                config: {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            })
            .then( response => {
                this.search = '';
                this.reservationSearched = null;
                this.total = 0;
                this.postServices = [];
                this.showForm = false;
                this.$notify({
                    title: "Servicios solicitados",
                    message: 'Los servicios a la habitacion han sido solicitados correctamente.',
                    type: 'success'
                });
            })
            .catch( error => {
                this.$notify.error({
                    title: "No se ha podido solicitar los servicios.",
                    message: error.message,
                });
            });
        },

        format(date) {
            return moment(date.split('T')[0]).format('dddd DD MMMM');
        }
    }
}
</script>

<style scoped>
.service {
    height: 90vh;
}
.registersTable {
    height: 45vh;
}
.right-button {
    margin-right: 1.5vh;
}
.reservation-box, .service-form-box {
    height: 88vh;
}
.room-info {
    border: 1px solid #ebeef5;
    border-radius: 6px;
    font-size: 14px;
}
.room-info__title {
    font-weight: bold;
    margin-bottom: 2vh;
}
.room-info__detail {
    margin-bottom: 1vh;
}
.members {
    margin-left: 2em;
}
.noMembers {
    margin-left: 2em;
    color: #F56C6C;
    font-size: 13px;
}
.ask-for-service-container {
    margin-top: 2vh;
    float: right;
}
.service-form {
    margin-left: 2vh;
    width: 63.6vw;
}
.services-item {
    margin-bottom: 1vh;
}
.service-price {
    color: #67C23A;
}
.iconButton {
    padding: 0;
    margin-left: 0.3vh;
}
.summary {
    background-color: #F5F7FA;
    color: #909399;
    border: 1px solid #ebeef5;
    border-radius: 6px;
    font-size: 14px;
    /* height: 32vh; */
}
.services-list {
    /* height: 23vh; */
    /* overflow-y: scroll; */
}
.post-button {
    margin-top: 2vh;
    float: right;
}
.services-title {
    font-weight: bold;
    margin-bottom: 2vh;
}
.service-list__item {
    margin-bottom: 0.6vh;
}
.delete-button {
    padding: 0;
    color: #F56C6C;
}
.total-price {
    font-weight: bold;
    margin-top: 2vh;
    float: right;
}
.total-price > span {
    color: #67C23A;
}
</style>
