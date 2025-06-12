export type ChessPieceType = "pawn" | "rook" | "knight" | "bishop" | "queen" | "king"

export interface ChessPiece {
  type: ChessPieceType
  color: "white" | "black"
}

export interface Position {
  row: number
  col: number
}

export type ChessBoard = (ChessPiece | null)[][]

export const initialChessBoard: ChessBoard = [
  // Black pieces (row 0)
  [
    { type: "rook", color: "black" },
    { type: "knight", color: "black" },
    { type: "bishop", color: "black" },
    { type: "queen", color: "black" },
    { type: "king", color: "black" },
    { type: "bishop", color: "black" },
    { type: "knight", color: "black" },
    { type: "rook", color: "black" },
  ],
  // Black pawns (row 1)
  Array(8).fill({ type: "pawn", color: "black" }),
  // Empty rows (2-5)
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  // White pawns (row 6)
  Array(8).fill({ type: "pawn", color: "white" }),
  // White pieces (row 7)
  [
    { type: "rook", color: "white" },
    { type: "knight", color: "white" },
    { type: "bishop", color: "white" },
    { type: "queen", color: "white" },
    { type: "king", color: "white" },
    { type: "bishop", color: "white" },
    { type: "knight", color: "white" },
    { type: "rook", color: "white" },
  ],
]
