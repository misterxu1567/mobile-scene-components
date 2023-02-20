import SliderDemo from './slider';

export default {
  title: 'Example/Slider',
  component: SliderDemo,
};

const Template = () => ({
  components: { 
    SliderDemo 
  },
  template: '<SliderDemo />',
});

export const Slider = Template.bind({});
