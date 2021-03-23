(async () => await Deno.run({ cmd: ["file_server", "public/"] }).status())();
const fw = Deno.watchFs("src/");

for await (const ev of fw) {
  await Deno.run({
    cmd: "deno bundle -c tsconfig.json src/main.js public/out.js".split(" "),
  }).status();
}
