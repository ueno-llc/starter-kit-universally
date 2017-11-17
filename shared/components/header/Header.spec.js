import React from 'react';
import { shallow } from 'enzyme';
import { Link } from 'react-router-dom';

import Header from 'components/header';

it('contains a <header>', () => {
  const wrapper = shallow(<Header />);

  expect(wrapper.find('header').length).toEqual(1);
});

it('contains link to home', () => {
  const wrapper = shallow(<Header />);

  expect(wrapper.find(Link).prop('to')).toEqual('/');
});
