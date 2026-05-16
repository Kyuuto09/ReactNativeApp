import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import React, { useEffect } from "react";
import { DeviceEventEmitter } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import {
  configureNotifications,
  TODO_NOTIFICATION_ACTIONS,
} from "@/services/notifications-service";
import { deleteTodoFromDb, initTodosDb } from "@/services/todos-db";

const getTodoIdFromNotification = (
  response: Notifications.NotificationResponse,
) => {
  const todoId = response.notification.request.content.data?.todoId;

  if (typeof todoId === "number") {
    return todoId;
  }

  if (typeof todoId === "string") {
    const parsedTodoId = Number(todoId);
    return Number.isFinite(parsedTodoId) ? parsedTodoId : null;
  }

  return null;
};

const handleTodoNotificationResponse = async (
  response: Notifications.NotificationResponse,
) => {
  const todoId = getTodoIdFromNotification(response);

  const openTodosTab = () => {
    setTimeout(() => {
      router.navigate("/todos");
    }, 100);
  };

  if (response.actionIdentifier === TODO_NOTIFICATION_ACTIONS.delete) {
    if (todoId !== null) {
      await initTodosDb();
      await deleteTodoFromDb(todoId);
      DeviceEventEmitter.emit("todos:changed");
    }

    openTodosTab();
    return;
  }

  openTodosTab();
};

export default function RootLayout() {
  useEffect(() => {
    configureNotifications().catch((error) => {
      console.error("Failed to configure notifications", error);
    });

    const lastResponse = Notifications.getLastNotificationResponse();
    if (lastResponse) {
      handleTodoNotificationResponse(lastResponse).catch((error) => {
        console.error("Failed to handle notification response", error);
      });
      Notifications.clearLastNotificationResponse();
    }

    const subscription =
      Notifications.addNotificationResponseReceivedListener((response) => {
        handleTodoNotificationResponse(response).catch((error) => {
          console.error("Failed to handle notification response", error);
        });
      });

    return () => subscription.remove();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NativeTabs tintColor="#111111">
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
    </GestureHandlerRootView>
  );
}
