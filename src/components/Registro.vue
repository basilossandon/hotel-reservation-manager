<template>
  <el-row :gutter="40">
    <el-col :span="16">
      <el-card class="box-card registro-form">
        <div slot="header" class="clearfix registro-form__title">Formulario de check in</div>
        <el-main>
          <el-form ref="form" label-position="left" label-width="140px">
            <el-row :gutter="30">
              <el-col :span="12">
                <div class="form-title">Datos del cliente </div>

                <el-form-item label="Nombre">
                  <el-input v-model="name" type="text"></el-input>
                </el-form-item>

                <el-form-item label="Edad">
                  <el-input v-model="age" type="number" :min="1"></el-input>
                </el-form-item>

                <el-form-item label="Habitacion">
                  <el-input v-model="room_id" :disabled=" (code != null)"></el-input>
                </el-form-item>

                <!-- <el-form-item label="tipo de documento">
                                <el-select v-model="documentType">
                                    <el-option
                                    v-for="opcion in opcionDocumento"
                                    :key="opcion.valor"
                                    :label="opcion.etiqeta"
                                    :value="opcion.etiqueta">
                                    </el-option>
                                </el-select>
                </el-form-item>-->
              </el-col>
              <el-col :span="12">
                <el-form-item label="Nª Documento">
                  <el-input v-model="documentNumber"></el-input>
                </el-form-item>
                <el-form-item label="Nacionalidad (pais)">
                  <el-select v-model="country">
                    <el-option
                      v-for="item in origen"
                      :key="item.origen"
                      :label="item.name"
                      :value="item.name"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="Fecha de Inicio">
                  <el-date-picker
                    id="startPicker"
                    v-model="start"
                    :editable="false"
                    type="date"
                    format="MM/dd/yyyy"
                    :picker-options="startPickerOptions"
                    :disabled=" (code != null)"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="Fecha de Salida">
                  <el-date-picker
                    v-model="end"
                    :editable="false"
                    type="date"
                    format="MM/dd/yyyy"
                    :disabled="start == null"
                    :picker-options="endPickerOptions"
                  ></el-date-picker>
                </el-form-item>

                <el-button type="primary" plain size="medium" @click="postRegistro">Guardar check-in</el-button>
                <!-- <el-button  type="primary" plain size="medium" @click="guardarRegistro()"  >Guardar Registro</el-button> -->
              </el-col>
            </el-row>
          </el-form>
        </el-main>
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card class="box-card freservas-table">
        <div slot="header" class="clearfix reservations-table__title">
          consultar fecha de reservaciones 
        </div>
        <el-form>
          <el-form-item label="Id reserva">
            <el-input v-model="code"></el-input>
            <el-button type="primary" plain size="medium" @click="buscar()">Buscar reserva</el-button>
          </el-form-item>
        </el-form>


        <el-table :data="codigo" style="width: 100%">
          <el-table-column prop="start" label="Fecha inicio" width="180"></el-table-column>
          <el-table-column prop="end" label="Fecha de termino" width="180"></el-table-column>
        </el-table>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import axios from "axios";
import moment from "moment";
import "moment/locale/es";
import json from "../assets/json/nacionalidad.json";

// function makeid(length) {
//   var result = "";
//   var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
//   var charactersLength = characters.length;
//   for (var i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength));
//   }
//   return result;
// }

export default {
  data() {
    return {
      origen: json,
      id: null,
      country: "",
      documentType: "",
      documentNumber: "",
      room_id: null,
      age: null,
      name: "",
      start: null,
      end: null,

      registro: "",
      code: null,
      codigo: null,

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
  methods: {
    format(date) {
      return moment(date).format("ddd DD MMMM");
    },

    formatAll(date) {
      return moment(date).format("dddd DD MMMM");
    },

    buscar() {
      var direc = this.code;
      axios({
        method: "POST",

        url: "http://157.230.12.110:8080/api/reservations/code/" + direc,
        data: {},
        config: {
          headers: {
            "Content-Type": "application/json"
          }
        }
      })
        .then(response => {
          console.log(response.data);
        //   this.codigo = response.data;

             this.codigo = [
                 {
                     start: response.data[0].start,
                     end: response.data[0].end,
                     id: response.data[0].id
                 }
             ]
                         console.log("codigo", this.codigo);
                         console.log(this.codigo[0].id);
        })
        .catch(error => {});
    },

    postRegistro() {


      axios({
        method: "POST",
        url: "http://157.230.12.110:8080/api/members",
        data: {

          age: this.age,
          country: this.country,
          documentNumber: this.documentNumber,
          name: this.name,
          reservationId: this.codigo[0].id
        },
        config: {
          headers: {
            "Content-Type": "application/json"
          }
        }
      })
        .then(response => {
          console.log(response);
        //   this.$notify({
        //     title: "Reservación Creada",
        //     message: "Se ha registrado exitosamente",
        //     type: "success"
        //   })
        })
        .catch(error =>{
        //   this.$notify.error({
        //     title: "Error",
        //     message: "Ha ocurrido un error al intentar realizar el registro"
        //   })
        });
    }
  }
};
</script>


<style>
.el-notification,
.right {
  font-family: "Avenir", Helvetica, Arial, sans-serif !important;
}
.registro-table,
.registro-form {
  height: 120vh;
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
</style>