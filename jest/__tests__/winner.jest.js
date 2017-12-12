import React from 'react';
import renderer from 'react-test-renderer';
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });
import { shallow, mount, render } from 'enzyme';
require("babel-polyfill");
import WinnerPrice from '../../app/webpack/components/admin/admin_shared/winner';


const setup = () => {
  // 模拟 props
const props = {
    no_winner:{
        data:null,
        auction:{}
    },
    winner:{
      data:{
        "lowest_average_price": "0.122211797241865731202553966",
        "status": "win",
        "lowest_price_bidder": "Union Power",
      },
      auction: {}
  }
    // Jest 提供的mock 函数
    // onAddClick: jest.fn( (e) => {
    // })
}

const no_wrapper = shallow(<WinnerPrice showOrhide="hide" winner={props.no_winner} />)
const wrapper = shallow(<WinnerPrice showOrhide="hide" winner={props.winner} />)
  return {
    props,
    no_wrapper,
    wrapper
  }
}

describe('WinnerPrice', () => {
  const { wrapper, props,no_wrapper } = setup();
  it('WinnerPrice Component should no data', () => {
    expect(no_wrapper.find('.winnerPrice_main').text()).toEqual('no data');
  });
  
  it('WinnerPrice Component have data', () => {
    expect(wrapper.find('.bidder_name').text()).toEqual('Union Power');
    expect(wrapper.find('.bidder_price').text()).toEqual('$ 0.1222/kWh');
  })
})





