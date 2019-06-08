<template>
<div id="app">
	<el-header>
		<NavbarComponent @notifySelection="handleContent"/>
	</el-header>
	<el-row>
		<el-main>
			<el-col :span="24">
				<ContentComponent :keyForDisplay="contentSelected"/>
			</el-col>
		</el-main>
	</el-row>
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
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
