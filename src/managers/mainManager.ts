
import { SignalingSession } from './signalingSession';
import { LocalMediaManager } from './localMediaManager';
import { ViewManager } from '../view/mainView';
import { RemoteMediaSession } from './remoteMediaSession';

export async function run() {
    
    const signalingSession = new SignalingSession();
    const remoteMediaSession = new RemoteMediaSession();
    const localMediaManager = new LocalMediaManager();
    const viewManager = new ViewManager();
    await signalingSession.injectRemoteMediaSession(remoteMediaSession);
    await remoteMediaSession.injectSignalingSession(signalingSession);
    await remoteMediaSession.injectLocalMediaManager(localMediaManager);

    await localMediaManager.startLocalMedia();

    console.log("SignalingSession STARTED ", signalingSession);

    signalingSession.startMembers();
    console.log("STARTED 1 ");
    signalingSession.startSignaling();
    console.log("STARTED 2 ");

    viewManager.startViews();


 
console.log("SignalingSession  localMediaManager.getLocalStream", localMediaManager.getLocalStream());
    viewManager.setLocalMediaView(localMediaManager.getLocalStream());

    signalingSession.onInitalMembers = (members) => { 
        console.log("STARTED ");

        remoteMediaSession.startWebRTC(members.length > 1);


         


        remoteMediaSession.setRemoteVideo(viewManager.getRemoteVideo());

    };



      const localVideo = document.getElementById('localVideo') as HTMLVideoElement;
      localVideo.addEventListener('resize', () => {
        console.log(`Local video size changed to ${localVideo.videoWidth}x${localVideo.videoHeight}`);
      });

/*
    console.log('Requesting Bluetooth Device...');
    navigator.bluetooth.requestDevice({ acceptAllDevices: true})
    .then(device => {
        console.log('> Name:             ' + device.name);
        console.log('> Id:               ' + device.id);
        console.log('> GATT:               ' + device.gatt);
        console.log('> Connected:        ' + device.gatt.connected);
        console.log("device ", device);
    })
    .catch(error => {
        console.log('Argh! ' + error);
    });
*/
}


