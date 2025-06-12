"use client"

import { useState, useEffect } from "react"
import ChessBoard from "./chess-board"
import ChessPiece from "./chess-piece"
import { initialChessBoard, type Position } from "@/lib/chess-logic"
import { Text } from "@react-three/drei" // Import Text component

interface ChessGameProps {
  onRestartGame: () => void // Prop to trigger full game reset from parent
}

export default function ChessGame({ onRestartGame }: ChessGameProps) {
  const [board, setBoard] = useState(initialChessBoard)
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null)
  const [currentPlayer, setCurrentPlayer] = useState<"white" | "black">("white")
  const [gameStatus, setGameStatus] = useState<string>("Your turn (White)")
  const [isAiThinking, setIsAiThinking] = useState(false)
  const [gameOver, setGameOver] = useState<{ isOver: boolean; winner?: string; reason?: string }>({
    isOver: false,
  })

  // Check if king is captured
  const checkGameOver = (newBoard: any[][]) => {
    let whiteKing = false
    let blackKing = false

    // Check if both kings are still on the board
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = newBoard[row][col]
        if (piece && piece.type === "king") {
          if (piece.color === "white") whiteKing = true
          if (piece.color === "black") blackKing = true
        }
      }
    }

    if (!whiteKing) {
      setGameOver({ isOver: true, winner: "Black (AI)", reason: "White King captured!" })
      setGameStatus("Game Over - AI Wins!")
      return true
    }

    if (!blackKing) {
      setGameOver({ isOver: true, winner: "White (Player)", reason: "Black King captured!" })
      setGameStatus("Game Over - You Win!")
      return true
    }

    return false
  }

  // Simple AI that makes random valid moves
  const makeAiMove = () => {
    if (gameOver.isOver) return

    console.log("AI making move...")

    // Find all black pieces and their valid moves
    const validMoves: { from: Position; to: Position }[] = []

    for (let fromRow = 0; fromRow < 8; fromRow++) {
      for (let fromCol = 0; fromCol < 8; fromCol++) {
        const piece = board[fromRow][fromCol]
        if (piece && piece.color === "black") {
          // Check all possible destinations for this piece
          for (let toRow = 0; toRow < 8; toRow++) {
            for (let toCol = 0; toCol < 8; toCol++) {
              const from = { row: fromRow, col: fromCol }
              const to = { row: toRow, col: toCol }

              if (isValidMove(from, to)) {
                validMoves.push({ from, to })
              }
            }
          }
        }
      }
    }

    console.log(`Found ${validMoves.length} valid moves for AI`)

    if (validMoves.length > 0) {
      // Prioritize capturing the king
      const kingCaptureMoves = validMoves.filter((move) => {
        const targetPiece = board[move.to.row][move.to.col]
        return targetPiece && targetPiece.type === "king" && targetPiece.color === "white"
      })

      // Prioritize other captures
      const captureMoves = validMoves.filter((move) => {
        const targetPiece = board[move.to.row][move.to.col]
        return targetPiece && targetPiece.color === "white"
      })

      // Choose move priority: King capture > Other captures > Random move
      let selectedMove
      if (kingCaptureMoves.length > 0) {
        selectedMove = kingCaptureMoves[0]
        console.log("AI capturing king!")
      } else if (captureMoves.length > 0) {
        selectedMove = captureMoves[Math.floor(Math.random() * captureMoves.length)]
        console.log("AI making capture move")
      } else {
        selectedMove = validMoves[Math.floor(Math.random() * validMoves.length)]
        console.log("AI making random move")
      }

      console.log("AI selected move:", selectedMove)

      // Execute the move
      const newBoard = board.map((row) => [...row])
      const piece = newBoard[selectedMove.from.row][selectedMove.from.col]
      newBoard[selectedMove.to.row][selectedMove.to.col] = piece
      newBoard[selectedMove.from.row][selectedMove.from.col] = null

      // Check for pawn promotion for black (AI)
      if (piece && piece.type === "pawn" && selectedMove.to.row === 7) {
        newBoard[selectedMove.to.row][selectedMove.to.col] = { type: "queen", color: "black" }
        console.log("Black pawn promoted to queen!")
      }

      setBoard(newBoard)

      // Check if game is over after AI move
      if (!checkGameOver(newBoard)) {
        setCurrentPlayer("white")
        setGameStatus("Your turn (White)")
      }

      console.log("AI move completed")
    } else {
      console.log("No valid moves for AI")
      setGameOver({ isOver: true, winner: "White (Player)", reason: "AI has no valid moves!" })
      setGameStatus("Game Over - You Win!")
    }
  }

  // AI move effect - simplified
  useEffect(() => {
    if (currentPlayer === "black" && !isAiThinking && !gameOver.isOver) {
      setIsAiThinking(true)
      setGameStatus("AI is thinking...")

      // Use setTimeout to make AI move after delay
      const timer = setTimeout(() => {
        makeAiMove()
        setIsAiThinking(false)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [currentPlayer, gameOver.isOver])

  const handleSquareClick = (row: number, col: number) => {
    // Don't allow moves if game is over
    if (gameOver.isOver) return

    // Only allow moves when it's white's turn and AI is not thinking
    if (currentPlayer !== "white" || isAiThinking) {
      console.log("Not player's turn")
      return
    }

    const clickedSquare: Position = { row, col }

    if (selectedSquare) {
      // Try to move piece
      if (isValidMove(selectedSquare, clickedSquare)) {
        console.log("Player moving piece")

        // Execute player move
        const newBoard = board.map((row) => [...row])
        const piece = newBoard[selectedSquare.row][selectedSquare.col]
        const capturedPiece = newBoard[clickedSquare.row][clickedSquare.col]

        newBoard[clickedSquare.row][clickedSquare.col] = piece
        newBoard[selectedSquare.row][selectedSquare.col] = null

        // Check for pawn promotion for white
        if (piece && piece.type === "pawn" && clickedSquare.row === 0) {
          newBoard[clickedSquare.row][clickedSquare.col] = { type: "queen", color: "white" }
          console.log("White pawn promoted to queen!")
        }

        setBoard(newBoard)
        setSelectedSquare(null)

        // Check if player captured the king
        if (capturedPiece && capturedPiece.type === "king") {
          console.log("Player captured the king!")
        }

        // Check if game is over after player move
        if (!checkGameOver(newBoard)) {
          setCurrentPlayer("black") // Switch to AI
          setGameStatus("AI's turn")
        }

        console.log("Switched to AI turn")
      } else {
        // Select new piece if it belongs to current player
        const piece = board[row][col]
        if (piece && piece.color === "white") {
          setSelectedSquare(clickedSquare)
        } else {
          setSelectedSquare(null)
        }
      }
    } else {
      // Select piece if it belongs to current player (white only)
      const piece = board[row][col]
      if (piece && piece.color === "white") {
        setSelectedSquare(clickedSquare)
        console.log("Selected white piece at", row, col)
      }
    }
  }

  const isValidMove = (from: Position, to: Position): boolean => {
    const piece = board[from.row][from.col]
    const targetPiece = board[to.row][to.col]

    if (!piece) return false
    if (targetPiece && targetPiece.color === piece.color) return false
    if (to.row < 0 || to.row > 7 || to.col < 0 || to.col > 7) return false
    if (from.row === to.row && from.col === to.col) return false

    const rowDiff = to.row - from.row
    const colDiff = to.col - from.col
    const absRowDiff = Math.abs(rowDiff)
    const absColDiff = Math.abs(colDiff)

    switch (piece.type) {
      case "pawn":
        const direction = piece.color === "white" ? -1 : 1
        const startRow = piece.color === "white" ? 6 : 1

        // Forward move
        if (colDiff === 0) {
          if (targetPiece) return false // Can't capture forward

          // Single step forward
          if (rowDiff === direction) return true

          // Double step from starting position
          if (from.row === startRow && rowDiff === direction * 2) {
            // Check if path is blocked for double move
            const middleRow = from.row + direction
            if (board[middleRow][from.col]) return false
            return true
          }

          return false
        }
        // Diagonal capture
        else if (absColDiff === 1 && rowDiff === direction) {
          return !!targetPiece // Must have piece to capture
        }
        return false

      case "rook":
        if (absRowDiff === 0 || absColDiff === 0) {
          return !isPathBlocked(from, to)
        }
        return false

      case "bishop":
        if (absRowDiff === absColDiff) {
          return !isPathBlocked(from, to)
        }
        return false

      case "queen":
        if (absRowDiff === absColDiff || absRowDiff === 0 || absColDiff === 0) {
          return !isPathBlocked(from, to)
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

  const isPathBlocked = (from: Position, to: Position): boolean => {
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

  return (
    <group>
      {/* Cloud Environment */}

      {/* Large background clouds */}
      <group position={[0, -1, -20]}>
        {/* Main cloud layer */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[15, 8, 6]} />
          <meshLambertMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>

        {/* Additional cloud puffs */}
        <mesh position={[-8, 2, 5]}>
          <sphereGeometry args={[6, 8, 6]} />
          <meshLambertMaterial color="#f8f8ff" transparent opacity={0.7} />
        </mesh>

        <mesh position={[10, 1, 3]}>
          <sphereGeometry args={[8, 8, 6]} />
          <meshLambertMaterial color="#f0f8ff" transparent opacity={0.6} />
        </mesh>

        <mesh position={[-12, -1, -5]}>
          <sphereGeometry args={[7, 8, 6]} />
          <meshLambertMaterial color="#ffffff" transparent opacity={0.5} />
        </mesh>

        <mesh position={[15, 3, -8]}>
          <sphereGeometry args={[9, 8, 6]} />
          <meshLambertMaterial color="#f5f5ff" transparent opacity={0.7} />
        </mesh>
      </group>

      {/* Distant cloud layer */}
      <group position={[0, 2, -40]}>
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[20, 8, 6]} />
          <meshLambertMaterial color="#e6e6fa" transparent opacity={0.4} />
        </mesh>

        <mesh position={[-15, 2, 0]}>
          <sphereGeometry args={[12, 8, 6]} />
          <meshLambertMaterial color="#f0f0f8" transparent opacity={0.3} />
        </mesh>

        <mesh position={[18, -1, 5]}>
          <sphereGeometry args={[14, 8, 6]} />
          <meshLambertMaterial color="#ffffff" transparent opacity={0.35} />
        </mesh>
      </group>

      {/* Floating cloud platform (ground) */}
      <mesh position={[0, -3, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshLambertMaterial color="#f0f8ff" transparent opacity={0.3} />
      </mesh>

      {/* Enhanced Game Over Overlay */}
      {gameOver.isOver && (
        <group position={[0, 3, 0]}>
          {/* Main overlay background */}
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[10, 6]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.85} />
          </mesh>

          {/* Game Over Title Background */}
          <mesh position={[0, 1.5, 0.01]}>
            <planeGeometry args={[8, 1.2]} />
            <meshBasicMaterial color={gameOver.winner?.includes("Player") ? "#4CAF50" : "#f44336"} />
          </mesh>
          <Text
            position={[0, 1.5, 0.02]}
            fontSize={0.8}
            color="white"
            anchorX="center"
            anchorY="middle"
            // Removed font prop to prevent potential loading issues
          >
            GAME OVER
          </Text>

          {/* Winner text background */}
          <mesh position={[0, 0.3, 0.01]}>
            <planeGeometry args={[7, 0.8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <Text
            position={[0, 0.3, 0.02]}
            fontSize={0.5}
            color="black"
            anchorX="center"
            anchorY="middle"
            // Removed font prop
          >
            {gameOver.winner ? `${gameOver.winner} Wins!` : "It's a Draw!"}
          </Text>

          {/* Reason text background */}
          <mesh position={[0, -0.5, 0.01]}>
            <planeGeometry args={[6, 0.6]} />
            <meshBasicMaterial color="#f5f5f5" />
          </mesh>
          <Text
            position={[0, -0.5, 0.02]}
            fontSize={0.3}
            color="gray"
            anchorX="center"
            anchorY="middle"
            // Removed font prop
          >
            {gameOver.reason}
          </Text>

          {/* Restart Button */}
          <mesh position={[0, -1.8, 0.01]} onClick={onRestartGame}>
            <planeGeometry args={[4, 1]} />
            <meshBasicMaterial color="#2196F3" />
          </mesh>

          {/* Restart Button Hover Effect */}
          <mesh position={[0, -1.8, 0.02]}>
            <planeGeometry args={[3.8, 0.8]} />
            <meshBasicMaterial color="#1976D2" />
          </mesh>

          {/* Restart Button Text */}
          <Text
            position={[0, -1.8, 0.03]}
            fontSize={0.4}
            color="white"
            anchorX="center"
            anchorY="middle"
            // Removed font prop
          >
            RESTART GAME
          </Text>
        </group>
      )}

      {/* Chess Board */}
      <ChessBoard onSquareClick={handleSquareClick} selectedSquare={selectedSquare} />

      {/* Chess Pieces */}
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          if (piece) {
            return (
              <ChessPiece
                key={`${rowIndex}-${colIndex}-${piece.type}-${piece.color}`}
                type={piece.type}
                color={piece.color}
                position={[colIndex - 3.5, 0.5, rowIndex - 3.5]}
                isSelected={selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex}
              />
            )
          }
          return null
        }),
      )}
    </group>
  )
}
