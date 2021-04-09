import { ILocalMediaManager } from '../interfaces/manager-interfaces'


export class LocalMediaManager implements ILocalMediaManager{

    private _localStream: MediaStream;

    public async startLocalMedia() {


        let constraints = {
            audio: true,
            video: {
             width: { min: 1024, ideal: 1920, max: 1920 },
             height: { min: 720, ideal: 1080, max: 1080 }
           }
          
          };

        await navigator.mediaDevices.getUserMedia(constraints).then(stream => {
            this._localStream = stream;
           }, onerror);
    }

    public getLocalStream() : MediaStream {
        return this._localStream;
    }

    public closeLocalMedia() {
        //TODO

    }
};