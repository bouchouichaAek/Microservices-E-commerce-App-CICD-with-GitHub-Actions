import fs from "fs";
import path from "path";

function loadTemplate(fileName, variables) {
  const filePath = path.join(process.cwd(), "templates", fileName);
  let html = fs.readFileSync(filePath, "utf8");

  // Replace {{placeholders}}
  for (const key in variables) {
    const regex = new RegExp(`{{${key}}}`, "g");
    html = html.replace(regex, variables[key]);
  }
  return html;
}

export default loadTemplate;
