import { Scene } from "./Scene";
import { Vec3 } from "./Vec3";

export class AsciiRenderer3D {
  constructor(
    public readonly scene: Scene
  ) {}

  render(options: {
    resolution: {
      width: number,
      height: number
    },
    camPos: Vec3,
    camEulerRot: Vec3
  }): {
    data: string,
    depthBuffer: number[][]
  } {
    const renders = this.scene.objects.map(object => object.render(options))

    let finalRender = ''
    let finalDepthBuffer: number[][] = []

    // Merge renders
    for (let y = 0; y < options.resolution.height; y++) {
      finalDepthBuffer.push([])

      for (let x = 0; x < options.resolution.width; x++) {
        const renderChar = renders
          .map(render => ({
            char: render.data.split('\n')[y].split('')[x],
            depth: render.depthBuffer[y][x]
          }))
          .reduce((prev, curr) => prev.depth < curr.depth ? prev : curr)

        finalRender += renderChar.char
        finalDepthBuffer[y].push(renderChar.depth)
      }
      finalRender += '\n'
    }

    return {
      data: finalRender,
      depthBuffer: finalDepthBuffer
    }
  }
}