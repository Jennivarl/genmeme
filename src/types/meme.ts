export interface TextBox {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
  isBold: boolean;
  isItalic: boolean;
  maxWidth: number;
}

export interface MemeTemplate {
  id: string;
  name: string;
  image: string;
  width: number;
  height: number;
}
