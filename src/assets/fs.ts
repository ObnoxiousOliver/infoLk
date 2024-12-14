import { Directory } from "../resources/fs/Directory";
import { FileSystem } from "../resources/fs/FileSystem";
import { ImageFile } from "../resources/fs/ImageFile";
import { RichTextFile } from "../resources/fs/RichTextFile";
import Test from "./text/Test.vue";

export const fs = new FileSystem([
  new Directory('Bilder', [
    new ImageFile(
      'lkpulli.png',
      '/lkpulli.png'
    )
  ]),
  new Directory('Dokumente', [
    new RichTextFile(
      'Test.txt',
      Test
    )
  ]),
  new Directory('Videos', []),
  new Directory('Music', [])
])