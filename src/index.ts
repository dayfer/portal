import * as _ from 'lodash';
import { run } from './managers/mainManager';

import * as _mainView from './view/mainView'

//TODO: to be removed


//let head = document.getElementsByTagName('head').item(0);
//console.log("head ", head );
//const script = document.createElement('script');
//script.setAttribute('src', 'https://cdn.scaledrone.com/scaledrone.min.js');
//
//script.setAttribute('type', 'text/javascript');
//script.setAttribute('defer', 'true');
//head.appendChild(script);

//head.insertBefore(script, head.lastChild);


function testComponent() {
  const element = document.createElement('div');

  // Lodash, now imported by this script
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  return element;
}
  
function viewRoot() {
  const element = document.createElement('div');
  element.setAttribute("id", "root");
  return element;
}

  






document.body.appendChild(testComponent());
document.body.appendChild(viewRoot());
_mainView.startViews();


run();
 
