import AudioPlayerDemo from './audio-player';

export default {
  title: 'Example/AudioPlayer',
  component: AudioPlayerDemo
};

const Template = () => ({
  components: { 
    AudioPlayerDemo 
  },
  template: '<AudioPlayerDemo />',
});

export const AudioPlayer = Template.bind({});
