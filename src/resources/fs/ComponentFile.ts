import { Component } from "vue";
import { FileElement } from "./FileElement";

export class ComponentFile extends FileElement {
  type: 'file' = 'file'

  constructor(
    public readonly name: string,
    public readonly content: Component,
    public readonly extension?: string
  ) {
    super()
  }
}