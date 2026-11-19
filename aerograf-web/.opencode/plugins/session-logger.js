export default {
  id: "aerograff-session-logger",
  setup({ client }) {
    return {
      event: async ({ event }) => {
        if (event.type === "session.idle") {
          await client.app.log({
            body: {
              service: "aerograff-logger",
              level: "info",
              message: "Tarea de AeroGraff AI completada correctamente",
            },
          });
        }
      },
    };
  },
};
