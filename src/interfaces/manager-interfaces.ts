import { RemoteMediaSession } from "../managers/remoteMediaSession";


export interface ILocalMediaManager{
    startLocalMedia(): Promise<void>;
    getLocalStream(): MediaStream;
    closeLocalMedia(): void;
}

export interface IRemoteMediaSession {
    startWebRTC(isInitialOfferer: boolean): void;
    receiveSDP(sdp: any): void;
    receiveCandidate(candidate: any): void;
    setRemoteVideo(video: HTMLMediaElement): void;
    injectSignalingSession(smm: ISignalingSession): void;
}

export interface ISignalingSession {
    initialMembersHandler (members: Members): void;
    addedMembersHandler (members: Members): void;
    removedMembersHandler (members: Members): void;
    injectRemoteMediaSession(rmm: IRemoteMediaSession): void;
    startMembers(): void;
    sendMessage(msg: Message): void;

}