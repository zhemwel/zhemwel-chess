import type { ChessBoard, Position, ChessPiece } from "./chess-logic"

export interface Move {
  from: Position
  to: Position
  piece: ChessPiece
  capturedPiece?: ChessPiece | null
  score: number
}

export function getAllValidMoves(board: ChessBoard, color: "white" | "black"): Move[] {
  const moves: Move[] = []

  // Debug
  console.log("Finding moves for color:", color)

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col]
      if (piece && piece.color === color) {
        const from = { row, col }
        console.log(`Checking piece at ${row},${col}:`, piece)

        // Try all possible destinations
        for (let toRow = 0; toRow < 8; toRow++) {
          for (let toCol = 0; toCol < 8; toCol++) {
            const to = { row: toRow, col: toCol }

            // Skip same position
            if (row === toRow && col === toCol) continue

            if (isValidMove(board, from, to)) {
              const capturedPiece = board[toRow][toCol]
              const score = evaluateMove(piece, capturedPiece, from, to)

              moves.push({
                from,
                to,
                piece,
                capturedPiece,
                score,
              })

              console.log(`Valid move: ${row},${col} to ${toRow},${toCol}`)
            }
          }
        }
      }
    }
  }

  console.log(`Found ${moves.length} valid moves for ${color}`)
  return moves
}

function isValidMove(board: ChessBoard, from: Position, to: Position): boolean {
  const piece = board[from.row][from.col]
  const targetPiece = board[to.row][to.col]

  if (!piece) return false
  if (targetPiece && targetPiece.color === piece.color) return false

  const rowDiff = to.row - from.row
  const colDiff = to.col - from.col
  const absRowDiff = Math.abs(rowDiff)
  const absColDiff = Math.abs(colDiff)

  switch (piece.type) {
    case "pawn":
      const direction = piece.color === "white" ? -1 : 1
      const startRow = piece.color === "white" ? 6 : 1

      if (colDiff === 0) {
        if (targetPiece) return false
        if (rowDiff === direction) return true
        if (from.row === startRow && rowDiff === direction * 2) {
          // Check if path is blocked for double move
          const middleRow = from.row + direction
          if (board[middleRow][from.col]) return false
          return true
        }
        return false
      } else if (absColDiff === 1 && rowDiff === direction) {
        return !!targetPiece
      }
      return false

    case "rook":
      if (absRowDiff === 0 || absColDiff === 0) {
        return !isPathBlocked(board, from, to)
      }
      return false

    case "bishop":
      if (absRowDiff === absColDiff) {
        return !isPathBlocked(board, from, to)
      }
      return false

    case "queen":
      if (absRowDiff === absColDiff || absRowDiff === 0 || absColDiff === 0) {
        return !isPathBlocked(board, from, to)
      }
      return false

    case "king":
      return absRowDiff <= 1 && absColDiff <= 1

    case "knight":
      return (absRowDiff === 2 && absColDiff === 1) || (absRowDiff === 1 && absColDiff === 2)

    default:
      return false
  }
}

function isPathBlocked(board: ChessBoard, from: Position, to: Position): boolean {
  const rowStep = to.row > from.row ? 1 : to.row < from.row ? -1 : 0
  const colStep = to.col > from.col ? 1 : to.col < from.col ? -1 : 0

  let currentRow = from.row + rowStep
  let currentCol = from.col + colStep

  while (currentRow !== to.row || currentCol !== to.col) {
    if (board[currentRow][currentCol]) return true
    currentRow += rowStep
    currentCol += colStep
  }

  return false
}

function evaluateMove(piece: ChessPiece, capturedPiece: ChessPiece | null, from: Position, to: Position): number {
  let score = 0

  // Piece values
  const pieceValues = {
    pawn: 1,
    knight: 3,
    bishop: 3,
    rook: 5,
    queen: 9,
    king: 100,
  }

  // Capture bonus
  if (capturedPiece) {
    score += pieceValues[capturedPiece.type] * 10
  }

  // Center control bonus
  const centerDistance = Math.abs(3.5 - to.col) + Math.abs(3.5 - to.row)
  score += (7 - centerDistance) * 0.1

  // Piece development bonus
  if (piece.type === "knight" || piece.type === "bishop") {
    if (from.row === 0 || from.row === 7) {
      score += 0.5 // Bonus for developing pieces
    }
  }

  // Pawn advancement bonus
  if (piece.type === "pawn") {
    if (piece.color === "black") {
      score += to.row * 0.1 // Black pawns advance down
    } else {
      score += (7 - to.row) * 0.1 // White pawns advance up
    }
  }

  // Add small random factor
  score += Math.random() * 0.2

  return score
}

export function findBestMove(board: ChessBoard, color: "white" | "black"): Move | null {
  console.log("Finding best move for", color)
  const allMoves = getAllValidMoves(board, color)

  if (allMoves.length === 0) {
    console.log("No valid moves found")
    return null
  }

  // Sort moves by score (highest first)
  allMoves.sort((a, b) => b.score - a.score)

  console.log("Top 3 moves:", allMoves.slice(0, 3))

  // Add some randomness to make AI less predictable
  const topMoves = allMoves.filter((move) => move.score >= allMoves[0].score - 1)
  const randomIndex = Math.floor(Math.random() * Math.min(3, topMoves.length))

  const selectedMove = topMoves[randomIndex] || allMoves[0]
  console.log("Selected move:", selectedMove)

  return selectedMove
}
