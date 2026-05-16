import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

const TODO_REMINDERS_CHANNEL_ID = "todo-reminders";
export const TODO_REMINDER_CATEGORY_ID = "todo_reminder";
export const TODO_NOTIFICATION_ACTIONS = {
  show: "show_todo",
  delete: "delete_todo",
} as const;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export type TodoNotificationInput = {
  todoId: number;
  title: string;
  reminderAt?: string | null;
};

let didConfigureNotifications = false;

export async function configureNotifications() {
  if (didConfigureNotifications) {
    return;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(TODO_REMINDERS_CHANNEL_ID, {
      name: "Todo reminders",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#111111",
      sound: "default",
    });
  }

  await Notifications.setNotificationCategoryAsync(TODO_REMINDER_CATEGORY_ID, [
    {
      identifier: TODO_NOTIFICATION_ACTIONS.show,
      buttonTitle: "Show",
      options: {
        opensAppToForeground: true,
      },
    },
    {
      identifier: TODO_NOTIFICATION_ACTIONS.delete,
      buttonTitle: "Delete",
      options: {
        isDestructive: true,
        opensAppToForeground: true,
      },
    },
  ]);

  didConfigureNotifications = true;
}

export async function ensureNotificationPermissions() {
  const currentPermissions = await Notifications.getPermissionsAsync();

  if (
    currentPermissions.granted ||
    currentPermissions.ios?.status ===
      Notifications.IosAuthorizationStatus.PROVISIONAL
  ) {
    return true;
  }

  const requestedPermissions = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: false,
      allowSound: true,
    },
  });

  return (
    requestedPermissions.granted ||
    requestedPermissions.ios?.status ===
      Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

export function isFutureReminder(reminderAt?: string | null) {
  if (!reminderAt) {
    return false;
  }

  const reminderDate = new Date(reminderAt as string);
  return (
    Number.isFinite(reminderDate.getTime()) &&
    reminderDate.getTime() > Date.now()
  );
}

export async function scheduleTodoNotification({
  todoId,
  title,
  reminderAt,
}: TodoNotificationInput) {
  if (!isFutureReminder(reminderAt)) {
    return null;
  }

  const scheduledReminderAt = reminderAt;
  if (!scheduledReminderAt) {
    return null;
  }

  const reminderDate = new Date(scheduledReminderAt);

  await configureNotifications();

  const hasPermission = await ensureNotificationPermissions();
  if (!hasPermission) {
    return null;
  }

  return Notifications.scheduleNotificationAsync({
    content: {
      title: "Task reminder",
      body: title,
      sound: "default",
      categoryIdentifier: TODO_REMINDER_CATEGORY_ID,
      data: { todoId, reminderAt, url: "/todos" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: reminderDate,
      channelId: TODO_REMINDERS_CHANNEL_ID,
    },
  });
}

export async function cancelTodoNotification(notificationId?: string | null) {
  if (!notificationId) {
    return;
  }

  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

export async function cancelAllTodoNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
