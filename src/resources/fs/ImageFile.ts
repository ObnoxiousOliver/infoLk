import { AssetFile } from "./AssetFile";

export class ImageFile extends AssetFile {
  public readonly extension: 'png' | 'jpg' = 'png'
}