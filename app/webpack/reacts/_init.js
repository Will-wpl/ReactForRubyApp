// logic for the React -- exploration only
// import React from "react";
// import ReactDOM from "react-dom";
//
// import { connect } from "react-redux";
// import { Provider } from "react-redux";
// import { createStore, applyMiddleware } from "redux";
// import thunk from "redux-thunk";
//
// import Constants from '../javascripts/constants';
//
// /**
//  * Return the react attributes of an element, as a object
//  *
//  * The react elements are in the form of `react-[attribute_name]`
//  * @param element
//  */
// function reactAttributes(element){
//   var result = {};
//
//   const attrs = element.attributes;
//   for(var i = 0 ; i < attrs.length ; i++){
//     const attr = attrs[i];
//
//     if(attr.name.startsWith('react-')){
//       const key = attr.name.substr(6);
//       result[key] = attr.value == '0' ? false : attr.value;
//     }
//   }
//   return result;
// }
//
// document.addEventListener("DOMContentLoaded", function() {
//   var componentsToRender = [];
//
//   const selected = document.querySelectorAll("div.react-component[component]");
//   selected.forEach(function(ele) {
//     const component_name = ele.getAttribute("component");
//
//     componentsToRender.push({ component_name, ele });
//   });
//
//   window.ReactElements = {};
//
//   function render() {
//     const ReactComponents = require("./_exports");
//
//     componentsToRender.forEach(function(obj) {
//       const { component_name, ele } = obj;
//
//       if (!ReactComponents[component_name]) {
//         console.error("undefined component: ", component_name);
//         return;
//       }
//
//       var component = ReactComponents[component_name];
//       var element;
//
//       // redux component
//       if (component.reducer) {
//         var reducer = function(state, action) {
//           if (action.type === "init")
//             return Object.assign({}, state, action.data);
//           else return component.reducer(state, action);
//         };
//
//         if (!obj.store) {
//           obj.store = component.store = createStore(
//             reducer,
//             applyMiddleware(thunk)
//           );
//           obj.first_store = true;
//         }
//
//         obj.element = element = React.createElement(
//           Provider,
//           { store: obj.store },
//           React.createElement(connect(s => s)(component.react))
//         );
//
//         if (obj.first_store) {
//           obj.first_store = false;
//           const initData = Object.assign(reactAttributes(ele), gon);
//           obj.store.dispatch({type: "init", data: initData});
//         }
//       } else {
//         element = React.createElement(component.react, gon);
//       }
//
//       const ref = ele.getAttribute('ref');
//
//       const renderedEle = ReactDOM.render(element, ele);
//
//       // 2 level of _component when redux, for [Provider] -> [Connect]
//       if(ref) ReactElements[ref] = obj.store ? renderedEle._component._component : renderedEle;
//     });
//   }
//
//   if (module.hot) {
//     module.hot.accept("./_exports", () => {
//       setTimeout(render);
//     });
//   }
//
//   render();
//
//   var event = new Event(Constants.react_done_init);
//   document.dispatchEvent(event);
// });
