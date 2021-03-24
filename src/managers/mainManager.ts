
import { SignalingSession } from './signalingSession';
import { LocalMediaManager } from './localMediaManager';
import { setLocalMediaView, getRemoteVideo } from '../view/mainView';
import { RemoteMediaSession } from './remoteMediaSession';

export async function run() {

    
    const signalingSession = new SignalingSession();
    const remoteMediaSession = new RemoteMediaSession(signalingSession);
    signalingSession.injectRemoteMediaSession(remoteMediaSession);
    remoteMediaSession.injectSignalingSession(signalingSession);


    console.log("SignalingSession STARTED ", signalingSession);

    const localMediaManager = new LocalMediaManager();
    await localMediaManager.startLocalMedia();

    const s = localMediaManager.getLocalStream();
    console.log("local stream ", s);

    setLocalMediaView(localMediaManager.getLocalStream());

    remoteMediaSession.setRemoteVideo(getRemoteVideo());


    await signalingSession.startMembers();


//TODO: this below should be rewritten
    signalingSession.initialMembersHandler = (members) => {
        remoteMediaSession.startWebRTC(members.length > 1);};
        signalingSession.initialMembersHandler = signalingSession.initialMembersHandler.bind(signalingSession);


    signalingSession.startSignaling();

    



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

