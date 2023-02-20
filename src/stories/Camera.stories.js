import CameraDemo from './camera';

export default {
  title: 'Example/Camera',
  component: CameraDemo,
};

const Template = () => ({
  components: { 
    CameraDemo 
  },
  template: '<CameraDemo />',
});

export const Camera = Template.bind({});
