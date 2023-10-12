
const ask = async (prompt) => {
  process.stdout.write(prompt);
  for await (const line of console) {
    return line;
  }
}

let namespace = await ask("Namespace ('lwc' required): ") || "src/modules/lwc";
let componentName = await ask("LWC Component Name: ");

// run command
const proc = Bun.spawn(["sf", "lightning", "generate", "component", "--type", "lwc", "-d", namespace, "-n", componentName]);
const output = await new Response(proc.stdout).text();
console.log(output)
