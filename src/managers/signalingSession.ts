import { IRemoteMediaSession, ISignalingSession } from "../interfaces/manager-interfaces";

export class SignalingSession implements ISignalingSession { 

    private _remoteMediaSession: IRemoteMediaSession;
    static _instance: SignalingSession;
    private _drone: any;
    private _room: any;
    private _roomHash = 'ebf3dd';
    private _roomName = 'observable-' + this._roomHash;
    private _members:  Members = [];

    public onInitalMembers: (members: Members) => void;
    public onAddedMembers: (members: Members) => void;
    public onRemovedMembers: (members: Members) => void;

    public injectRemoteMediaSession(rmm: IRemoteMediaSession) {
        this._remoteMediaSession = rmm;
    }

    constructor(){
        this.sendMessage = this.sendMessage.bind(this);
    }

    //Singleton class
    /* TODO: only the manager should be singleton
    constructor() {
        if(!SignalingSession._instance){
            SignalingSession._instance = this;
        }
        return SignalingSession._instance;
    }
    */
    public async startMembers() {
    
        try{
        //grap scaledrone from external script
            this._drone = new (window as any).Scaledrone('gN7BAhjWYa0uoHTK');
            console.log( "opened ScaleDrone signaling service ", this._drone);
        }
        catch (err){
            console.log( "failed to open ScaleDrone signaling service ", err);
        }
          
        await this._setupRoom();
        await this._subscribe();

        await this._monitorMembers();
        await this._monitorIncomingData();

    }
    public async startSignaling() {
        await this._monitorIncomingData();
    }

    public sendMessage(msg: Message){
        console.log("About to send this message to peer: ", msg);
        this._drone.publish({
          room: this._roomName,
          msg
        });

    }
    private async _subscribe(){
        
        this._drone.on('open', error => {

            console.log("Scaledrone OPEN call -------------- drone " , error);
            if (error) {
              console.log("ERROR -------------- failed creating drone");
              return console.error(error);
            };


        });
    }
    
    private async _setupRoom(){
        this._room = this._drone.subscribe(this._roomName);
        this._room.on('open', error => {
          console.log("SIGNALING INCOMMING -------------- room open event");  
          if (error) {
            console.log("ERROR -------------- failed creating room");
            console.error(error);
          }
        });
    }



    private async _monitorMembers(){
        this._room.on('members', (members: Members) => {
            console.log('SIGNALING INCOMMING -------------- members = ', members);
            this._members = members;
            this.onInitalMembers(members);
          });
        this._room.on('member_join', (joinedMember: Member) => {
            console.log('SIGNALING INCOMMING -------------- member_join = ', joinedMember);
            this._members.push(joinedMember);
            console.log('SIGNALING INCOMMING -------------- members = ', this._members);
          });
        this._room.on('member_leave', (leftMember: Member) => {
            console.log('SIGNALING INCOMMING -------------- member_leave = ', leftMember);
            this._members = this._members.filter((i) => {return (i.id != leftMember.id)});
            console.log('SIGNALING INCOMMING -------------- members = ', this._members);
          });
    }

    private async _monitorIncomingData(){
        this._room.on('message', (message) => {
            console.log('SIGNALING INCOMMING -------------- MESSAGE ');
            if (!message.member || message.member === this._drone.clientId) {
                console.log('SIGNALING INCOMMING -------------- ERROR ', message);
                return;
            }
            if (message.data.sdp){
                console.log('SIGNALING INCOMMING -------------- SDP ', message);
                this._remoteMediaSession.receiveSDP(message.data.sdp);
            }
            if (message.data.candidate){
                console.log('SIGNALING INCOMMING -------------- CANDIDATE ', message);
                this._remoteMediaSession.receiveCandidate(message.data.candidate);
            }


            if(message.member === this._drone.clientId){
                console.log('SIGNALING INCOMMING FROM YOUSELF-------------- message = ', message); 
                return;
            }


          });
    }

}