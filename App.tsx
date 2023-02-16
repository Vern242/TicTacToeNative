import React, { useEffect, useState } from "react";
import { Button, Modal, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function App(): JSX.Element {
  const [field, setField] = useState<Array<string>>([""]);
  const [currentPlayer, setCurrentPlayer] = useState<"X" | "O">("X");
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const initializeField = (): void => {
    const newField: Array<string> = [];
    for (let i = 1; i < 10; i++) {
      newField.push("");
    }
    setField(newField);
  };

  useEffect((): void => {
    initializeField();
  }, []);

  const flipPlayers = (): void => {
    setCurrentPlayer((prevPlayer) => (prevPlayer === "X" ? "O" : "X"));
  };

  const handleClick = (index: number): void => {
    const helper: Array<string> = field;
    helper[index] = currentPlayer;

    setField(helper);
    flipPlayers();
  };

  const hasBeenClickedAlready = (index: number): boolean => {
    if (field[index] !== "") return true;
    else return false;
  };

  const handleReset = (): void => {
    initializeField();
    setCurrentPlayer("X");
    setModalVisible(false);
  };

  const lookForWinner = (): string => {
    const f: Array<string> = field;
    if (f.length < 9) return "";

    if (f[0] === f[1] && f[1] === f[2]) return f[0];
    if (f[3] === f[4] && f[4] === f[5]) return f[3];
    if (f[6] === f[7] && f[7] === f[8]) return f[6];

    if (f[0] === f[3] && f[3] === f[6]) return f[0];
    if (f[1] === f[4] && f[4] === f[7]) return f[1];
    if (f[2] === f[5] && f[5] === f[8]) return f[2];

    if (f[0] === f[4] && f[4] === f[8]) return f[0];
    if (f[2] === f[4] && f[4] === f[6]) return f[2];

    return "";
  };

  const handleModal = (msg: string): string => {
    if (!modalVisible) setModalVisible(true);
    return msg;
  };

  const gameResult = (): string => {
    const unfinishedGame: boolean = field.find((element) => element === "") === "" ? true : false;
    const winner: string = lookForWinner();

    if (!unfinishedGame && winner === "") return handleModal("Draw");

    if (winner === "") return "";

    return handleModal(`Winner: ${winner}`);
  };

  const winner = lookForWinner();
  const result = gameResult();
  const modalStyle = modalVisible ? styles.game__modalBackground : undefined;
  return (
    <SafeAreaView style={styles.game__mainContainer}>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.game__modal}>
          <Text style={styles.game__text}>{result}</Text>
          <View style={styles.game__buttonContainer}>
            <Button title="Play again?" onPress={handleReset} />
          </View>
        </View>
      </Modal>
      <View style={modalStyle}>
        <View style={styles.game__align}>
          <Text style={styles.game__text}>Current player: {currentPlayer}</Text>
          <View style={styles.game__fieldContainer}>
            {field.length !== 0 &&
              field.map((value: string, index: number) => {
                return (
                  <Pressable key={index} onPressIn={() => handleClick(index)} disabled={hasBeenClickedAlready(index) || winner !== ""}>
                    <View style={styles.game__fieldPadding}>
                      <Text style={styles.game__fieldText}>{value}</Text>
                    </View>
                  </Pressable>
                );
              })}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  game__mainContainer: {
    alignItems: "center",
  },
  game__modalBackground: {
    height: "100%",
    width: "100%",
    zIndex: 1,
    opacity: 0.7,
    backgroundColor: "#808080",
  },
  game__text: {
    fontSize: 40,
    marginTop: 30,
  },
  game__align: {
    alignItems: "center",
  },
  game__fieldContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 60,
    gap: 5,
    maxHeight: 310,
    maxWidth: 310,
  },
  game__fieldPadding: {
    width: 100,
    height: 100,
    justifyContent: "center",

    backgroundColor: "teal",
    borderRadius: 10,
  },
  game__fieldText: {
    textAlign: "center",
    fontSize: 60,
    color: "white",
  },
  game__buttonContainer: {
    margin: 20,
  },
  game__modal: {
    margin: 20,
    marginTop: 200,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
