<template>
<div class="checkout">
    <el-row>
        <el-col :span="10">
            <el-card class="card-box">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="Código Reservación">
                        <el-input v-model="code"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="danger" :disabled="!showButton" size="small" @click="searchReservations()">Finalizar Reserva</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </el-col>
    </el-row>
</div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            code: null,
            reservations: [],
            showButton: false
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
        }
    },
    methods: {
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
                this.reservations = response.data;
                this.code = null;
                this.reservations.forEach(reservation => {
                    axios({
                        method: "POST",
                        url: "http://157.230.12.110:8080/api/reservations/" + reservation.id + '/delete',
                        data: {},
                        config: {
                            headers: {
                            "Content-Type": "application/json"
                            }
                        }
                    })
                    .then( response => {

                    })
                    .catch( error => {
                        this.$notify({
                            title: "Error al finalizar reserva.",
                            message: "La reserva no ha podido ser finalizada.",
                            type: "error"
                        });
                    });
                });
            })
            .catch( error => {
                this.$notify({
                    title: "Reservación no encontrada",
                    message: "El código ingresado no existe",
                    type: "error"
                });
            });
        },
    }

}
</script>

<style scoped>
.checkout {
    height: 90vh !important;
}
</style>
