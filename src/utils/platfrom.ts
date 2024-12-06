import { UAParser } from "ua-parser-js";

const parser = new UAParser()

export const isMac = parser.getOS().name === 'macOS'
