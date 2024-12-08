import { ExecutableFile } from "../../resources/fs/ExecutableFile";

export const clear = new ExecutableFile('clear', 'Leert den Bildschirm.', async (ctx) => {
  ctx.stream.clear()
})