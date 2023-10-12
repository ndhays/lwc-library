
const ask = async (prompt) => {
  process.stdout.write(prompt);
  for await (const line of console) {
    return line;
  }
}

let componentName = await ask("Story Component Name: ");
let cloneFrom = await ask("Clone story from: ");

// copy directory
const proc = Bun.spawnSync(["cp", "-r", `src/modules/story/${cloneFrom}`, `src/modules/story/${componentName}`]);

// rename new files

// js
const proc2 = Bun.spawnSync(["mv", `src/modules/story/${componentName}/${cloneFrom}.js`, `src/modules/story/${componentName}/${componentName}.js`]);

// html
const proc3 = Bun.spawnSync(["mv", `src/modules/story/${componentName}/${cloneFrom}.html`, `src/modules/story/${componentName}/${componentName}.html`]);