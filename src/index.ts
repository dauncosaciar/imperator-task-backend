import colors from "colors";
import server from "./server";

const port = process.env.PORT || 3333;

server.listen(port, () => {
  console.log(colors.bold.magenta.italic(`\nREST API running on port ${port}`));
});
