import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { RemoteVideo } from './remoteVideo'
import { IViewManager } from '../interfaces/manager-interfaces'

export class ViewManager implements IViewManager{

  public startViews(){
      ReactDOM.render(<RemoteVideo />, document.getElementById('root'));
    }

  public setLocalMediaView(localStream: MediaStream){
      const localVideo = document.getElementById('localVideo');
      const l = localVideo as HTMLVideoElement;
      console.log("THIS ******** this, l, localStrem ", this, l, localStream);
      l.srcObject = localStream;
    }

  public getRemoteVideo(): HTMLMediaElement{
      const remoteVideo = document.getElementById('remoteVideo') as HTMLMediaElement;
      return remoteVideo;
    }
        
}

  