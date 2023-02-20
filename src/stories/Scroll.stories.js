import ScrollDemo from './scroll';

export default {
  title: 'Example/Scroll',
  component: ScrollDemo,
};

const Template = () => ({
  components: { 
    ScrollDemo 
  },
  template: '<ScrollDemo />',
});
export const Scroll = Template.bind({});
