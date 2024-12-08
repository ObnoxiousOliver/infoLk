import Color from "color";
import { ContentBlock } from "../../resources/Content";
import { JavaFile } from "../../resources/fs/JavaFile";
import { TextStyle } from "../../resources/TextStyle";
import { sleep } from "../../utils/sleep";

export const INFO_LK = new JavaFile('INFO_LK.java',
// To Java Transpiled
  `
public class INFO_LK {
  public static void main(String[] args) {
    System.out.println("_//Running[x_x]:");
    System.out.println();

    Thread.sleep(100);

    System.out.println("  XXXXX╗ XXXXXX╗ XX╗    XXXXXX╗  XXXXXX╗ XXXXXX╗ XXXXXXX╗ ");
    System.out.println(" XX╔══XX╗XX╔══XX╗XX║    ╚════XX╗XX╔═XXXX╗╚════XX╗XX╔════╝ ");
    System.out.println(" XXXXXXX║XXXXXX╔╝XX║     XXXXX╔╝XX║XX╔XX║ XXXXX╔╝XXXXXXX╗ ");
    System.out.println(" XX╔══XX║XX╔══XX╗XX║    XX╔═══╝ XXXX╔╝XX║XX╔═══╝ ╚════XX║ ");
    System.out.println(" XX║  XX║XXXXxx╔╝XX║    XXXXXXX╗╚XXXXXX╔╝XXXXXXX╗XXXXXXX║ ");
    System.out.println(" ╚═╝  ╚═╝╚═════╝ ╚═╝    ╚══════╝ ╚═════╝ ╚══════╝╚══════╝ ");
  }
}`, async ({ stream }) => {

  stream.writeLn(new ContentBlock('\n_//Running[x_x]:\n', new TextStyle({ color: Color('#8E8E8E') })))
  
  await sleep(100)

  // #region Title
  const title = `  XXXXX╗ XXXXXX╗ XX╗    XXXXXX╗  XXXXXX╗ XXXXXX╗ XXXXXXX╗ 
 XX╔══XX╗XX╔══XX╗XX║    ╚════XX╗XX╔═XXXX╗╚════XX╗XX╔════╝ 
 XXXXXXX║XXXXXX╔╝XX║     XXXXX╔╝XX║XX╔XX║ XXXXX╔╝XXXXXXX╗ 
 XX╔══XX║XX╔══XX╗XX║    XX╔═══╝ XXXX╔╝XX║XX╔═══╝ ╚════XX║ 
 XX║  XX║XXXXXX╔╝XX║    XXXXXXX╗╚XXXXXX╔╝XXXXXXX╗XXXXXXX║ 
 ╚═╝  ╚═╝╚═════╝ ╚═╝    ╚══════╝ ╚═════╝ ╚══════╝╚══════╝ `

  const coloredChars = ['╗', '╝', '╔', '╚', '║', '═']
  const backgroundColoredChars = ['X']

  const content = []

  let currentBlock = ''
  let x = 0
  for (const char of title + 'Z') {
    const last = currentBlock[currentBlock.length - 1] || ''
    const lastTrimmed = currentBlock.trim()[currentBlock.trim().length - 1] || ''
    if (backgroundColoredChars.includes(last) && !backgroundColoredChars.includes(char)) {
      content.push(new ContentBlock(' '.repeat(currentBlock.length), new TextStyle({ color: Color('#000000'), backgroundColor: Color('#ffffff') })))
      currentBlock = char
    } else if (coloredChars.includes(lastTrimmed)) {
      content.push(new ContentBlock(currentBlock, new TextStyle({
        color: Color('#AAFF67').mix(Color('#00E1FF'), (x / title.split('\n')[0].length)),
      })))
      currentBlock = char
    } else if ((!coloredChars.includes(lastTrimmed) && coloredChars.includes(char)) || (!backgroundColoredChars.includes(last) && backgroundColoredChars.includes(char))) {
      content.push(new ContentBlock(currentBlock, new TextStyle({ color: Color('#8E8E8E') })))
      currentBlock = char
    } else {
      currentBlock += char
    }

    x++
    if (char === '\n') {
      x = 0
    }
  }

  stream.writeLn(content)

  // #endregion

  stream.writeLn(new ContentBlock('\n', new TextStyle({ color: Color('#8E8E8E') })))
})