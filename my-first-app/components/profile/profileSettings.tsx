import Card from "../other/card";
import { Text, View, Switch } from "react-native";
import { styles } from "./styles";

type Props = {
  mode: string;
  onToggleMode: () => void;
};

export default function ProfileSettings({ mode, onToggleMode }: Props) {
  const isDark = mode === "dark";

  return (
    <Card>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.row}>
        <Text style={styles.subText}>🌙 Dark mode</Text>
        <Switch value={isDark} onValueChange={onToggleMode} />
      </View>
    </Card>
  );
}
