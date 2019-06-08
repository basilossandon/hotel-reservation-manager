<template>
<div class="navbar">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">Reservas</el-menu-item>
        <el-menu-item index="2">Registro</el-menu-item>
        <el-menu-item index="3">Ayuda</el-menu-item>
    </el-menu>
</div>
</template>

<script>
export default {
    name: 'NavbarComponent',
    data() {
        return {
            activeIndex: '1',
        };
    },
    props: {

    },
    methods: {
        handleSelect(key, keyPath) {
            this.$emit('notifySelection', key);
        }
    }

}
</script>
