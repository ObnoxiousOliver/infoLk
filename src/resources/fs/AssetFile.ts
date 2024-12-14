import { FileElement } from "./FileElement";

export class AssetFile extends FileElement {
  type: 'file' = 'file'

  constructor(
    public readonly name: string,
    public readonly src: string,
    public readonly extension?: string,
  ) {
    super()
  }
}