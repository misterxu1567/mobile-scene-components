import TextFoldDemo from './text-fold';

export default {
  title: 'Example/TextFold',
  component: TextFoldDemo
};

const Template = () => ({
  components: { 
    TextFoldDemo 
  },
  template: '<TextFoldDemo />',
});

export const TextFold = Template.bind({});
