

//TODO create subclasses per remote if more than one is needed in a call

import { IRemoteMediaSession, ISignalingSession } from "../interfaces/manager-interfaces";
import { SignalingSession } from "./signalingSession";

export class RemoteMediaSession implements IRemoteMediaSession {

    private _remoteStream: MediaStream = null;
    private _pc: RTCPeerConnection;
    private _signalingSession: ISignalingSession;
    private _videoElement: HTMLMediaElement;
    
    constructor(s: SignalingSession){
        this._signalingSession = s;
        this.receiveCandidate = this.receiveCandidate.bind(this);
        this.receiveSDP = this.receiveSDP.bind(this);
        this.startWebRTC = this.startWebRTC.bind(this);
        this.setRemoteVideo = this.setRemoteVideo.bind(this);
        this._localDescCreated = this._localDescCreated.bind(this);
    }
    public injectSignalingSession(smm: ISignalingSession) {
        this._signalingSession = smm;
    }

    public async startWebRTC(isInitialOfferer: boolean){

        console.log("WEBRTC -------------- startWebRTC  ");
        const configuration = {
            iceServers: [{
              urls: 'stun:stun.l.google.com:19302' // Google's public STUN server
            }]
           };


        this._pc = new RTCPeerConnection(configuration); //TODO: is there an error scenario?
        console.log("XXXXX --------------  this ", this);
        console.log("SIGNALING INCOMMING -------------- startWebRTC this._pc ", this._pc);
        console.log("WEBRTC -------------- new RTCPeerConnection  1",this._pc);

        this._pc.onconnectionstatechange = ev => this._connectionStateHandler(ev);
        this._pc.onicecandidate = ev => this._sendICECandidateHandler(ev);
        this._pc.ontrack = ev => this._newRemoteStreamHandler(ev);

        if(isInitialOfferer) this._makeOffer();
    }

    public receiveSDP(sdp: any){
        console.log("THIS -------------- receiveSDP ", this);
        console.log("SIGNALING INCOMMING -------------- SDP ", sdp);
        this._pc.setRemoteDescription(new RTCSessionDescription(sdp))
            .then(
                () => {if (this._pc.remoteDescription.type === 'offer') {
                    this._pc.createAnswer()
                        .then(this._localDescCreated)
                        .catch((e) => {console.log("Error remoteDescription ", e)});
                } else {
                    console.log('WEBRTC -------------- message NOT OFFER ', this._pc.remoteDescription);
                }})
            .catch((e) => {console.log("Error remoteDescription else ", e)});
    }

    public receiveCandidate(candidate: any){
        console.log("THIS -------------- receiveCandidate ", this);
        console.log("SIGNALING INCOMMING -------------- ICE candidate ", candidate);
        let c = new RTCIceCandidate(candidate) as RTCIceCandidateInit;
        this._pc.addIceCandidate(c)
        .then(() => {console.log("TODO: unhandled in receiveCandidate")})
        .catch((e) => {console.log("Error remoteDescription else ", e)});
    }

    public setRemoteVideo(video: HTMLMediaElement){
        this._videoElement = video;

    }
    private _newRemoteStreamHandler(event: any){
            console.log("WEBRTC INCOMMING -------------- new stream ", event); 
            this._remoteStream = event.stream;
            this._videoElement.srcObject = event.streams[0];
    }
    private _connectionStateHandler(event: Event){
        console.log("WEBRTC -------------- onconnectionstatechange: ", event);
    }
    private _sendICECandidateHandler(event: RTCPeerConnectionIceEvent){
        console.log("WEBRTC -------------- _ICECandidateHandler: ", event);
        this._signalingSession.sendMessage({'candidate': event.candidate});
    }

    private _localDescCreated(desc: any) {  //TODO: create interface for desc
        console.log("WEBRTC -------------- localDescCreated. Will try to send sdp", desc);
        console.log("THIS -------------------------- _localDescCreated ", this);
        this._pc.setLocalDescription(desc)
            .then(() => {let msg = {'sdp': this._pc.localDescription}; console.log("HELLO!!!!   localDescription SET! Now to send it over sdp", msg); this._signalingSession.sendMessage(msg)})
            .catch(onerror);
        console.log("WEBRTC -------------- localDescCreated. Was it sent?");
       } 

    private _makeOffer(){
        console.log("WEBRTC -------------- makeOffe");
        this._pc.onnegotiationneeded = () => {

            console.log("WEBRTC OUTGOING -------------- event onnegotiationneeded"); 
            console.log("THIS -------------------------- _makeOffer ", this);
             this._pc.createOffer().then(this._localDescCreated).catch((e) => console.log("Error ",e));
        
           }
    }


}