<template>
<div class="navbar">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">Reservas</el-menu-item>
        <el-menu-item index="2">Registro</el-menu-item>
        <el-menu-item index="3">Servicios</el-menu-item>
        <el-menu-item index="4">Ayuda</el-menu-item>
    </el-menu>
</div>
</template>

<script>
export default {
    name: 'NavbarComponent',
    data() {
        return {
            activeIndex: '3',
        };
    },
    methods: {
        handleSelect(key, keyPath) {
            this.$emit('notifySelection', key);
        }
    }

}
</script>