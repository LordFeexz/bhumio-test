export const getDB = () => {
  console.log(process.env);
  switch (process.env.NODE_ENV) {
    case "development":
      return "bhumio";
    case "test":
      return "bhumio-test";
  }
};
