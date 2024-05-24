import {
  ChartBarIcon,
  PhotographIcon,
  XIcon,
  MicrophoneIcon,
} from "@heroicons/react/outline";
import { useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { API_BASE_URL, getHeaders } from "../utils/constants";
import { useRecoilState } from "recoil";
import { feedState } from "../atoms/social_media_atom";

export default function Input({ title }: any) {
  const { data: session }: any = useSession();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage]: any = useState(null);
  const [selectedFile, setSelectedFile]: any = useState(null);
  const [selectedAudio, setSelectedAudio]: any = useState(null); // New state for audio
  const [audioPreview, setAudioPreview]: any = useState(null); // New state for audio preview
  const filePickerRef: any = useRef(null);
  const audioPickerRef: any = useRef(null); // New ref for audio
  const [feed, setFeed]: any = useRecoilState(feedState);

  const sendPost = async () => {
    if (loading) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("content", input);
    formData.append("image", selectedImage);
    formData.append("audio", selectedAudio); // Append audio file

    const response = await fetch(`${API_BASE_URL}/posts/`, {
      method: "POST",
      mode: "cors",
      headers: getHeaders(session.user.accessToken),
      body: formData,
    });
    setLoading(false);
    if (response.status === 201) {
      const feed = await fetch(
        `${API_BASE_URL}/${title === "My Posts" ? "posts/my/" : "posts"}`,
        {
          headers: getHeaders(session?.user?.accessToken),
        }
      ).then((res) => {
        return res.json();
      });

      setFeed(feed);

      setInput("");
      setSelectedFile(null);
      setSelectedAudio(null); // Reset audio file
      setAudioPreview(null); // Reset audio preview
    }
  };

  const addImageToPost = (e: any) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.onload = (readerEvent: any) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  const addAudioToPost = (e: any) => {
    if (e.target.files[0]) {
      setSelectedAudio(e.target.files[0]);
      setAudioPreview(URL.createObjectURL(e.target.files[0])); // Create preview URL for the audio file
    }
  };

  return (
    <div
      className={`border-b border-gray-700 p-3 flex space-x-3 overflow-y-scroll scrollbar-hide ${
        loading && "opacity-60"
      }`}
    >
      <img
        src={`${API_BASE_URL}/${session.user.image}`}
        alt=""
        className="h-11 w-11 rounded-full"
      />
      <div className="divide-y divide-gray-700 w-full">
        <div
          className={`${(selectedFile || audioPreview) && "pb-7"} ${
            input && "space-y-2.5"
          }`}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What's happening?"
            rows={3}
            className="bg-transparent outline-none text-[#d9d9d9] text-lg placeholder-gray-500 tracking-wide w-full min-h-[50px]"
          />

          {selectedFile && (
            <div className="relative">
              <div
                className="absolute w-8 h-8 bg-[#15181c] hover:bg-[#272c26] bg-opacity-75 rounded-full flex items-center justify-center top-1 left-1 cursor-pointer"
                onClick={() => setSelectedFile(null)}
              >
                <XIcon className="text-white h-5" />
              </div>
              <img
                src={selectedFile}
                alt=""
                className="rounded-2xl max-h-80 object-contain"
              />
            </div>
          )}

          {audioPreview && (
            <div className="relative">
              <div
                className="absolute w-8 h-8 bg-[#15181c] hover:bg-[#272c26] bg-opacity-75 rounded-full flex items-center justify-center top-1 left-1 cursor-pointer"
                onClick={() => {
                  setSelectedAudio(null);
                  setAudioPreview(null);
                }}
              >
                <XIcon className="text-white h-5" />
              </div>
              <audio controls className="w-full mt-2">
                <source src={audioPreview} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>
        {!loading && (
          <div className="flex items-center justify-between pt-2.5">
            <div className="flex items-center">
              <div
                className="icon"
                onClick={() => filePickerRef.current.click()}
              >
                <PhotographIcon className="text-[#1d9bf0] h-[22px]" />
                <input
                  type="file"
                  ref={filePickerRef}
                  hidden
                  onChange={(e) => {
                    addImageToPost(e);
                    if (e.target.files) {
                      setSelectedImage(e.target.files[0]);
                    }
                  }}
                />
              </div>

              {/* New Audio Upload Icon */}
              <div
                className="icon"
                onClick={() => audioPickerRef.current.click()}
              >
                <MicrophoneIcon className="text-[#1d9bf0] h-[22px]" />
                <input
                  type="file"
                  ref={audioPickerRef}
                  hidden
                  accept="audio/*"
                  onChange={(e) => {
                    addAudioToPost(e);
                  }}
                />
              </div>
              {/* <div className="icon rotate-90">
                <ChartBarIcon className="text-[#1d9bf0] h-[22px]" />
              </div> */}
            </div>
            <button
              className="bg-[#1d9bf0] text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-[#1d9bf0] disabled:opacity-50 disabled:cursor-default"
              disabled={!input && !selectedFile && !selectedAudio} // Update button state
              onClick={sendPost}
            >
              Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
