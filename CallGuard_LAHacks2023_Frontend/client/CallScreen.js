import React from "react";
import Icon from "react-native-vector-icons/Ionicons";

import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
} from "react-native";

const CallScreen = ({ messages, renderMessage, spamScore, warning }) => {
  const handlePress = () => {
    // No action required for this mock-up
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.statusText, { color: "white" }]}>AT&T</Text>

      <Text style={[styles.phoneHeaderText, { color: "white" }]}>John Doe</Text>

      <View style={styles.phoneContent}>
        <Text style={[styles.phoneNumber, { color: "white" }]}>
          +1 (555) 123-4567
        </Text>
        <FlatList
          style={styles.chatBox}
          data={messages.slice(-2)}
          renderItem={renderMessage}
          keyExtractor={(item, index) => index.toString()}
        />
        <View style={styles.buttonContainer}>
          <View style={styles.spamScoreContainer}>
            {spamScore !== null && (
              <Text style={styles.spamScoreText}>Spam Score: {spamScore}</Text>
            )}
          </View>
          <View style={styles.spamScoreContainer}>
            <View>
              {warning !== null && (
                <Text style={styles.warning}>Evalution: {warning}</Text>
              )}
            </View>
          </View>
          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Icon name="call-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Icon name="mic-off-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Icon name="volume-high-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Icon name="mail-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Icon name="videocam-outline" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handlePress}>
            <Icon name="person-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  phoneNumber: {
    fontSize: 25,
    fontWeight: "600",
    marginBottom: 20,
  },
  phoneHeaderText: {
    fontSize: 20,
    fontWeight: "500",
    marginBottom: 10,
  },
  chatBox: {
    width: "90%",
    borderWidth: 0,
    borderColor: "#c7c7cc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "90%",
  },
  phoneContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#d3d3d3",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    width: "30%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
    fontSize: 16,
    alignItems: "center",
  },
  spamScoreContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  spamScoreText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  warning: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
});

export default CallScreen;
