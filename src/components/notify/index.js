import Vue from 'vue';
import Notify from './index.vue';

let instance = null;

const initInstance = () => {
  const NotifyConstructor = Vue.extend(Notify);
  instance = new NotifyConstructor();
  instance.$mount(document.createElement('div'));
}

initInstance();

const notify = obj => {
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

notify.install = vue => {
  vue.prototype.$notify = notify;
}

export default notify;