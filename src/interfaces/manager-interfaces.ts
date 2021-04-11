export interface IViewManager{
    startViews(): void;
    setLocalMediaView(localStream: MediaStream): void;
    getRemoteVideo(): HTMLMediaElement;
}

export interface ILocalMediaManager{
    getLocalStream(): MediaStream;
    stopLocalMedia(): void;
    startLocalMedia(): void;
}

export interface IRemoteMediaSession {
    startWebRTC(isInitialOfferer: boolean): void;
    receiveSDP(sdp: any): void;
    receiveCandidate(candidate: any): void;
    setRemoteVideo(video: HTMLMediaElement): void;
    injectSignalingSession(smm: ISignalingSession): void;
    pc: RTCPeerConnection;
}

export interface ISignalingSession {
    onInitalMembers (members: Members): void;
    onAddedMembers (members: Members): void;
    onRemovedMembers (members: Members): void;
    injectRemoteMediaSession(rmm: IRemoteMediaSession): void;
    startMembers(): void;
    sendMessage(msg: Message): void;

}