import React, { useState } from "react";
import { View, Button } from "react-native";
// import { Audio } from "expo-av";
import axios from "axios";
// import Sound from "react-native-sound";

// const AudioRecorder = () => {
//   const [recording, setRecording] = useState(null);

//   const startRecording = async () => {
//     console.log("start rec!");
//     try {
//       const recordingConfig = {
//         android: {
//           mediaFormat: "audio/mpeg",
//           //   audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
//           sampleRate: 44100,
//           numberOfChannels: 2,
//           bitRate: 128000,
//           extension: ".mp3",
//         },
//         ios: {
//           audioQuality: "High",
//           sampleRate: 44100,
//           numberOfChannels: 2,
//           bitRate: 128000,
//           linearPCMBitDepth: 16,
//           linearPCMIsBigEndian: false,
//           linearPCMIsFloat: false,
//           extension: ".mp3",
//         },
//       };

//       const { status } = await Audio.requestPermissionsAsync();
//       if (status !== "granted") return;

//       const newRecording = new Audio.Recording();
//       await newRecording.prepareToRecordAsync(recordingConfig);
//       await newRecording.startAsync();
//       setRecording(newRecording);
//     } catch (error) {
//       console.log("start rec fails");
//       console.error(error);
//     }
//   };

//   const stopRecording = async () => {
//     console.log("stop rec!");
//     try {
//       await recording.stopAndUnloadAsync();
//       const uri = recording.getURI();
//       await sendRecordingToServer(uri);
//     } catch (error) {
//       console.log("stop rec fails");
//       console.error(error);
//     }
//   };

//   const sendRecordingToServer = async (recordingUri) => {
//     try {
//       const formData = new FormData();
//       formData.append("recording", {
//         uri: recordingUri,
//         name: "recording.mp3",
//         type: "audio/mpeg",
//       });
//       const response = await axios.post(
//         "https://yourserver.com/recordings",
//         formData
//       );
//       console.log(response.data);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <View>
//       <Button
//         title={recording ? "Stop Recording" : "Start Recording"}
//         onPress={recording ? stopRecording : startRecording}
//       />
//     </View>
//   );
// };

// export default AudioRecorder;
