import { Mic, MicOff, Phone, Pin, Video, VideoOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { fetchProfileImageApi } from "../../sevices/consult/fetchProfileImage";
import ConsultLanding from "./ConsultLanding";
import { getLocalPreviewAndInitRoomConnection, streamEvents } from "../../utils/webrtc";

const VideoCallInterface = () => {
  const [callstarted, setCallStarted] = useState<boolean>(false)
  const [pinned, setPinned] = useState<"A" | "B">("A");
  const [micOn, setMicOn] = useState<boolean>(false);
  const [videoOn, setVideoOn] = useState<boolean>(false);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const client = useSelector((state: RootState) => state.auth)
  const [profileImage, setProfileImage] = useState<string | null>(null)

  useEffect(() => {
    const initLocalStream = async () => {
      const localStream = await getLocalPreviewAndInitRoomConnection();

      if (localStream && localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }
    };

    initLocalStream();

    const handleNewStream = (stream: MediaStream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
    };

    streamEvents.on('new-remote-stream', handleNewStream);

    return () => {
      streamEvents.off('new-remote-stream', handleNewStream);
    };
  }, [videoOn, micOn]);

  const fetchProfileImage = async () => {
    const { profileImage } = await fetchProfileImageApi(client.role)
    setProfileImage(profileImage)

  }

  const handleMicToggle = (): void => setMicOn(!micOn);
  const handleVideoToggle = (): void => setVideoOn(!videoOn);
  const handleEndCall = (): void => alert("Call ended!");

  return (
    <div className="fixed top-0 w-screen h-screen bg-[#1d1d1d] p-4 text-white">
      {!callstarted && <ConsultLanding localVideoRef={localVideoRef} setCallStarted={setCallStarted} />}
      {callstarted && (<>
        <div className="w-full h-full relative">
          <div
            className={`flex flex-col gap-2 items-center justify-center ${pinned === "A"
              ? "bg-neutral-900 w-full h-full"
              : "bg-neutral-900 w-[30%] md:w-[300px] md:aspect-video aspect-[2/3] m-2 z-10"
              } rounded-md overflow-hidden absolute top-0 group duration-300`}
          >
            {videoOn ? (
              <video
                ref={localVideoRef}
                autoPlay
                muted
                className="w-full h-full bg-black"
              />
            ) : (
              <div className="w-36 h-36 bg-gray-600 rounded-full overflow-hidden">
                {profileImage && <img src={profileImage} alt="" />}
              </div>
            )}
            <p className={`absolute bottom-1 left-2 ${pinned === 'A' ? '' : 'text-white translate-y-6 group-hover:-translate-y-0 duration-300'} text-md `}>Shruti Ked</p>
            <div className={`absolute top-1 right-2 ${pinned === 'A' ? 'hidden' : '-translate-y-6 translate-x-6 group-hover:-translate-y-0 group-hover:translate-x-0 duration-300'} `}
              onClick={() => setPinned("A")}>
              <Pin size={18} strokeWidth={1.25} className="rotate-45" />
            </div>
          </div>

          {remoteVideoRef &&
            <div
              className={`flex flex-col gap-2 items-center justify-center overflow-hidden group ${pinned === "B"
                ? "bg-neutral-900 w-full h-full"
                : "bg-neutral-900 w-[30%] md:w-[300px] md:aspect-video aspect-[2/3] m-2 z-10"
                } rounded-md overflow-hidden absolute top-0 group duration-300`}
            >

              <video
                ref={remoteVideoRef}
                autoPlay
                muted
                className="w-full h-full bg-green-200"
              />
              <p className={`absolute bottom-1 left-2 ${pinned === 'B' ? ' ' : ' text-white translate-y-6 group-hover:-translate-y-0 duration-300'} text-md`}>Shrudti Ked</p>
              <div className={`absolute top-1 right-2 ${pinned === 'B' ? 'hidden' : '-translate-y-6 translate-x-6 group-hover:-translate-y-0 group-hover:translate-x-0 duration-300'} `}
                onClick={() => setPinned("B")}>
                <Pin size={18} strokeWidth={1.25} className="rotate-45" />
              </div>
            </div>}

        </div>
        

        <div className="flex gap-3 absolute bottom-6 left-[50%] -translate-x-[50%]">
          <button
            onClick={handleMicToggle}
            className={`px-5 py-2 ${micOn ? "bg-gray-500 " : "bg-gray-700 "
              } opacity-30 h-fit w-fit rounded-md`}
          >
            {micOn ? <Mic size={32} strokeWidth={2.25} /> : <MicOff size={32} strokeWidth={2.25} />}
          </button>

          <button
            onClick={handleEndCall}
            className="px-5 py-2 bg-red-500 h-fit w-fit rounded-md"
          >
            <Phone size={32} strokeWidth={2.25} className="rotate-[135deg]" />
          </button>

          <button
            onClick={handleVideoToggle}
            className={`px-5 py-2 ${videoOn ? "bg-gray-500 " : "bg-gray-700 "
              } opacity-30 h-fit w-fit rounded-md `} >
            {videoOn ? <Video size={32} strokeWidth={2.25} /> : <VideoOff size={32} strokeWidth={2.25} />}
          </button>
        </div>
      </>
      )}

    </div>
  );
};

export default VideoCallInterface;
