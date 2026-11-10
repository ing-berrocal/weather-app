// Colors are off when NO_COLOR is set or when output is not a terminal
const useColor = !process.env.NO_COLOR && process.stdout.isTTY;

// Wraps text in an ANSI color code, or returns it unchanged when colors are off
function paint(code: number, text: string): string {
  return useColor ? `\x1b[${code}m${text}\x1b[0m` : text;
}

export const cyan = (text: string): string => paint(36, text);
export const yellow = (text: string): string => paint(33, text);
export const green = (text: string): string => paint(32, text);
export const red = (text: string): string => paint(31, text);
