import { exec } from "child_process";

export default command => {
  console.log(command);
  exec("irsend SEND_ONCE ollehtv " + command);
};
