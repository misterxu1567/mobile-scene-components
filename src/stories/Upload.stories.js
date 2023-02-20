import UploadDemo from './upload';

export default {
  title: 'Example/Upload',
  component: UploadDemo,
};

const Template = () => ({
  components: { 
    UploadDemo 
  },
  template: '<UploadDemo />',
});

export const Upload = Template.bind({});
