import 'react-native';
import React from 'react';
import ChatScreen from '../src/utils/globalupdate';

import renderer from 'react-test-renderer';

it('renders correctly', () => {
  renderer.create(<ChatScreen />);
  console.log(renderer.toJSON());
});
