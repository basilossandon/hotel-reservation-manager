<template>
<div id="app">
	<el-header>
			<NavbarComponent @notifySelection="handleContent"/>
	</el-header>
	<ContentComponent :keyForDisplay="contentSelected"/>
</div>
</template>

<script>
import NavbarComponent from './components/NavbarComponent.vue'
import ContentComponent from './components/ContentComponent.vue'

export default {
  name: 'app',
  data() {
	return {
	  contentSelected: 1
	}
  },
  components: {
	NavbarComponent,
	ContentComponent
  },
  methods: {
	handleContent(key) {
	  this.contentSelected = key;
	}
  }
}
</script>

<style>
body {
  margin: 0px;
  padding: 0px;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  color: #606266;
  font-size: 14px;
}
</style>
