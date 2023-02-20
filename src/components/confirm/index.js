import Vue from 'vue';
import Confirm from './index.vue';

let instance = null;

const initInstance = () => {
  const ConfirmConstructor = Vue.extend(Confirm);
  instance = new ConfirmConstructor();
  instance.$mount(document.createElement('div'));
}

initInstance();

const confirm = obj => {
  let text = '';
  let duration = 3000;
  let type = 'spread';
  if (typeof obj === 'string') {
    text = obj;
  } else {
    text = obj.text;
    duration = obj.duration || duration;
    type = obj.type || type;
  }
  instance.text = text;
  instance.type = type;
  document.body.appendChild(instance.$el);
  clearTimeout(instance.timer);
  instance.timer = setTimeout(() => {
    instance.type = type + 'Out';
    setTimeout(()=>{
      instance.$el.remove();
    }, 1000)
  }, duration);
};

confirm.install = vue => {
  vue.prototype.$confirm = confirm;
}

export default confirm;