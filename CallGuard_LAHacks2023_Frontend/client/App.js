import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useState } from "react";
import axios from "axios";
import SERVER_URL from "./config.js";
import PhoneCallScreen from "./PhoneCallScreen";
import AudioRecorder from "./components/AudioRecorder.js";
import CallScreen from "./CallScreen.js";

// import "./test.m4a";
// import RNCallKeep from "react-native-callkeep";
// RNCallKeep.setup(options).then((accepted) => {});
// RNCallKeep.addEventListener(
//     "didReceiveStartCallAction",
//     ({ handle, callUUID, name }) => {
//       console.log(
//         `Received Start Call Event - Name: ${name}, Uuid: #{callUUID}`
//       );
//       RNCallKeep.answerIncomingCall(callUUID);
//     }
//   );

export default function App() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [messagesScammer, setMessagesScammer] = useState([]);
  const [messagesDetector, setMessagesDetector] = useState();
  const [spamScore, setSpamScore] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const handleTextChange = (value) => {
    setText(value);
  };

  const sendMessage = () => {
    // Add the input value as a new message to the state
    const isUser = !messages[messages.length - 1]?.isUser ?? true;

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        text: inputValue,
        isUser: isUser,
      },
    ]);

    if (!isUser) {
      evaluateSpam();
      generateAIResponse();
    }
  };

  const evaluateSpam = () => {
    // const userMessages = messages
    //   .filter((message) => message.isUser)
    //   .map((message) => message.text);
    // console.log(userMessages);
    const scammerMessages = messages
      .filter((message) => !message.isUser)
      .map((message) => message.text);
    console.log(scammerMessages);
    if (scammerMessages !== null && scammerMessages.length > 0) {
      const scammerMessagesConcat = scammerMessages.join(" ");
      console.log(scammerMessagesConcat);
      axios
        .post(`${SERVER_URL}/api/cohere/`, {
          text: scammerMessagesConcat,
        })
        .then((response) => {
          let spamScore = response.data.spam_confidence_score;
          console.log(spamScore);
          setSpamScore(spamScore);
          // handle the response data
        })
        .catch((error) => {
          console.error(error);
          // handle the error
        });
    }
  };

  const convertAudio = () => {
    console.log("clicked");
    try {
      const formData = new FormData();
      formData.append("audio", {
        uri: "./test.m4a",
        type: "audio/mpeg",
        name: "test.m4a",
      });
      console.log(formData);
      axios
        .post(`${SERVER_URL}/audio_transcription/`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          let convertedText = response.data;
          console.log(convertedText);
          // handle the response data
        })
        .catch((error) => {
          console.error(error);
          // handle the error
        });
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const renderMessage = ({ item }) => {
    const messageStyle = item.isUser ? styles.userMessage : styles.otherMessage;
    return (
      <View style={messageStyle}>
        <Text>{item.text}</Text>
      </View>
    );
  };

  const generateAIResponse = () => {
    if (messages !== null && messages.length > 0) {
      const scammerMessages = messages
        .filter((message) => !message.isUser)
        .map((message) => message.text);
      const userMessages = messages
        .filter((message) => message.isUser)
        .map((message) => message.text);
      console.log(scammerMessages);
      axios
        .post(`${SERVER_URL}/api/openai/`, {
          text: [scammerMessages, userMessages],
        })
        .then((response) => {
          let res = response.data.response.choices[0].message.content;
          console.log(response.data.response.choices[0].message.content);
          setMessagesDetector(res);
          console.log(messagesDetector);
        })
        .catch((error) => {
          console.error(error);
          // handle the error
        });
    }
  };

  return (
    <View style={styles.container}>
      <CallScreen
        messages={messages}
        renderMessage={renderMessage}
        spamScore={spamScore}
        warning={messagesDetector}
      />

      <View style={styles.inputContainer}>
        <TextInput
          value={inputValue}
          onChangeText={setInputValue}
          style={styles.inputField}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#F5FCFF",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  inputField: {
    flex: 1,
    backgroundColor: "#eee",
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 15,
    color: "#000",
  },
  sendButton: {
    backgroundColor: "#fff",
    borderRadius: 20,
    height: 40,
    width: 60,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 10,
    margin: 5,
    maxWidth: "80%",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 10,
    margin: 5,
    maxWidth: "80%",
  },
});

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "flex-end",
//     backgroundColor: "#F5FCFF",
//   },
//   //   container: {
//   //     flex: 1,
//   //     backgroundColor: "#fff",
//   //     alignItems: "center",
//   //     justifyContent: "center",
//   //   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#F5FCFF",
//     borderTopWidth: 1,
//     borderTopColor: "#ccc",
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//   },
//   inputField: {
//     flex: 1,
//     backgroundColor: "#eee",
//     height: 40,
//     borderRadius: 20,
//     paddingHorizontal: 15,
//   },
//   sendButton: {
//     backgroundColor: "#2196F3",
//     borderRadius: 20,
//     height: 40,
//     width: 60,
//     marginLeft: 10,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   sendButtonText: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   userMessage: {
//     alignSelf: "flex-end",
//     backgroundColor: "#2196F3",
//     padding: 10,
//     borderRadius: 10,
//     margin: 5,
//     maxWidth: "80%",
//   },
//   otherMessage: {
//     alignSelf: "flex-start",
//     backgroundColor: "#eee",
//     padding: 10,
//     borderRadius: 10,
//     margin: 5,
//     maxWidth: "80%",
//   },
// });
