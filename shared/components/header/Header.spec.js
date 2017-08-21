import React from 'react';
import { shallow } from 'enzyme';
import { Link } from 'react-router-dom';

import UenoLogoSvg from 'assets/images/ueno-logo.svg';

import Header from 'components/header';

it('contains the Ueno. logo', () => {
  const wrapper = shallow(<Header />);
  expect(wrapper.find(UenoLogoSvg).length).toEqual(1);
});

it('contains link to home', () => {
  const wrapper = shallow(<Header />);
  expect(wrapper.find(Link).prop('to')).toEqual('/');
});
