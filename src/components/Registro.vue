<template>
  <el-row :gutter="40">
    <el-col :span="8">
      <el-form>
        <el-form-item label="¿Tiene reservacion?">
        <el-switch v-model="form.switch"></el-switch>
      </el-form-item>
      </el-form>
      <el-card class="box-card freservas-table">
        <div
          slot="header"
          class="clearfix reservations-table__title"
        > <p>necesitas buscar tu reserva para hacer el check in </p></div>
        <el-form>
          <el-form-item label="Codigo de reserva" >
            <el-input v-model="code" :disabled="form.switch==false"></el-input>
            <el-button
              type="primary"
              :disabled="form.switch==false"
              plain
              size="medium"
              @click="buscar()"
            >Buscar reserva</el-button>
            <p>consultar fecha(s) de reservacion(es)</p> 
          </el-form-item>
        </el-form>

        <el-table :data="codigo" style="width: 100%">
          <el-table-column prop="start" label="Fecha inicio" width="180"></el-table-column>
          <el-table-column prop="end" label="Fecha de termino" width="180"></el-table-column>
        </el-table>
      </el-card>
    </el-col>
    <el-col :span="16">
      <el-card class="box-card registro-form">
        <div slot="header" class="clearfix registro-form__title">Formulario de check in</div>
        <el-main>
          <el-form ref="form" label-position="left" label-width="140px">
            <el-row :gutter="30">
              <el-col :span="12">
                <div class="form-title">Datos del cliente</div>

                <el-form-item label="Nombre">
                  <el-input v-model="name" type="text"></el-input>
                </el-form-item>

                <el-form-item label="Edad">
                  <el-input v-model="age" type="number" :min="1"></el-input>
                </el-form-item>

                

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

                <el-button type="primary" plain size="medium" @click="postRegistro" :disabled="(form.switch==false)">Guardar check-in</el-button>
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
                
                <el-form-item label="Habitacion">
                  <el-input v-model="room_id" :disabled=" (form.switch == true)"></el-input>
                </el-form-item>

                <el-form-item label="Fecha de Inicio">
                  <el-date-picker
                    id="startPicker"
                    v-model="start"
                    :editable="false"
                    type="date"
                    format="MM/dd/yyyy"
                    :picker-options="startPickerOptions"
                    :disabled="form.switch==true"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item label="Fecha de Salida">
                  <el-date-picker
                    v-model="end"
                    :editable="false"
                    type="date"
                    format="MM/dd/yyyy"
                    :disabled="form.switch==true"
                    :picker-options="endPickerOptions"
                  ></el-date-picker>
                </el-form-item>

                
                <!-- <el-button  type="primary" plain size="medium" @click="guardarRegistro()"  >Guardar Registro</el-button> -->
              </el-col>
            </el-row>
          </el-form>
        </el-main>
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
      id_reservation: null,
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
      codigo: [],
      form:{
        switch: true
      },
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
          //  console.log(response.data);
          this.codigo = response.data;

          //  let respuesta = response.data;
          // console.log(respuesta);

          // let largo = response.data.length;

          // for(var i=0; i=largo; i++){
          //     // respuesta[i];
          //     console.log(respuesta[i]);
          // }

          // console.log(this.codigo);
          // response.data.forEach(function(element) {
          //     let aux  = [
          //               start: element.start,
          //               end: element.end,
          //               id: element.id
          //     ]

          //       console.log(element);
          //       this.codigo.push(aux[element]);
          // })
          // console.log(this.codigo);
          // ;
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
          this.$notify({
            title: "check in guardado",
            message: "Se ha registrado exitosamente",
            type: "success"
          });
        })
        .catch(error => {
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