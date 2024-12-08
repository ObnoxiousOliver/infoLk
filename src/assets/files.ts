import { AliasDirectory, Directory } from "../resources/fs/Directory";
import { LinkFile } from "../resources/fs/LinkFile";
import { cat } from "./bin/cat";
import { cd } from "./bin/cd";
import { clear } from "./bin/clear";
import { help } from "./bin/help";
import { java } from "./bin/java";
import { ls } from "./bin/ls";
import { INFO_LK } from "./Dokumente/INFO_LK.java";

export const files = [
  new Directory('home', [
    new AliasDirectory('pc', '~', [
      new Directory('Dokumente', [
        new Directory('Informatik', [
          INFO_LK
        ])
      ]),
      new Directory('Bilder'),
      new Directory('Videos'),
      new Directory('Musik', [
        new LinkFile('Rickroll', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ')
      ]),
    ]),
  ]),
  new Directory('bin', [
    cat,
    cd,
    ls,
    clear,
    help,
    java
  ]),
]