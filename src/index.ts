import colors from "colors";
import server from "./server";

const port = process.env.PORT || 3333;

server.listen(port, () => {
  console.log(colors.bold.cyan.italic(`REST API running on port ${port}`));
});
