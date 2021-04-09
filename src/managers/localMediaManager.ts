import { ILocalMediaManager } from '../interfaces/manager-interfaces'
import { RemoteMediaSession } from './remoteMediaSession';


export class LocalMediaManager implements ILocalMediaManager{

    private _localStream: MediaStream;

    public async setLocalMedia(rmm: RemoteMediaSession) {


        let constraints = {
            audio: true,
            video: {
             width: { min: 400, ideal: 1920, max: 1920 },
             height: { min: 300, ideal: 1080, max: 1080 }
           }
          
          };

        this._localStream = await navigator.mediaDevices.getUserMedia(constraints);

        /*
        navigator.mediaDevices.getUserMedia(constraints)
            .then(stream => {
                this._localStream = stream;
                stream.getTracks().forEach(function(track) {
                    i++;
                    rmm.pc.addTrack(track, stream);
                    this._localStream = stream;})
            })
            .catch(onerror);
        */

        console.log("THIS ******** setLocalMedia 3 this,  this._localStream , stream:", this,  this._localStream);
    }

    public getLocalStream() : MediaStream {
        console.log("THIS ******** getLocalStream this,  this._localStream :", this,  this._localStream);
        return this._localStream;
    }

    public closeLocalMedia() {
        //TODO

    }
};