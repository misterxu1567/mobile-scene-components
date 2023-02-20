import Vue from 'vue';
import Loading from './index.vue';

const initInstance = () => {
  const LoadingConstructor = Vue.extend(Loading);
  let instance = new LoadingConstructor();
  instance.$mount(document.createElement('div'));
  document.body.appendChild(instance.$el);
  return instance;
}

const loading = initInstance();

loading.install = vue => {
  vue.prototype.$loading = loading;
}

export default loading;