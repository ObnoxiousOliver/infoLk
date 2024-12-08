export class Vec3 {
  constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly z: number
  ) {}

  add(other: Vec3): Vec3 {
    return new Vec3(
      this.x + other.x,
      this.y + other.y,
      this.z + other.z
    )
  }

  subtract(other: Vec3): Vec3 {
    return new Vec3(
      this.x - other.x,
      this.y - other.y,
      this.z - other.z
    )
  }

  /**
   * Rotate the vector by the given euler angles
   */
  rotate(euler: Vec3): Vec3 {
    return new Vec3(
      this.x,
      this.y * Math.cos(euler.x) - this.z * Math.sin(euler.x),
      this.y * Math.sin(euler.x) + this.z * Math.cos(euler.x)
    ).rotateY(euler.y).rotateZ(euler.z)
  }

  /**
   * Rotate the vector by the given euler angles
   */
  rotateY(angle: number): Vec3 {
    return new Vec3(
      this.x * Math.cos(angle) + this.z * Math.sin(angle),
      this.y,
      -this.x * Math.sin(angle) + this.z * Math.cos(angle)
    )
  }

  /**
   * Rotate the vector by the given euler angles
   */
  rotateZ(angle: number): Vec3 {
    return new Vec3(
      this.x * Math.cos(angle) - this.y * Math.sin(angle),
      this.x * Math.sin(angle) + this.y * Math.cos(angle),
      this.z
    )
  }

  multiply(scalar: number): Vec3 {
    return new Vec3(
      this.x * scalar,
      this.y * scalar,
      this.z * scalar
    )
  }

  divide(scalar: number): Vec3 {
    return new Vec3(
      this.x / scalar,
      this.y / scalar,
      this.z / scalar
    )
  }

  dot(other: Vec3): number {
    return this.x * other.x + this.y * other.y + this.z * other.z
  }

  cross(other: Vec3): Vec3 {
    return new Vec3(
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x
    )
  }

  magnitude(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2)
  }

  normalize(): Vec3 {
    return this.divide(this.magnitude())
  }

  static get zero(): Vec3 {
    return new Vec3(0, 0, 0)
  }

  static get up(): Vec3 {
    return new Vec3(0, 1, 0)
  }

  static get down(): Vec3 {
    return new Vec3(0, -1, 0)
  }

  static get left(): Vec3 {
    return new Vec3(-1, 0, 0)
  }

  static get right(): Vec3 {
    return new Vec3(1, 0, 0)
  }

  static get forward(): Vec3 {
    return new Vec3(0, 0, 1)
  }

  static get back(): Vec3 {
    return new Vec3(0, 0, -1)
  }
}