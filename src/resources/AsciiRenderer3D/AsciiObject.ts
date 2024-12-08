import { Vec3 } from "./Vec3";

export class AsciiObject {
  constructor(
    public readonly vertices: Vertex[],
    public readonly edges: Edge[],
    public position: Vec3,
    public euler: Vec3
  ) {}

  public render(options: {
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
    // Translate and rotate vertices based on object position and rotation and camera position and rotation
    const verts = this.vertices.map(vertex => {
      const rotated = vertex.position.rotate(this.euler)
      const translated = rotated.add(this.position)
      const camRotated = translated.rotate(options.camEulerRot)
      const camTranslated = camRotated.subtract(options.camPos)

      return new Vertex(
        camTranslated.x,
        camTranslated.y,
        camTranslated.z,
        vertex.renderFunction
      )
    })

    // Project vertices onto the screen
    const projectedVerts = verts.map(vertex => {
      const aspect = options.resolution.width / (options.resolution.height * 2)
      const z = vertex.position.z
      const x = vertex.position.x / (z * aspect + 1)
      const y = vertex.position.y / (z + 1)

      // const x = vertex.position.x / (vertex.position.z + 1)
      // const y = vertex.position.y / (vertex.position.z + 1)

      return {
        position: new Vec3(x, y, 0),
        renderFunction: vertex.renderFunction
      } as Vertex
    })

    // Render Vertices
    const renderData = Array(options.resolution.height).fill(null).map(() => Array(options.resolution.width).fill(' ').join(''))
    const depthBuffer = Array(options.resolution.height).fill(null).map(() => Array(options.resolution.width).fill(Infinity))

    // console.log(renderData)

    projectedVerts.forEach(vertex => {
      const x = Math.round((vertex.position.x + 1) * options.resolution.width / 2)
      const y = Math.round((vertex.position.y + 1) * options.resolution.height / 2)

      if (x >= 0 && x < options.resolution.width && y >= 0 && y < options.resolution.height) {
        const renderChar = vertex.renderFunction()

        if (renderChar === '') return

        if (vertex.position.z < depthBuffer[y][x]) {
          renderData[y] = renderData[y].substring(0, x) + renderChar + renderData[y].substring(x + 1)
          depthBuffer[y][x] = vertex.position.z
        }
      }
    })

    // Render Edges
    this.edges.forEach(edge => {
      const a = projectedVerts[edge.a]
      const b = projectedVerts[edge.b]

      let x0 = Math.round((a.position.x + 1) * options.resolution.width / 2)
      let y0 = Math.round((a.position.y + 1) * options.resolution.height / 2)
      const x1 = Math.round((b.position.x + 1) * options.resolution.width / 2)
      const y1 = Math.round((b.position.y + 1) * options.resolution.height / 2)

      const dx = Math.abs(x1 - x0)
      const dy = Math.abs(y1 - y0)
      const sx = x0 < x1 ? 1 : -1
      const sy = y0 < y1 ? 1 : -1
      let err = dx - dy

      let n = 0
      while (n++ < 1000) {
        if (x0 >= 0 && x0 < options.resolution.width && y0 >= 0 && y0 < options.resolution.height) {
          if (x0 === x1 && y0 === y1) break

          const renderChar = edge.renderFunction(0)

          if (renderChar === '') break

          if (projectedVerts[edge.a].position.z < depthBuffer[y0][x0]) {
            renderData[y0] = renderData[y0].substring(0, x0) + renderChar + renderData[y0].substring(x0 + 1)
            depthBuffer[y0][x0] = projectedVerts[edge.a].position.z
          }
        }

        const e2 = 2 * err
        if (e2 > -dy) {
          err -= dy
          x0 += sx
        }
        if (e2 < dx) {
          err += dx
          y0 += sy
        }
      }
    })

    return {
      data: renderData.map(row => row).join('\n'),
      depthBuffer
    }
  }
}

export class Vertex {
  public readonly position: Vec3

  constructor(
    x: number,
    y: number,
    z: number,
    public readonly renderFunction: () => string = () => ''
  ) {
    this.position = new Vec3(x, y, z)
  }
}

export class Edge {
  constructor(
    public readonly a: number,
    public readonly b: number,
    public readonly renderFunction: (t: number) => string = () => ''
  ) {}
}
