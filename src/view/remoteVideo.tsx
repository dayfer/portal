import * as React from 'react';
import { remoteVideoPos } from './styles'

//import "node_modules/video-react/dist/video-react.css";

export class RemoteVideo extends React.Component <any, any> {

  constructor(props: any) {
    super(props);
  }

  render() {
    return <><video style={remoteVideoPos} id="localVideo" autoPlay></video><br></br><video style={remoteVideoPos} id="remoteVideo" autoPlay></video></>;
  }
}

