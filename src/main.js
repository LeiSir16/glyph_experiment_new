import Vue from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import {
    Button,
    Form,
    FormItem,
    Tabs,
    TabPane,
    Container,
    Main,
    Header,
    Footer,
    Col,
    Row,
    Input,
    Radio,
    RadioGroup,
    Statistic,
    ButtonGroup,
    RadioButton,
    Notification,
    MessageBox,
    Message,
    InputNumber,
    Slider,
    Switch,
    ColorPicker
} from "element-ui";

Vue.config.productionTip = false
Vue.use(Button)
Vue.use(Slider)
Vue.use(ColorPicker)
Vue.use(Switch)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Container)
Vue.use(Main)
Vue.use(Header)
Vue.use(Footer)
Vue.use(Col)
Vue.use(Row)
Vue.use(Input)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Statistic)
Vue.use(ButtonGroup)
Vue.use(RadioButton)
Vue.use(InputNumber)
new Vue({
    render: h => h(App),
    router,
    store,
    beforeCreate() {
        Vue.prototype.$bus = this
        Vue.prototype.$notify = Notification
        Vue.prototype.$confirm = MessageBox.confirm
        Vue.prototype.$message = Message

    }
}).$mount('#app')
