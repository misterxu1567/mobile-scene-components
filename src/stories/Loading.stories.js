import LoadingDemo from './loading';

export default {
  title: 'Example/Loading',
  component: LoadingDemo,
};

const Template = () => ({
  components: { 
    LoadingDemo 
  },
  template: '<LoadingDemo />',
});

export const Loading = Template.bind({});

