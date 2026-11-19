export default {
  id: "aerograff-bash-auditor",
  setup({ client }) {
    return {
      "tool.execute.after": async (input) => {
        if (input.tool === "bash") {
          await client.app.log({
            body: {
              service: "aerograff-bash-auditor",
              level: "info",
              message: "Comando de terminal auditado",
            },
          });
        }
      },
    };
  },
};
