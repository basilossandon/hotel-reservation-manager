<template>
<el-row :gutter="40">
      <el-col :span="18">
        <el-card class="box-card registro-form">
            <div slot="header" class="clearfix registro-form__title">
                  Formulario de check in
            </div>
            <el-main>
                <el-form ref="form" label-position="left" label-width="140px">
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <div class="form-title">
                                Datos del cliente
                            </div>
                            <el-form-item label="Nombre(s)">
                                <el-input v-model="name"  ></el-input>
                            </el-form-item>

                            <el-form-item label="Apellidos">
                                <el-input v-model="last_name"></el-input>
                            </el-form-item>

                            <el-form-item label="Edad">
                                <el-input v-model="age" type="number" :min="1"></el-input>
                            </el-form-item>

                            <el-form-item label="tipo de documento">
                                <el-select v-model="documentType">
                                    <el-option 
                                    v-for="opcion in opcionDocumento"
                                    :key="opcion.valor"
                                    :label="opcion.etiqeta"
                                    :value="opcion.etiqueta">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            

                            <el-form-item label="Nª Documento">
                                <el-input v-model="documentNumber"></el-input>
                            </el-form-item>
                            <el-form-item label="Nacionalidad (pais)" >
                                <el-select v-model="country"  >
                                    <el-option
                                    v-for="item in origen"
                                    :key="item.origen"
                                    :label="item.name"
                                    :value="item.name">
                                    </el-option>
                                </el-select>
                            </el-form-item>

                            
                        </el-col>
                        <el-col :span="12">
                            <div class="form-title">
                                Periodo
                            </div>
                            <el-form-item label="Fecha de llegada">
                                    <el-date-picker
                                    id="startPicker"
                                    v-model="start"
                                    :editable="false"
                                    type="date"
                                    format="MM/dd/yyyy"
                                    >
                                    </el-date-picker>
                            </el-form-item>
                            <el-form-item label="Fecha de Salida">
                                <el-date-picker
                                    v-model="end"
                                    :editable="false"
                                    type="date"
                                    format="MM/dd/yyyy"
                                    >
                                </el-date-picker>
                            </el-form-item>
                            
                            <el-form-item label="Habitacion">
                                <el-input v-model="room"  ></el-input>
                            </el-form-item>
                            
                            <el-button  type="primary" plain size="medium" @click="guardarRegistro()"  >Guardar Registro</el-button>
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
import json from '../assets/json/nacionalidad.json';
    
export default {
    data(){
        return {
            origen: json,
            country: '',
            documentType: '',
            documentNumber: '',
            name:'',
            last_name:'',
            start:'',
            end:'',
            age:0,
            valor:'',
            room: 0,
            opcionDocumento:[{
                valor: 'Cedula',
                etiqueta: 'Cedula'
            },{
                valor: 'Pasaporte',
                etiqueta: 'Pasaporte'
            },{
                valor: 'Otro',
                etiqueta: 'otro'
            }]
        }
        
    }
    
    
}
</script>


<style>
.el-notification,
.right {
  font-family: "Avenir", Helvetica, Arial, sans-serif !important;
}
.registro-table, .registro-form{
    height: 80vh;
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