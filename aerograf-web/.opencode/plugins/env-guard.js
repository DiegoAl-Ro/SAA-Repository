export default {
  id: "aerograff-env-guard",
  setup() {
    return {
      "tool.execute.before": async (input, output) => {
        if (input.tool === "read" && output.args?.filePath?.includes(".env")) {
          throw new Error("Acceso bloqueado a archivos .env por seguridad");
        }
      },
    };
  },
};
