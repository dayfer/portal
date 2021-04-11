

//TODO create subclasses per remote if more than one is needed in a call

import { ILocalMediaManager, IRemoteMediaSession, ISignalingSession } from "../interfaces/manager-interfaces";
import { LocalMediaManager } from "./localMediaManager";
import { SignalingSession } from "./signalingSession";

export class RemoteMediaSession implements IRemoteMediaSession {


    public pc: RTCPeerConnection;
    private _signalingSession: ISignalingSession;
    private _localMediaManager: ILocalMediaManager;
    private _videoElement: HTMLMediaElement;
    
    constructor(){
        this.receiveCandidate = this.receiveCandidate.bind(this);
        this.receiveSDP = this.receiveSDP.bind(this);
        this.startWebRTC = this.startWebRTC.bind(this);
        this.setRemoteVideo = this.setRemoteVideo.bind(this);
        this._localDescCreated = this._localDescCreated.bind(this);
    }
    public async injectSignalingSession(smm: ISignalingSession) {
        this._signalingSession = smm;
    }
    public async injectLocalMediaManager(lmm: ILocalMediaManager) {
        this._localMediaManager = lmm;
    }
    

    public async startWebRTC(isInitialOfferer: boolean){
        console.log("XXXXX startWebRTC--------------  this ", this);
        const configuration = {
            iceServers: [{
              urls: 'stun:stun.l.google.com:19302' // Google's public STUN server
            }]
           };

        this.pc = new RTCPeerConnection(configuration); //TODO: is there an error scenario?
        
        console.log("WEBRTC -------------- new RTCPeerConnection  1",this.pc);

        this.pc.onconnectionstatechange = ev => this._connectionStateHandler(ev);
        this.pc.onicecandidate = ev => this._sendICECandidateHandler(ev);
        if(isInitialOfferer) this._makeOffer();
        this.pc.ontrack = ev => this._newRemoteStreamHandler(ev);

     //   this._localMediaManager.setLocalMedia(this);

    }

    public receiveSDP(sdp: any){
        console.log("THIS -------------- receiveSDP ", this);
        console.log("SIGNALING INCOMMING -------------- SDP ", sdp);
        this.pc.setRemoteDescription(new RTCSessionDescription(sdp))
            .then(
                () => {if (this.pc.remoteDescription.type === 'offer') {
                    this.pc.createAnswer()
                        .then(this._localDescCreated)
                        .catch((e) => {console.log("Error remoteDescription ", e)});
                } else {
                    console.log('WEBRTC -------------- message NOT OFFER ', this.pc.remoteDescription);
                }})
            .catch((e) => {console.log("Error remoteDescription else ", e)});
    }

    public receiveCandidate(candidate: any){
        console.log("THIS -------------- receiveCandidate ", this);
        console.log("SIGNALING INCOMMING -------------- ICE candidate ", candidate);
        let c = new RTCIceCandidate(candidate) as RTCIceCandidateInit;
        this.pc.addIceCandidate(c)
        .then(() => {console.log("TODO: unhandled in receiveCandidate")})
        .catch((e) => {console.log("Error remoteDescription else ", e)});
    }

    public setRemoteVideo(video: HTMLMediaElement){
        this._videoElement = video;

    }
    private _newRemoteStreamHandler(event: any){
            console.log("THIS -------------- _newRemoteStreamHandler ", this);
            console.log("WEBRTC INCOMMING -------------- new stream ", event); 
//            this._remoteStream = event.stream;
            this._videoElement.srcObject = event.streams[0];
    }
    private _connectionStateHandler(event: Event){
        console.log("THIS -------------- _connectionStateHandler ", this);
        console.log("WEBRTC -------------- onconnectionstatechange: ", event);
    }
    private _sendICECandidateHandler(event: RTCPeerConnectionIceEvent){
        console.log("THIS -------------- _sendICECandidateHandler ", this);
        console.log("WEBRTC -------------- _ICECandidateHandler: ", event.candidate);
        this._signalingSession.sendMessage({candidate: event.candidate});
    }

    private _localDescCreated(desc: any) {  //TODO: create interface for desc
        console.log("THIS -------------------------- _localDescCreated this :", this);
        console.log("THIS -------------------------- _localDescCreated desc :", desc);
        this.pc.setLocalDescription(desc)
            .then(() => {let msg = {sdp: this.pc.localDescription}; 
            console.log("Why is this msg fail? ", msg); 
            this._signalingSession.sendMessage(msg)})
            .catch(onerror);
       } 

    private _makeOffer(){
        console.log("THIS -------------------------- _makeOffer ", this);
        this.pc.onnegotiationneeded = () => {
            console.log("WEBRTC OUTGOING -------------- event onnegotiationneeded"); 
            this.pc.createOffer().then(this._localDescCreated).catch((e) => console.log("Error ",e));
        
           }
    }


}