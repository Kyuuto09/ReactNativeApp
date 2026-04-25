import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import React from "react";

export default function RootLayout() {
  return (
    <NativeTabs
      tintColor="#111111"
    >
      <NativeTabs.Trigger name="eu-protocol">
        <Label>EU Protocol</Label>
        <Icon sf="globe" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="todos">
        <Label>To-do</Label>
        <Icon sf="checkmark.circle.fill" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="index">
        <Label>Personality Test</Label>
        <Icon sf="sparkles" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
