import { useQuasar } from "quasar";

export function useNotifications() {
  const { notify } = useQuasar();

  const showError = (accion, error, from) => {
    notify({
      color: "red-5",
      textColor: "white",
      icon: "warning",
      message: accion + " " + error,
    });
  };

  const showSuccess = (message) => {
    notify({
      color: "green-4",
      textColor: "white",
      icon: "cloud_done",
      message: message,
    });
  };

  return { showError, showSuccess };
}
