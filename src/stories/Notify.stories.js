import NotifyDemo from './notify';

export default {
  title: 'Example/Notify',
  component: NotifyDemo,
};

const Template = () => ({
  components: { 
    NotifyDemo 
  },
  template: '<NotifyDemo />',
});

export const Notify = Template.bind({});

