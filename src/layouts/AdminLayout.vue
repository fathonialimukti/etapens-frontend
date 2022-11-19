<template>
  <Navbar />
  <sidebar-menu :menu=" navigation " />
  <router-view />
  <Footer />
</template>

<script>
import Navbar from "../components/Navbar.vue"
import Footer from "../components/Footer.vue"
import { SidebarMenu } from 'vue-sidebar-menu'
import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'

const navigation = [ {
  header: 'Main Navigation',
  hiddenOnCollapse: true
}, {
  href: '/admin',
  title: "Admin Dashboard",
  icon: 'fa fa-user'
}, {
  href: '/admin/list-backend',
  title: "List Backend",
  icon: 'fa fa-user',
}, {
  href: '/admin/list-database',
  title: "List Database Request",
  icon: 'fa fa-user',
}, {
  href: '/admin/list-student',
  title: "List Student",
  icon: 'fa fa-user',
}, {
  href: '/admin/list-lecturer',
  title: "List Lecturer",
  icon: 'fa fa-user',
}, {
  href: '/admin/system-information',
  title: "System Information",
  icon: 'fa fa-user',
} ]


export default {
  components: {
    Navbar,
    Footer,
    SidebarMenu
  },
  data () {
    return {
      navigation,
    }
  },
}
</script>

<style >
.vsm--menu {
  margin-top: 6rem !important;
}

.v-sidebar-menu {
  z-index: 20;
}
</style>