"use client"

import type { ChessPieceType } from "@/lib/chess-logic"

interface ChessPieceProps {
  type: ChessPieceType
  color: "white" | "black"
  position: [number, number, number]
  isSelected: boolean
}

export default function ChessPiece({ type, color, position, isSelected }: ChessPieceProps) {
  const getPieceGeometry = () => {
    switch (type) {
      case "pawn":
        return (
          <group>
            {/* Pawn base */}
            <mesh position={[0, -0.2, 0]}>
              <cylinderGeometry args={[0.15, 0.2, 0.1, 8]} />
              <meshLambertMaterial color={color === "white" ? "#f5f5dc" : "#2f2f2f"} />
            </mesh>
            {/* Pawn body */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.12, 0.15, 0.3, 8]} />
              <meshLambertMaterial color={color === "white" ? "#f5f5dc" : "#2f2f2f"} />
            </mesh>
            {/* Pawn head */}
            <mesh position={[0, 0.2, 0]}>
              <sphereGeometry args={[0.12, 8, 8]} />
              <meshLambertMaterial color={color === "white" ? "#f5f5dc" : "#2f2f2f"} />
            </mesh>
          </group>
        )

      case "rook":
        return (
          <group>
            {/* Rook base */}
            <mesh position={[0, -0.2, 0]}>
              <cylinderGeometry args={[0.18, 0.22, 0.1, 8]} />
              <meshLambertMaterial color={color === "white" ? "#f5f5dc" : "#2f2f2f"} />
            </mesh>
            {/* Rook body */}
            <mesh position={[0, 0.05, 0]}>
              <cylinderGeometry args={[0.16, 0.18, 0.4, 8]} />
              <meshLambertMaterial color={color === "white" ? "#f5f5dc" : "#2f2f2f"} />
            </mesh>
            {/* Rook top */}
            <mesh position={[0, 0.3, 0]}>
              <cylinderGeometry args={[0.18, 0.16, 0.15, 4]} />
              <meshLambertMaterial color={color === "white" ? "#f5f5dc" : "#2f2f2f"} />
            </mesh>
          </group>
        )

      case "knight":
        return (
          <group>
            {/* Knight base */}
            <mesh position={[0, -0.2, 0]}>
              <cylinderGeometry args={[0.16, 0.2, 0.1, 8]} />
              <meshLambertMaterial color={color === "white" ? "#f5f5dc" : "#2f2f2f"} />
            </mesh>
            {/* Knight body */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.14, 0.16, 0.3, 8]} />
              <meshLambertMaterial color={color === "white" ? "#f5f5dc" : "#2f2f2f"} />
            </mesh>
            {/* Knight head (horse-like shape) */}
            <mesh position={[0.05, 0.25, 0.1]} rotation={[0, 0.3, 0]}>
              <boxGeometry args={[0.15, 0.25, 0.2]} />
              <meshLambertMaterial color={color === "white" ? "#f5f5dc" : "#2f2f2f"} />
            </mesh>
            {/* Knight mane */}
            <mesh position={[-0.05, 0.35, 0.05]} rotation={[0, -0.2, 0]}>
              <coneGeometry args={[0.08, 0.15, 6]} />
              <meshLambertMaterial color={color === "white" ? "#f5f5dc" : "#2f2f2f"} />
            </mesh>
          </group>
        )

      case "bishop":
        return (
          <group>
            {/* Bishop base */}
            <mesh position={[0, -0.2, 0]}>
              <cylinderGeometry args={[0.16, 0.2, 0.1, 8]} />
              <meshLambertMaterial color={color === "white" ? "#f5f5dc" : "#2f2f2f"} />
            </mesh>
            {/* Bishop body */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.12, 0.16, 0.35, 8]} />
              <meshLambertMaterial color={color === "white" ? "#f5f5dc" : "#2f2f2f"} />
            </mesh>
            {/* Bishop head */}
            <mesh position={[0, 0.25, 0]}>
              <sphereGeometry args={[0.14, 8, 8]} />
              <meshLambertMaterial color={color === "white" ? "#f5f5dc" : "#2f2f2f"} />
            </mesh>
            {/* Bishop cross */}
            <mesh position={[0, 0.4, 0]}>
              <boxGeometry args={[0.03, 0.15, 0.03]} />
              <meshLambertMaterial color={color === "white" ? "#f5f5dc" : "#2f2f2f"} />
            </mesh>
            <mesh position={[0, 0.45, 0]} rotation={[0, 0, Math.PI / 2]}>
              <boxGeometry args={[0.03, 0.08, 0.03]} />
              <meshLambertMaterial color={color === "white" ? "#f5f5dc" : "#2f2f2f"} />
            </mesh>
          </group>
        )

      case "queen":
        return (
          <group>
            {/* Queen base */}
            <mesh position={[0, -0.2, 0]}>
              <cylinderGeometry args={[0.18, 0.22, 0.1, 8]} />
              <meshLambertMaterial color={color === "white" ? "#f5f5dc" : "#2f2f2f"} />
            </mesh>
            {/* Queen body */}
            <mesh position={[0, 0.05, 0]}>
              <cylinderGeometry args={[0.14, 0.18, 0.4, 8]} />
              <meshLambertMaterial color={color === "white" ? "#f5f5dc" : "#2f2f2f"} />
            </mesh>
            {/* Queen crown base */}
            <mesh position={[0, 0.35, 0]}>
              <cylinderGeometry args={[0.16, 0.14, 0.1, 8]} />
              <meshLambertMaterial color={color === "white" ? "#f5f5dc" : "#2f2f2f"} />
            </mesh>
            {/* Queen crown points */}
            {[0, 1, 2, 3, 4].map((i) => (
              <mesh
                key={i}
                position={[
                  Math.cos((i * Math.PI * 2) / 5) * 0.12,
                  0.5 + (i % 2 === 0 ? 0.1 : 0),
                  Math.sin((i * Math.PI * 2) / 5) * 0.12,
                ]}
              >
                <coneGeometry args={[0.03, 0.15, 4]} />
                <meshLambertMaterial color={color === "white" ? "#f5f5dc" : "#2f2f2f"} />
              </mesh>
            ))}
          </group>
        )

      case "king":
        return (
          <group>
            {/* King base */}
            <mesh position={[0, -0.2, 0]}>
              <cylinderGeometry args={[0.18, 0.22, 0.1, 8]} />
              <meshLambertMaterial color={color === "white" ? "#f5f5dc" : "#2f2f2f"} />
            </mesh>
            {/* King body */}
            <mesh position={[0, 0.05, 0]}>
              <cylinderGeometry args={[0.15, 0.18, 0.4, 8]} />
              <meshLambertMaterial color={color === "white" ? "#f5f5dc" : "#2f2f2f"} />
            </mesh>
            {/* King crown */}
            <mesh position={[0, 0.35, 0]}>
              <cylinderGeometry args={[0.16, 0.15, 0.12, 8]} />
              <meshLambertMaterial color={color === "white" ? "#f5f5dc" : "#2f2f2f"} />
            </mesh>
            {/* King cross */}
            <mesh position={[0, 0.5, 0]}>
              <boxGeometry args={[0.04, 0.2, 0.04]} />
              <meshLambertMaterial color={color === "white" ? "#f5f5dc" : "#2f2f2f"} />
            </mesh>
            <mesh position={[0, 0.55, 0]} rotation={[0, 0, Math.PI / 2]}>
              <boxGeometry args={[0.04, 0.12, 0.04]} />
              <meshLambertMaterial color={color === "white" ? "#f5f5dc" : "#2f2f2f"} />
            </mesh>
          </group>
        )

      default:
        return <sphereGeometry args={[0.2, 8, 8]} />
    }
  }

  // Update the return statement to remove the material since it's now handled in each geometry group
  const yPosition = isSelected ? position[1] + 0.3 : position[1]

  return (
    <group position={[position[0], yPosition, position[2]]}>
      {getPieceGeometry()}
      {isSelected && (
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.02, 16]} />
          <meshBasicMaterial color="#ffd700" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  )
}
