import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { RemoteVideo } from './remoteVideo'

export function startViews()
{
  ReactDOM.render(<RemoteVideo />, document.getElementById('root'));
}

export function setLocalMediaView(localStream: MediaStream){

  const localVideo = document.getElementById('localVideo');
  const l = localVideo as HTMLVideoElement;
  l.srcObject = localStream;
}

export function getRemoteVideo(): HTMLMediaElement{
  const remoteVideo = document.getElementById('remoteVideo') as HTMLMediaElement;
  return remoteVideo;
}
  